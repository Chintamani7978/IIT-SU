'use client';

import Link from 'next/link';
import Image from 'next/image';

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

  const filteredNavItems = navItems;

  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--background)] hidden md:flex flex-col h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-black flex items-center justify-center font-bold">
            A
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--foreground)]">Admin Portal</h2>
            <p className="text-[10px] text-[var(--muted-foreground)]">Control Center</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search settings..."
              className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl py-2 pl-9 pr-4 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
        </div>

        <nav className="space-y-6">
          <div>
            <h3 className="px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
              Navigation
            </h3>
            <ul className="space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors font-medium text-sm ${
                        isActive
                          ? 'bg-[var(--primary)] text-black font-semibold'
                          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
              System
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
        </nav>
      </div>

      <div className="mt-auto p-6">
        <Link href="/" className="block">
          <Image
            src="/logo.svg"
            alt="SUIIT E-Learning Logo"
            width={120}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </Link>
      </div>
    </aside>
  );
}
