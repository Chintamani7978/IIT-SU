'use client';

import { useState, useTransition } from 'react';
import { Check, XCircle, Trash2 } from 'lucide-react';
import { moderateResource, deleteResource } from '@/lib/actions';

export default function ModerationActions({ resourceId }: { resourceId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const decide = (decision: 'approved' | 'rejected') => {
    setError(null);
    let reason: string | undefined;
    if (decision === 'rejected') {
      reason = window.prompt('Reason for rejection (shown to the uploader):') ?? undefined;
      if (reason === undefined) return; // cancelled
    }
    startTransition(async () => {
      const result = await moderateResource(resourceId, decision, reason);
      if (result.error) setError(result.error);
    });
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      'Permanently delete this resource? This cannot be undone.'
    );
    if (!confirmed) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteResource(resourceId);
      if (result.error) setError(result.error);
    });
  };

  return (
    <div className="flex flex-col items-end gap-2 shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={() => decide('rejected')}
          disabled={isPending}
          title="Reject"
          className="flex items-center gap-1.5 px-3 py-2 bg-[var(--background)] hover:bg-red-500/10 text-[var(--muted-foreground)] hover:text-red-400 border border-[var(--border)] hover:border-red-500/30 rounded-md transition-colors disabled:opacity-60 text-sm"
        >
          <XCircle className="w-4 h-4" />
          Reject
        </button>
        <button
          onClick={() => decide('approved')}
          disabled={isPending}
          title="Approve"
          className="flex items-center gap-1.5 px-3 py-2 bg-[var(--primary)] hover:bg-[var(--neon-hover)] text-[var(--primary-foreground)] rounded-md transition-colors font-bold disabled:opacity-60 text-sm"
        >
          <Check className="w-4 h-4" />
          {isPending ? 'Saving…' : 'Approve'}
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          title="Delete permanently"
          className="flex items-center gap-1.5 px-3 py-2 bg-[var(--background)] hover:bg-red-600/20 text-[var(--muted-foreground)] hover:text-red-500 border border-[var(--border)] hover:border-red-600/40 rounded-md transition-colors disabled:opacity-60 text-sm"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {error && <p className="text-xs text-red-400 max-w-[200px] text-right">{error}</p>}
    </div>
  );
}
