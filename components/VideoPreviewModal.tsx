'use client';

import { useState } from 'react';
import { Video, X, ExternalLink } from 'lucide-react';

function getYouTubeEmbedId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1);
    }
  } catch {
    return null;
  }
  return null;
}

export default function VideoPreviewModal({ url, label = 'Preview Video' }: { url: string; label?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!url || url === '#') {
    return <span className="text-sm text-[var(--muted-foreground)]">No video</span>;
  }

  const youtubeId = getYouTubeEmbedId(url);
  const embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-[var(--primary)] hover:text-[var(--neon-hover)] font-medium transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        {label}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-4xl h-[85vh] bg-[var(--card)] border border-[var(--border)] shadow-2xl rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
              <div className="flex items-center gap-2 text-[var(--foreground)] font-medium">
                <Video className="w-4 h-4 text-[var(--primary)]" />
                Video preview
              </div>
              <div className="flex items-center gap-4">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[var(--primary)] hover:text-[var(--neon-hover)]"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in new tab
                </a>
                <button onClick={() => setIsOpen(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title="Video preview"
                className="flex-1 w-full bg-black"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[var(--muted-foreground)]">
                <Video className="w-12 h-12 opacity-40" />
                <p className="text-sm">This video cannot be embedded.</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium text-sm hover:bg-[var(--neon-hover)] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Video in New Tab
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
