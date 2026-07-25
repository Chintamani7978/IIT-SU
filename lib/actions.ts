'use server';

import { revalidatePath } from 'next/cache';
import { createClient, isSupabaseConfigured } from './supabase/server';
import { getCurrentUser, isModerator } from './auth';

export interface ActionResult {
  error?: string;
}

const NOT_CONFIGURED: ActionResult = {
  error: 'Backend is not configured yet (see supabase/README.md).',
};

export interface SubmitResourceInput {
  subjectId: string;
  type: 'note' | 'pyq' | 'video' | 'lab';
  title: string;
  authorName: string;
  batch?: string;
  unit?: string;
  // storage object path for note/pyq/lab, uploaded by the browser beforehand
  filePath?: string;
  videoUrl?: string;
  examType?: 'mid-sem' | 'end-sem';
  examYear?: string;
}

export async function submitResource(input: SubmitResourceInput): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    // In demo mode, modify the server's in-memory mock database
    const { addResource } = await import('./mockDb');
    
    const newResource = {
      id: `res-${Date.now()}`,
      subjectId: input.subjectId,
      title: input.title,
      authorName: input.authorName || 'Anonymous',
      batch: input.batch || '',
      type: input.type,
      unit: input.unit || undefined,
      upvotes: 0,
      isVerified: false,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...(input.type === 'video'
        ? { videoUrl: input.videoUrl || '#' }
        : { pdfUrl: input.filePath || '#', badges: [] }),
      ...(input.type === 'pyq' ? { examType: input.examType, year: input.examYear } : {}),
    };
    
    addResource(newResource as any);
    revalidatePath(`/subject/${input.subjectId}`);
    revalidatePath('/admin/moderation');
    revalidatePath('/admin');
    return {};
  }

  const user = await getCurrentUser();

  const title = input.title?.trim();
  if (!title || title.length < 3 || title.length > 200) {
    return { error: 'Title must be between 3 and 200 characters.' };
  }
  if (!['note', 'pyq', 'video', 'lab'].includes(input.type)) {
    return { error: 'Invalid resource type.' };
  }
  if (input.type === 'video') {
    if (!input.videoUrl || !/^https:\/\//.test(input.videoUrl)) {
      return { error: 'Video link must be an https:// URL.' };
    }
  } else {
    const prefix = user ? `${user.id}/` : 'anonymous/';
    if (!input.filePath || !input.filePath.startsWith(prefix)) {
      return { error: 'File upload missing or invalid.' };
    }
  }

  const isAdmin = isModerator(user);
  const status = isAdmin ? 'approved' : 'pending';
  const isVerified = isAdmin;

  const supabase = await createClient();
  const { error } = await supabase.from('resources').insert({
    subject_id: input.subjectId,
    type: input.type,
    title,
    uploader_id: user?.id || null,
    author_name: input.authorName?.trim() || user?.name || 'Anonymous',
    batch: input.batch?.trim() || null,
    unit: input.unit?.trim() || null,
    file_path: input.type === 'video' ? null : input.filePath,
    video_url: input.type === 'video' ? input.videoUrl : null,
    status,
    is_verified: isVerified,
    exam_type: input.type === 'pyq' ? input.examType ?? 'end-sem' : null,
    exam_year: input.type === 'pyq' ? input.examYear ?? null : null,
  });
  if (error) return { error: error.message };

  return {};
}

export async function moderateResource(
  resourceId: string,
  decision: 'approved' | 'rejected',
  reason?: string
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const user = await getCurrentUser();
  if (!isModerator(user)) return { error: 'Moderator access required.' };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('resources')
    .update({
      status: decision,
      is_verified: decision === 'approved',
      rejection_reason: decision === 'rejected' ? reason?.trim() || null : null,
    })
    .eq('id', resourceId)
    .eq('status', 'pending')
    .select('subject_id')
    .maybeSingle();
  if (error) return { error: error.message };
  if (!data) return { error: 'Resource not found or already moderated.' };

  revalidatePath(`/subject/${data.subject_id}`);
  revalidatePath('/admin/moderation');
  return {};
}

export async function toggleVote(resourceId: string, subjectId: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const user = await getCurrentUser();
  if (!user) return { error: 'Sign in to vote.' };

  const supabase = await createClient();
  const { error: insertError } = await supabase
    .from('votes')
    .insert({ user_id: user.id, resource_id: resourceId });

  if (insertError) {
    // 23505 = unique violation → the user already voted, so remove the vote.
    if (insertError.code === '23505') {
      const { error: deleteError } = await supabase
        .from('votes')
        .delete()
        .eq('user_id', user.id)
        .eq('resource_id', resourceId);
      if (deleteError) return { error: deleteError.message };
    } else {
      return { error: insertError.message };
    }
  }

  revalidatePath(`/subject/${subjectId}`);
  return {};
}
