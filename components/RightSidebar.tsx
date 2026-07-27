'use client';

import { MessageSquare } from 'lucide-react';
import { getPendingResources } from '@/lib/mockDb';

export default function RightSidebar() {
  const pendingCount = getPendingResources().length;

  const notifications = [
    { id: 1, text: `${pendingCount} Pending uploads for moderation.`, time: 'System', icon: MessageSquare, color: 'text-amber-400' },
  ];

  return (
    <aside className="w-72 border-l border-[var(--border)] bg-[var(--background)] hidden xl:flex flex-col h-full overflow-y-auto p-6">
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Notifications</h3>
        {notifications.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">No new notifications.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => {
              const Icon = n.icon;
              return (
                <div key={n.id} className="flex gap-3">
                  <div className="mt-0.5 p-1 rounded-full bg-[var(--card)] border border-[var(--border)] h-fit">
                    <Icon className={`w-3.5 h-3.5 ${n.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground)] leading-tight">{n.text}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)] mt-1">{n.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mb-8 border-t border-[var(--border)] pt-6">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Recent Activity</h3>
        <p className="text-sm text-[var(--muted-foreground)] italic">No recent system activity.</p>
      </div>
    </aside>
  );
}
