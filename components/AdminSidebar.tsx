'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShieldCheck, Search, Settings, HelpCircle, MessageSquare } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Moderation', href: '/admin/moderation', icon: ShieldCheck },
  ];

  const settingsItems = [
    { name: 'Messages', href: '#', icon: MessageSquare },
    { name: 'Settings', href: '#', icon: Settings },
    { name: 'Help Centre', href: '#', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--background)] flex flex-col h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center font-bold text-[var(--primary)] text-xl shrink-0">
            K
          </div>
          <div>
            <h2 className="font-semibold text-sm">Kunu Sharma</h2>
            <p className="text-xs text-[var(--muted-foreground)]">Admin</p>
          </div>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-md pl-9 pr-8 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[var(--muted-foreground)] bg-[var(--background)] px-1 rounded border border-[var(--border)]">
            ⌘K
          </kbd>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 px-3">
              Dashboards
            </h3>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm ${isActive
                          ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]'
                        }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 px-3">
              Settings
            </h3>
            <ul className="space-y-1">
              {settingsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl transition-colors font-medium text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-auto p-6">
        <Link href="/" className="block">
          <img
            src="/logo.svg"
            alt="SUIIT E-Learning Logo"
            className="h-12 w-auto"
          />
        </Link>
      </div>
    </aside>
  );
}
