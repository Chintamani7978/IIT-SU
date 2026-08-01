import { ShieldCheck, Clock, CheckCircle2, FileText, Video, FlaskConical, BookOpen } from 'lucide-react';
import { getPendingResources } from '@/lib/db';
import ModerationActions from '@/components/ModerationActions';
import PdfPreviewModal from '@/components/PdfPreviewModal';
import VideoPreviewModal from '@/components/VideoPreviewModal';

export const dynamic = 'force-dynamic';

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  note:  { icon: BookOpen,      color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
  pyq:   { icon: FileText,      color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  video: { icon: Video,         color: 'text-pink-400',   bg: 'bg-pink-500/10 border-pink-500/20' },
  lab:   { icon: FlaskConical,  color: 'text-emerald-400',bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

export default async function ModerationPage() {
  const pending = await getPendingResources();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Moderation Queue</h1>
            <p className="text-[var(--muted-foreground)] text-sm mt-0.5">Review and approve community uploaded resources</p>
          </div>
        </div>
        {/* Counter badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${
          pending.length > 0
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : 'bg-green-500/10 border-green-500/30 text-green-400'
        }`}>
          {pending.length > 0
            ? <><Clock className="w-4 h-4" /> {pending.length} Pending</>
            : <><CheckCircle2 className="w-4 h-4" /> All Clear</>
          }
        </div>
      </div>

      {pending.length === 0 ? (
        /* Empty state */
        <div className="dash-card p-16 text-center border-dashed flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">All caught up!</h2>
            <p className="text-[var(--muted-foreground)] mt-1 text-sm">No pending resources to moderate right now.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((resource) => {
            const cfg = typeConfig[resource.type] ?? typeConfig.note;
            const Icon = cfg.icon;
            const previewUrl = resource.type === 'video' ? resource.videoUrl : resource.pdfUrl;

            return (
              <div
                key={resource.id}
                className="dash-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-[var(--card-hover)] transition-all duration-200 group"
              >
                {/* Left — resource info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Type icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${cfg.bg}`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    {/* Title + type badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded border ${cfg.bg} ${cfg.color}`}>
                        {resource.type}
                      </span>
                      <h3 className="text-base font-semibold text-[var(--foreground)] truncate">
                        {resource.title}
                      </h3>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-[var(--muted-foreground)]">
                      <span>
                        Subject:{' '}
                        <span className="text-[var(--foreground)]/70 font-medium">
                          {resource.subjectName
                            ? `${resource.subjectName} (${resource.subjectCode})`
                            : resource.subjectId}
                        </span>
                      </span>
                      <span>
                        By:{' '}
                        <span className="text-[var(--foreground)]/70 font-medium">
                          {resource.authorName}
                          {resource.batch && ` · Batch ${resource.batch}`}
                        </span>
                      </span>
                      <span>
                        Submitted:{' '}
                        <span className="text-[var(--foreground)]/70">
                          {new Date(resource.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </span>
                    </div>

                    {/* Preview link */}
                    {previewUrl && previewUrl !== '#' && (
                      <div className="pt-0.5">
                        {resource.type === 'video' ? (
                          <VideoPreviewModal url={previewUrl} label="Preview Video" />
                        ) : (
                          <PdfPreviewModal url={previewUrl} label="Preview PDF" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right — approve / reject buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <ModerationActions resourceId={resource.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
