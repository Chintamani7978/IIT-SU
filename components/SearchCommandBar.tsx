'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Book, FileText, FileQuestion, PlaySquare, FlaskConical, Loader2 } from 'lucide-react';
import type { Subject, Resource } from '@/lib/types';

type ResourceHit = Resource & { subjectName?: string; subjectCode?: string };

const RESOURCE_ICON = {
  note: FileText,
  pyq: FileQuestion,
  video: PlaySquare,
  lab: FlaskConical,
} as const;

export default function SearchCommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [resources, setResources] = useState<ResourceHit[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Handle Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      const timer = setTimeout(() => {
        setSubjects([]);
        setResources([]);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }
    const startLoadingTimer = setTimeout(() => {
      setLoading(true);
    }, 0);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
        .then((res) => res.json())
        .then((data) => {
          setSubjects(data.subjects ?? []);
          setResources(data.resources ?? []);
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      clearTimeout(startLoadingTimer);
      clearTimeout(debounceRef.current);
    };
  }, [query]);

  const goToSubject = (subjectId: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/subject/${subjectId}`);
  };

  const hasResults = subjects.length > 0 || resources.length > 0;

  return (
    <>
      {/* Global Search Button (Mobile/Desktop) */}
      <div className="fixed bottom-6 right-6 md:top-4 md:right-4 md:bottom-auto z-40 md:z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-400 px-4 py-2 rounded-full shadow-lg transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden md:inline font-mono text-xs bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">⌘K</kbd>
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4 pb-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl rounded-xl overflow-hidden dash-card">
            <div className="flex items-center px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]">
              <Search className="w-5 h-5 text-[var(--primary)] mr-3" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search subjects, notes, PYQs..."
                className="flex-1 bg-transparent border-none outline-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] text-lg"
              />
              {loading && <Loader2 className="w-4 h-4 text-[var(--muted-foreground)] animate-spin mr-2" />}
              <button onClick={() => setIsOpen(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-2 bg-[var(--card)]">
              {query.trim().length < 2 ? (
                <div className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                  <p>Type at least 2 characters to search...</p>
                </div>
              ) : !loading && !hasResults ? (
                <p className="text-center text-[var(--muted-foreground)] py-8">No results found.</p>
              ) : (
                <>
                  {subjects.length > 0 && (
                    <div className="mb-2">
                      <p className="px-4 py-1.5 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                        Subjects
                      </p>
                      <ul className="space-y-1">
                        {subjects.map((subject) => (
                          <li key={subject.id}>
                            <button
                              onClick={() => goToSubject(subject.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-[var(--card-hover)] group transition-colors"
                            >
                              <div className="bg-[var(--background)] p-2 rounded-md border border-[var(--border)] group-hover:border-[var(--primary)] text-[var(--primary)] transition-colors">
                                <Book className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                                  {subject.name}
                                </p>
                                <p className="text-xs text-[var(--muted-foreground)]">{subject.code}</p>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {resources.length > 0 && (
                    <div>
                      <p className="px-4 py-1.5 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                        Resources
                      </p>
                      <ul className="space-y-1">
                        {resources.map((resource) => {
                          const Icon = RESOURCE_ICON[resource.type];
                          return (
                            <li key={resource.id}>
                              <button
                                onClick={() => goToSubject(resource.subjectId)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-[var(--card-hover)] group transition-colors"
                              >
                                <div className="bg-[var(--background)] p-2 rounded-md border border-[var(--border)] group-hover:border-[var(--primary)] text-[var(--primary)] transition-colors">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-1">
                                    {resource.title}
                                  </p>
                                  <p className="text-xs text-[var(--muted-foreground)]">
                                    {resource.subjectName ? `${resource.subjectName} (${resource.subjectCode})` : ''}
                                  </p>
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
