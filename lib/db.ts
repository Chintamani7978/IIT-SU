// Server-side data access. Reads from Supabase when configured, otherwise
// falls back to the local mock data so the app keeps working before the
// team wires up a Supabase project (see supabase/README.md).
import 'server-only';
import { createClient as createAnonClient, SupabaseClient } from '@supabase/supabase-js';
import { Department, Resource, Subject } from './types';
import { isSupabaseConfigured } from './supabase/server';
import * as mock from './mockDb';

// Public catalog/resource reads use a session-less anon client so pages can
// stay statically rendered (the cookie-bound client in lib/supabase/server.ts
// would force dynamic rendering; it is for authenticated operations only).
let anonClient: SupabaseClient | undefined;
function createClient(): SupabaseClient {
  anonClient ??= createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } }
  );
  return anonClient;
}

const SIGNED_URL_TTL_SECONDS = 60 * 60;

interface ResourceRow {
  id: string;
  subject_id: string;
  type: 'note' | 'pyq' | 'video' | 'lab';
  title: string;
  author_name: string;
  batch: string | null;
  unit: string | null;
  status: 'pending' | 'approved' | 'rejected';
  is_verified: boolean;
  badges: string[];
  file_path: string | null;
  video_url: string | null;
  exam_type: 'mid-sem' | 'end-sem' | null;
  exam_year: string | null;
  code_snippet: string | null;
  viva_questions: string[] | null;
  created_at: string;
  votes: { count: number }[];
}

function rowToResource(row: ResourceRow, pdfUrl: string): Resource {
  const base = {
    id: row.id,
    subjectId: row.subject_id,
    title: row.title,
    authorName: row.author_name,
    batch: row.batch ?? undefined,
    unit: row.unit ?? undefined,
    upvotes: row.votes[0]?.count ?? 0,
    isVerified: row.is_verified,
    status: row.status,
    createdAt: row.created_at,
  };

  switch (row.type) {
    case 'note':
      return { ...base, type: 'note', pdfUrl, badges: row.badges };
    case 'pyq':
      return {
        ...base,
        type: 'pyq',
        pdfUrl,
        examType: row.exam_type ?? 'end-sem',
        year: row.exam_year ?? '',
      };
    case 'video':
      return { ...base, type: 'video', videoUrl: row.video_url ?? '' };
    case 'lab':
      return {
        ...base,
        type: 'lab',
        pdfUrl,
        codeSnippet: row.code_snippet ?? undefined,
        vivaQuestions: row.viva_questions ?? undefined,
      };
  }
}

export async function getDepartments(): Promise<Department[]> {
  if (!isSupabaseConfigured()) return mock.DEPARTMENTS;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('departments')
    .select('id, name, branches (id, name)')
    .order('id');
  if (error) throw error;
  return data as Department[];
}

export async function getSubjectsByBranchYearSemester(
  branchId: string,
  year: number,
  semester: number
): Promise<Subject[]> {
  if (!isSupabaseConfigured())
    return mock.getSubjectsByBranchYearSemester(branchId, year, semester);

  const supabase = createClient();
  const { data, error } = await supabase
    .from('subjects')
    .select('id, name, code, branch_id, year, semester, credits, type')
    .eq('branch_id', branchId)
    .eq('year', year)
    .eq('semester', semester)
    .order('code');
  if (error) throw error;
  return data.map(({ branch_id, ...s }) => ({ ...s, branchId: branch_id })) as Subject[];
}

export async function getSubjectsByBranchYear(
  branchId: string,
  year: number
): Promise<Subject[]> {
  if (!isSupabaseConfigured()) return mock.getSubjectsByBranchAndYear(branchId, year);

  const supabase = createClient();
  const { data, error } = await supabase
    .from('subjects')
    .select('id, name, code, branch_id, year, semester, credits, type')
    .eq('branch_id', branchId)
    .eq('year', year)
    .order('code');
  if (error) throw error;
  return data.map(({ branch_id, ...s }) => ({ ...s, branchId: branch_id })) as Subject[];
}

