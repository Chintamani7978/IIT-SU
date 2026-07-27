'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DEPARTMENTS } from '@/lib/mockDb';
import { Home, GraduationCap, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function UserSidebar() {
  const pathname = usePathname();
  const [openDept, setOpenDept] = useState<string | null>(null);            

  useEffect(() => {
    for (const dept of DEPARTMENTS) {
      for (const branch of dept.branches) {
        if (pathname.includes(branch.id) || pathname.includes(`/subject/`)) {
          const timer = setTimeout(() => {
            setOpenDept(dept.id);
          }, 0);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [pathname]);

  return (
    <aside className="w-72 border-r border-[var(--border)] bg-[var(--background)] flex flex-col h-full overflow-y-auto">
      <div className="p-4 flex-1">
        <div className="mb-6">
          <Link 
            href="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
              pathname === '/' 
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]'
            }`}
          >
            <Home className="w-5 h-5 shrink-0" />
            Home
          </Link>
        </div>

        <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 px-4">
          Browse Resources
        </h3>
        
        <div className="space-y-2">
          {DEPARTMENTS.map((dept) => {
            const isOpen = openDept === dept.id;
            return (
              <div key={dept.id} className="rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenDept(isOpen ? null : dept.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 transition-colors text-left ${
                    isOpen ? 'bg-[var(--card)]' : 'hover:bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className={`w-5 h-5 shrink-0 ${isOpen ? 'text-[var(--primary)]' : ''}`} />
                    <span className={`font-medium text-sm ${isOpen ? 'text-[var(--foreground)]' : ''}`}>
                      {dept.name}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90 text-[var(--foreground)]' : ''}`} />
                </button>
                
                {isOpen && (
                   <div className="bg-[var(--card)] pb-2 px-2 border-b border-[var(--border)]">
                    {dept.branches.map((branch) => (
                      <div key={branch.id} className="mb-2">
                        <div className="px-4 py-2 text-xs font-semibold text-[var(--muted-foreground)]">
                          {branch.name}
                        </div>
                        <div className="grid grid-cols-4 gap-1 px-2">
                          {[1, 2, 3, 4].map((year) => {
                            const href = `/department/${branch.id}/${year}`;
                            const isActive = pathname === href || pathname.startsWith(`/subject/`) && href.includes(branch.id);
                            return (
                              <Link
                                key={year}
                                href={href}
                                className={`flex items-center justify-center py-2 rounded-lg text-xs font-bold transition-all ${
                                  isActive 
                                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                    : 'bg-[var(--background)] text-[var(--muted-foreground)] hover:bg-[var(--card-hover)] hover:text-[var(--foreground)] border border-[var(--border)]'
                                }`}
                                title={`Year ${year}`}
                              >
                                Y{year}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="p-6 border-t border-[var(--border)] bg-[var(--background)]">
         <Link href="/admin" className="flex items-center justify-center gap-2 w-full py-2.5 border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors">
            Admin Login
         </Link>
      </div>
    </aside>
  );
}
