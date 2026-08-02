'use client';

import { useState, useTransition } from 'react';
import { Link2, CheckCircle2, Loader2 } from 'lucide-react';
import { submitResource } from '@/lib/actions';

export default function LectureLinkInput({ subjectId }: { subjectId: string }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = url.trim();
    if (!/^https:\/\//.test(trimmed)) {
      setError('Please paste a valid URL starting with https://');
      return;
    }

    startTransition(async () => {
      const result = await submitResource({
        subjectId,
        type: 'video',
        title: trimmed,
        authorName: 'Anonymous',
        videoUrl: trimmed,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
        setUrl('');
      }
    });
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl mb-6">
        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
        <p className="text-sm text-green-400">Lecture link submitted for review!</p>
        <button
          onClick={() => setSubmitted(false)}
          className="ml-auto text-xs text-zinc-400 hover:text-white underline"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2 p-3 bg-[var(--card)] border border-[var(--border)] rounded-xl mb-6">
      <Link2 className="w-4 h-4 text-[var(--primary)] shrink-0" />
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste a lecture video link..."
        className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
        disabled={isPending}
      />
      <button
        type="submit"
        disabled={isPending || !url.trim()}
        className="shrink-0 px-4 py-1.5 bg-[var(--primary)] hover:bg-[var(--neon-hover)] text-[var(--primary-foreground)] text-sm font-bold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
      </button>
      {error && (
        <p className="absolute left-0 top-full mt-1 text-xs text-red-400">{error}</p>
      )}
    </form>
  );
}
