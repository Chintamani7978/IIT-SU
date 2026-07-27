import Link from 'next/link';
import { getDepartments } from '@/lib/db';
import { GraduationCap, ChevronRight } from 'lucide-react';

export default async function DepartmentsMenu() {
  const departments = await getDepartments();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Departments</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">Select your branch to access the course resources.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {departments.map((dept) => (
          <div key={dept.id} className="dash-card flex flex-col overflow-hidden group">
            <div className="p-6 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--background)]">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-[var(--foreground)] leading-tight">{dept.name}</h2>
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-6">
              {dept.branches.map((branch) => (
                <div key={branch.id} className="space-y-4">
                  <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></span>
                    {branch.name}
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((year) => (
                      <Link
                        key={year}
                        href={`/department/${branch.id}/${year}`}
                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--card-hover)] transition-all group/link"
                      >
                        <span className="text-sm font-medium text-[var(--muted-foreground)] group-hover/link:text-[var(--primary)] transition-colors">
                          Year {year}
                        </span>
                        <ChevronRight className="w-4 h-4 mt-1 text-[var(--border)] group-hover/link:text-[var(--primary)] transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