export async function getSubjectById(subjectId: string): Promise<Subject | undefined> {
  if (!isSupabaseConfigured()) return mock.getSubjectById(subjectId);

  const supabase = createClient();
  const { data, error } = await supabase
    .from('subjects')
    .select('id, name, code, branch_id, year, semester, credits, type')
    .eq('id', subjectId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return undefined;
  const { branch_id, ...s } = data;
  return { ...s, branchId: branch_id } as Subject;
}

export async function getResourcesBySubjectId(subjectId: string): Promise<Resource[]> {
  if (!isSupabaseConfigured()) return mock.getResourcesBySubjectId(subjectId);

  const supabase = createClient();
  const { data, error } = await supabase
    .from('resources')
    .select('*, votes (count)')
    .eq('subject_id', subjectId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
  if (error) throw error;

  const rows = data as ResourceRow[];
  const paths = rows.map((r) => r.file_path).filter((p): p is string => p !== null);
  const signedByPath = new Map<string, string>();
  if (paths.length > 0) {
    const { data: signed } = await supabase.storage
      .from('resources')
      .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
    for (const s of signed ?? []) {
      if (s.signedUrl && s.path) signedByPath.set(s.path, s.signedUrl);
    }
  }

  return rows.map((row) =>
    rowToResource(row, row.file_path ? signedByPath.get(row.file_path) ?? '#' : '#')
  );
}

export type PendingResource = Resource & { subjectName?: string; subjectCode?: string };

// Moderator-only read: uses the cookie-bound client so RLS sees the caller's
// role. Returns pending items with short-lived signed preview URLs.
export async function getPendingResources(): Promise<PendingResource[]> {
  if (!isSupabaseConfigured()) return mock.getPendingResources();

  const { createClient: createCookieClient } = await import('./supabase/server');
  const supabase = await createCookieClient();
  const { data, error } = await supabase
    .from('resources')
    .select('*, votes (count), subjects (name, code)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });
  if (error) throw error;

  const rows = data as (ResourceRow & { subjects: { name: string; code: string } | null })[];
  const paths = rows.map((r) => r.file_path).filter((p): p is string => p !== null);
  const signedByPath = new Map<string, string>();
  if (paths.length > 0) {
    const { data: signed } = await supabase.storage
      .from('resources')
      .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
    for (const s of signed ?? []) {
      if (s.signedUrl && s.path) signedByPath.set(s.path, s.signedUrl);
    }
  }

  return rows.map((row) => ({
    ...rowToResource(row, row.file_path ? signedByPath.get(row.file_path) ?? '#' : '#'),
    subjectName: row.subjects?.name,
    subjectCode: row.subjects?.code,
  }));
}

// Moderator-only... no — this reads the signed-in user's own submissions,
// all statuses, via the cookie-bound client (RLS: "uploaders see own submissions").
export async function getMyResources(): Promise<PendingResource[]> {
  if (!isSupabaseConfigured()) return [];

  const { createClient: createCookieClient } = await import('./supabase/server');
  const supabase = await createCookieClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('resources')
    .select('*, votes (count), subjects (name, code)')
    .eq('uploader_id', user.id)
    .order('created_at', { ascending: false });
  if (error) throw error;

  const rows = data as (ResourceRow & { subjects: { name: string; code: string } | null })[];
  const paths = rows.map((r) => r.file_path).filter((p): p is string => p !== null);
  const signedByPath = new Map<string, string>();
  if (paths.length > 0) {
    const { data: signed } = await supabase.storage
      .from('resources')
      .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
    for (const s of signed ?? []) {
      if (s.signedUrl && s.path) signedByPath.set(s.path, s.signedUrl);
    }
  }

  return rows.map((row) => ({
    ...rowToResource(row, row.file_path ? signedByPath.get(row.file_path) ?? '#' : '#'),
    subjectName: row.subjects?.name,
    subjectCode: row.subjects?.code,
  }));
}

export interface SearchResults {
  subjects: Subject[];
  resources: (Resource & { subjectName?: string; subjectCode?: string })[];
}

// Public catalog search: subjects by name/code, approved resources by title.
// Uses ilike substring matching (simple, index-free but fine at this scale)
// rather than the tsvector GIN indexes — good enough per the project plan.
export async function searchCatalog(query: string): Promise<SearchResults> {
  const q = query.trim();
  if (q.length < 2) return { subjects: [], resources: [] };
  if (!isSupabaseConfigured()) return mock.searchCatalog(q);

  const supabase = createClient();
  const pattern = `%${q.replace(/[%_]/g, (c) => `\\${c}`)}%`;

  const [byName, byCode, resourcesRes] = await Promise.all([
    supabase
      .from('subjects')
      .select('id, name, code, branch_id, year, semester, credits, type')
      .ilike('name', pattern)
      .limit(8),
    supabase
      .from('subjects')
      .select('id, name, code, branch_id, year, semester, credits, type')
      .ilike('code', pattern)
      .limit(8),
    supabase
      .from('resources')
      .select('*, votes (count), subjects (name, code)')
      .eq('status', 'approved')
      .ilike('title', pattern)
      .order('created_at', { ascending: false })
      .limit(8),
  ]);
  if (byName.error) throw byName.error;
  if (byCode.error) throw byCode.error;
  if (resourcesRes.error) throw resourcesRes.error;

  const subjectRows = new Map<string, (typeof byName.data)[number]>();
  for (const row of [...byName.data, ...byCode.data]) subjectRows.set(row.id, row);
  const subjects = [...subjectRows.values()]
    .slice(0, 8)
    .map(({ branch_id, ...s }) => ({ ...s, branchId: branch_id })) as Subject[];

  const rows = resourcesRes.data as (ResourceRow & { subjects: { name: string; code: string } | null })[];
  const paths = rows.map((r) => r.file_path).filter((p): p is string => p !== null);
  const signedByPath = new Map<string, string>();
  if (paths.length > 0) {
    const { data: signed } = await supabase.storage
      .from('resources')
      .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
    for (const s of signed ?? []) {
      if (s.signedUrl && s.path) signedByPath.set(s.path, s.signedUrl);
    }
  }
  const resources = rows.map((row) => ({
    ...rowToResource(row, row.file_path ? signedByPath.get(row.file_path) ?? '#' : '#'),
    subjectName: row.subjects?.name,
    subjectCode: row.subjects?.code,
  }));

  return { subjects, resources };
}

export function findBranch(departments: Department[], branchId: string) {
  for (const dept of departments) {
    const branch = dept.branches.find((b) => b.id === branchId);
    if (branch) return { department: dept, branch };
  }
  return undefined;
}

export interface AdminStats {
  totalNotes: number;
  totalPyqs: number;
  totalVideos: number;
  totalLabs: number;
  pendingCount: number;
  approvedCount: number;
  recentUploads: {
    id: string;
    title: string;
    type: string;
    authorName: string;
    status: string;
    createdAt: string;
    subjectName?: string;
    pdfUrl?: string;
    videoUrl?: string;
  }[];
}

export async function getAdminStats(): Promise<AdminStats> {
  const empty: AdminStats = {
    totalNotes: 0, totalPyqs: 0, totalVideos: 0, totalLabs: 0,
    pendingCount: 0, approvedCount: 0, recentUploads: [],
  };
  if (!isSupabaseConfigured()) {
    // Use mock data counts
    const all = mock.RESOURCES;
    return {
      totalNotes: all.filter((r) => r.type === 'note').length,
      totalPyqs: all.filter((r) => r.type === 'pyq').length,
      totalVideos: all.filter((r) => r.type === 'video').length,
      totalLabs: all.filter((r) => r.type === 'lab').length,
      pendingCount: all.filter((r) => r.status === 'pending').length,
      approvedCount: all.filter((r) => r.status === 'approved').length,
      recentUploads: [...all]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
        .map((r) => ({
          id: r.id, title: r.title, type: r.type,
          authorName: r.authorName, status: r.status, createdAt: r.createdAt,
        })),
    };
  }

  const { createClient: createCookieClient } = await import('./supabase/server');
  const supabase = await createCookieClient();

  const { data, error } = await supabase
    .from('resources')
    .select('id, title, type, author_name, status, created_at, file_path, video_url, subjects (name)')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error || !data) return empty;

  const rows = data as unknown as {
    id: string; title: string; type: string; author_name: string;
    status: string; created_at: string; file_path: string | null; video_url: string | null;
    subjects: { name: string } | null;
  }[];

  // Generate signed URLs for PDF file paths
  const filePaths = rows.map((r) => r.file_path).filter((p): p is string => p !== null);
  const signedByPath = new Map<string, string>();
  if (filePaths.length > 0) {
    const { data: signed } = await supabase.storage
      .from('resources')
      .createSignedUrls(filePaths, 3600);
    for (const s of signed ?? []) {
      if (s.signedUrl && s.path) signedByPath.set(s.path, s.signedUrl);
    }
  }

  return {
    totalNotes:    rows.filter((r) => r.type === 'note').length,
    totalPyqs:     rows.filter((r) => r.type === 'pyq').length,
    totalVideos:   rows.filter((r) => r.type === 'video').length,
    totalLabs:     rows.filter((r) => r.type === 'lab').length,
    pendingCount:  rows.filter((r) => r.status === 'pending').length,
    approvedCount: rows.filter((r) => r.status === 'approved').length,
    recentUploads: rows.slice(0, 10).map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      authorName: r.author_name,
      status: r.status,
      createdAt: r.created_at,
      subjectName: r.subjects?.name,
      pdfUrl: r.file_path ? signedByPath.get(r.file_path) ?? undefined : undefined,
      videoUrl: r.video_url ?? undefined,
    })),
  };
}
