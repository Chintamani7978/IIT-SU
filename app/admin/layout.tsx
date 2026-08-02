import AdminSidebar from "@/components/AdminSidebar";
import RightSidebar from "@/components/RightSidebar";
import { Moon, RefreshCw, Bell, Globe } from "lucide-react";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/supabase/server';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Gate: only signed-in users may enter the admin area.
  // In demo mode (no Supabase) the area stays open for local development.
  if (isSupabaseConfigured()) {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login?next=/admin');
  }

  return (
    <>
      {/* Left Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Dashboard Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-[var(--border)] bg-[var(--background)] shrink-0">
          <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
            <div className="flex items-center gap-2">
              <LayersIcon className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center gap-5 text-[var(--muted-foreground)]">
            <Link href="/" className="px-3 py-1 text-xs border border-[var(--border)] rounded hover:bg-[var(--card)] hover:text-[var(--foreground)] transition-colors">
              View Student UI
            </Link>
            <button className="hover:text-[var(--foreground)] transition-colors"><Moon className="w-4 h-4" /></button>
            <button className="hover:text-[var(--foreground)] transition-colors"><RefreshCw className="w-4 h-4" /></button>
            <button className="hover:text-[var(--foreground)] transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 border border-[var(--background)]"></span>
            </button>
            <button className="hover:text-[var(--foreground)] transition-colors"><Globe className="w-4 h-4" /></button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </>
  );
}

function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
      <polyline points="2 12 12 17 22 12"></polyline>
      <polyline points="2 17 12 22 22 17"></polyline>
    </svg>
  );
}
