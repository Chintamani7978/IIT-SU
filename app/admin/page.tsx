import { ArrowRight, FileText, FileQuestion, PlaySquare, FlaskConical, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { getAdminStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

const typeStyles: Record<string, { color: string; bg: string }> = {
  note:  { color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
  pyq:   { color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/20' },
  video: { color: 'text-pink-400',    bg: 'bg-pink-500/10 border-pink-500/20' },
  lab:   { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  const statCards = [
    { label: 'Class Notes',        value: stats.totalNotes,    icon: FileText,    color: 'text-blue-400',    iconBg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'PYQs',               value: stats.totalPyqs,     icon: FileQuestion,color: 'text-purple-400',  iconBg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Video Lectures',     value: stats.totalVideos,   icon: PlaySquare,  color: 'text-pink-400',    iconBg: 'bg-pink-500/10 border-pink-500/20' },
    { label: 'Lab Manuals',        value: stats.totalLabs,     icon: FlaskConical,color: 'text-emerald-400', iconBg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Approved Resources', value: stats.approvedCount, icon: CheckCircle2,color: 'text-green-400',   iconBg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Pending Review',     value: stats.pendingCount,  icon: Clock,       color: 'text-amber-400',   iconBg: 'bg-amber-500/10 border-amber-500/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Overview</h1>
          <p className="text-[var(--muted-foreground)] mt-1 text-sm">Live statistics from the platform database</p>
        </div>
        {stats.pendingCount > 0 && (
          <Link
            href="/admin/moderation"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-lg text-sm font-medium transition-colors"
          >
            <Clock className="w-4 h-4" />
            {stats.pendingCount} pending
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="dash-card p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--muted-foreground)]">{card.label}</p>
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${card.iconBg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <p className={`text-4xl font-bold tracking-tight ${card.color}`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Uploads */}
      <div className="dash-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Uploads</h2>
          <Link href="/admin/moderation" className="text-sm text-[var(--primary)] hover:text-[var(--neon-hover)] transition-colors flex items-center gap-1">
            View queue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentUploads.length === 0 ? (
          <div className="py-10 text-center text-[var(--muted-foreground)] text-sm border border-dashed border-[var(--border)] rounded-xl">
            No uploads yet — they will appear here once students start uploading.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider border-b border-[var(--border)]">
                <tr>
                  <th className="px-3 py-3 font-medium">Title</th>
                  <th className="px-3 py-3 font-medium">Type</th>
                  <th className="px-3 py-3 font-medium">Subject</th>
                  <th className="px-3 py-3 font-medium">By</th>
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {stats.recentUploads.map((r) => {
                  const ts = typeStyles[r.type] ?? typeStyles.note;
                  return (
                    <tr key={r.id} className="hover:bg-[var(--card-hover)] transition-colors">
                      <td className="px-3 py-3 font-medium text-[var(--foreground)] max-w-[200px] truncate">{r.title}</td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded border ${ts.bg} ${ts.color}`}>
                          {r.type}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[var(--muted-foreground)] max-w-[140px] truncate">{r.subjectName ?? '—'}</td>
                      <td className="px-3 py-3 text-[var(--muted-foreground)]">{r.authorName}</td>
                      <td className="px-3 py-3 text-[var(--muted-foreground)] whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${
                          r.status === 'approved'
                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                            : r.status === 'rejected'
                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
