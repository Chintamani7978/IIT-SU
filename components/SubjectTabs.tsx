'use client';

import { useState, useTransition } from 'react';
import { Resource } from '@/lib/types';
import { FileText, FileQuestion, PlaySquare, FlaskConical, ThumbsUp, ShieldCheck, ExternalLink } from 'lucide-react';
import { upvoteResource } from '@/lib/mockDb';
import { toggleVote } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function SubjectTabs({
  resources,
  subjectId,
  live = false,
}: {
  resources: Resource[];
  subjectId?: string;
  live?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<'note' | 'pyq' | 'video' | 'lab'>('note');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterExam, setFilterExam] = useState<string>('all');
  const [voteError, setVoteError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const handleUpvote = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setVoteError(null);
    if (!live || !subjectId) {
      upvoteResource(id);
      router.refresh();
      return;
    }
    startTransition(async () => {
      const result = await toggleVote(id, subjectId);
      if (result.error) setVoteError(result.error);
    });
  };

  const filteredResources = resources.filter((r) => {
    if (r.type !== activeTab) return false;
    if (activeTab === 'pyq') {
      const pyq = r as Extract<Resource, { type: 'pyq' }>;
      if (filterYear !== 'all' && pyq.year !== filterYear) return false;
      if (filterExam !== 'all' && pyq.examType !== filterExam) return false;
    }
    return true;
  });

  const tabs = [
    { id: 'note', label: 'Class Notes', icon: FileText },
    { id: 'pyq', label: 'PYQs & Solutions', icon: FileQuestion },
    { id: 'video', label: 'Video Lectures', icon: PlaySquare },
    { id: 'lab', label: 'Lab Manuals', icon: FlaskConical },
  ] as const;

  const getResourceUrl = (resource: Resource): string => {
    if (resource.type === 'video') return (resource as Extract<Resource, { type: 'video' }>).videoUrl ?? '#';
    return (resource as Extract<Resource, { type: 'note' | 'pyq' | 'lab' }>).pdfUrl ?? '#';
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-[var(--border)] scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
                isActive
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* PYQ Filters */}
      {activeTab === 'pyq' && (
        <div className="flex flex-wrap gap-4 p-4 bg-[var(--card)] rounded-lg border border-[var(--border)]">
          <select
            value={filterExam}
            onChange={(e) => setFilterExam(e.target.value)}
            className="bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm rounded-md focus:ring-[var(--primary)] focus:border-[var(--primary)] block p-2 outline-none"
          >
            <option value="all">All Exams</option>
            <option value="mid-sem">Mid-Sem</option>
            <option value="end-sem">End-Sem</option>
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm rounded-md focus:ring-[var(--primary)] focus:border-[var(--primary)] block p-2 outline-none"
          >
            <option value="all">All Years</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
      )}

      {voteError && (
        <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md p-3">
          {voteError}
        </p>
      )}

      {/* Resource Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredResources.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[var(--muted-foreground)] bg-[var(--card)] rounded-xl border border-[var(--border)] border-dashed">
            No resources found for this tab.
          </div>
        ) : (
          filteredResources.map((resource) => {
            const url = getResourceUrl(resource);
            const isClickable = url && url !== '#';

            return (
              <a
                key={resource.id}
                href={isClickable ? url : undefined}
                target="_blank"
                rel="noreferrer"
                onClick={!isClickable ? (e) => e.preventDefault() : undefined}
                className={`dash-card p-5 flex flex-col justify-between group transition-all duration-200 ${
                  isClickable
                    ? 'cursor-pointer hover:border-[var(--primary)]/50 hover:shadow-lg hover:shadow-[var(--primary)]/5 hover:-translate-y-0.5'
                    : 'cursor-default'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-2 flex-1 pr-2">
                      {resource.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {resource.isVerified && (
                        <span title="Verified">
                          <ShieldCheck className="w-5 h-5 text-green-500" />
                        </span>
                      )}
                      {isClickable && (
                        <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 mb-4 text-sm">
                    <p className="text-[var(--muted-foreground)]">By {resource.authorName} {resource.batch && `(${resource.batch})`}</p>
                    {resource.unit && <p className="text-[var(--primary)]/80">{resource.unit}</p>}
                    {resource.type === 'pyq' && (
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded border border-purple-500/20 uppercase">
                          {resource.examType}
                        </span>
                        <span className="px-2 py-0.5 bg-[var(--background)] text-[var(--muted-foreground)] text-xs rounded border border-[var(--border)]">
                          {resource.year}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] mt-auto">
                  <button
                    onClick={(e) => handleUpvote(e, resource.id)}
                    className="flex items-center gap-1.5 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors bg-[var(--background)] hover:bg-[var(--card-hover)] px-3 py-1.5 rounded-md border border-[var(--border)]"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{resource.upvotes}</span>
                  </button>

                  <span className="text-sm text-[var(--primary)] font-medium group-hover:text-[var(--neon-hover)] transition-colors">
                    {resource.type === 'video' ? 'Watch Video →' : isClickable ? 'Open PDF →' : 'No file'}
                  </span>
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}


