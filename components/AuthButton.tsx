'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User as UserIcon, FileText, LayoutDashboard } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    
    const fetchUserAndRole = async (u: User | null) => {
      setUser(u);
      if (u) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', u.id)
          .maybeSingle();
        setRole(profile?.role ?? 'student');
      } else {
        setRole(null);
      }
    };

    supabase.auth.getUser().then(({ data }) => fetchUserAndRole(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserAndRole(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const signOut = async () => {
    await createClient().auth.signOut();
    setMenuOpen(false);
    router.refresh();
  };

  if (!user) {
    return (
      <Link
        href="/login"
        title="Sign in"
        className="w-11 h-11 flex justify-center items-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shrink-0 text-zinc-300 hover:text-white"
      >
        <UserIcon className="w-5 h-5" />
      </Link>
    );
  }

  const initial = (user.user_metadata?.full_name ?? user.email ?? '?')
    .charAt(0)
    .toUpperCase();

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((open) => !open)}
        title={user.email}
        className="w-11 h-11 flex justify-center items-center rounded-full bg-[var(--primary)]/20 hover:bg-[var(--primary)]/30 border border-[var(--primary)]/40 transition-colors text-[var(--primary)] font-bold"
      >
        {initial}
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <p className="text-sm font-medium text-[var(--foreground)] truncate">
              {user.user_metadata?.full_name ?? 'Student'}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] truncate">{user.email}</p>
          </div>
          {(role === 'admin' || role === 'moderator') && (
            <Link
              href="/admin/moderation"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors border-b border-[var(--border)]"
            >
              <LayoutDashboard className="w-4 h-4 text-[var(--primary)]" /> Admin Dashboard
            </Link>
          )}
          <Link
            href="/my-uploads"
            onClick={() => setMenuOpen(false)}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors"
          >
            <FileText className="w-4 h-4" /> My Uploads
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--muted-foreground)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
