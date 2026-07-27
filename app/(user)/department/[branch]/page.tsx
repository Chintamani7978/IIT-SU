import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DEPARTMENTS } from '@/lib/mockDb';
import { findBranch, getDepartments } from '@/lib/db';

export default async function BranchYearSelector({ params }: { params: Promise<{ branch: string }> }) {
  const { branch: branchId } = await params;

  const found = findBranch(await getDepartments(), branchId);
  const branchName = found?.branch.name ?? `Unknown: ${branchId}`;
  const deptName = found?.department.name ?? 'Department';

  const years = [1, 2, 3, 4];

  return (
    <div className="min-h-[calc(100vh-120px)] max-w-5xl mx-auto px-4 py-8 flex flex-col justify-center">
      
      <div className="flex flex-col items-center text-center">
        {/* Swiss Minimalist Back Button */}
        <Link href="/" className="group flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 hover:text-[var(--primary)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300 ease-out" /> 
          Back to Departments
        </Link>

        {/* Typography Header */}
        <div className="mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-4">
            {deptName}
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none max-w-4xl mx-auto">
            {branchName}
          </h1>
        </div>
      </div>

      {/* Inline Year Selection */}
      <div className="w-full h-px bg-white/10 mb-8"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
        {years.map((year, index) => (
          <Link
            key={year}
            href={`/department/${branchId}/${year}`}
            className="group relative flex flex-col items-center justify-center p-6 w-full md:w-auto min-w-[200px] border border-white/10 hover:border-[var(--primary)]/50 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300"
          >
            <div className="text-[10px] font-mono text-zinc-500 group-hover:text-[var(--primary)] transition-colors mb-4 tracking-[0.2em]">
              0{index + 1}
            </div>
            
            <h3 className="text-xl font-light text-zinc-300 group-hover:text-white transition-colors tracking-tight mb-2">
              {year === 1 ? 'First' : year === 2 ? 'Second' : year === 3 ? 'Third' : 'Fourth'} Year
            </h3>
            
            <p className="text-xs text-zinc-500 font-light group-hover:text-zinc-400 transition-colors">
              Sem {year * 2 - 1} & {year * 2}
            </p>

            {/* Hover line indicator */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--primary)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"></div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const params: Array<{ branch: string }> = [];
  for (const dept of DEPARTMENTS) {
    for (const b of dept.branches) {
      params.push({ branch: b.id });
    }
  }
  return params;
}
