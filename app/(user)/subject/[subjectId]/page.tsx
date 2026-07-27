import { SUBJECTS } from '@/lib/mockDb';
import { getSubjectById, getResourcesBySubjectId } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import SubjectTabs from '@/components/SubjectTabs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import UploadModal from '@/components/UploadModal';

// Re-render periodically so newly approved resources appear and the signed
// PDF URLs (1h TTL) never go stale on a cached page.
export const revalidate = 300;

export default async function SubjectPage({
  params
}: {
  params: Promise<{ subjectId: string }>
}) {
  const { subjectId } = await params;
  const subject = await getSubjectById(subjectId);

  if (!subject) {
    return (
      <div className="text-center py-24">
        <h1 className="text-2xl text-[var(--foreground)] mb-4">Subject not found</h1>
        <Link href="/departments" className="text-[var(--primary)] hover:underline">Return to Departments</Link>
      </div>
    );
  }

  const resources = await getResourcesBySubjectId(subject.id);
  const live = isSupabaseConfigured();

  return (
    <div className="min-h-[calc(100vh-120px)] max-w-5xl mx-auto px-4 py-8 flex flex-col justify-center">
      <div className="flex flex-col items-center text-center">
        <Link href={`/department/${subject.branchId}/${subject.year}`} className="group flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 hover:text-[var(--primary)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300 ease-out" /> 
          Back to Subjects
        </Link>

        <div className="mb-12">
          <p className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 mb-4 uppercase border border-white/10 px-3 py-1 rounded inline-block">
            {subject.code}
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none max-w-4xl mx-auto mb-4">
            {subject.name}
          </h1>
          <p className="text-sm font-mono text-[var(--primary)] tracking-widest uppercase">
            Year {subject.year} <span className="text-zinc-600 mx-2">/</span> Semester {subject.semester}
          </p>
        </div>

        <div className="mb-12">
          <UploadModal subjectId={subject.id} live={live} />
        </div>
      </div>

      <div className="w-full h-px bg-white/10 mb-8"></div>

      <main className="w-full">
        <SubjectTabs resources={resources} subjectId={subject.id} live={live} />
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  return SUBJECTS.map((subject) => ({
    subjectId: subject.id,
  }));
}
