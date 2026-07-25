'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';
import AuthButton from './AuthButton';

export default function UserLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDepartments = pathname.includes('/department') || pathname.includes('/departments') || pathname.includes('/subject');
  return (
    <div className="flex-1 flex flex-col h-full min-w-0 relative bg-[var(--background)]">
      
      {/* Top Left Logo */}
      <Link href="/" className="absolute top-6 left-6 md:left-10 z-50 pointer-events-auto">
        <img
          src="/logo.svg"
          alt="SUIIT E-Learning Logo"
          className="h-14 w-auto"
        />
      </Link>

      {/* Floating Glass Pill Navigation */}
      <div className="sticky top-6 z-40 flex justify-center w-full px-4 mb-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between bg-zinc-800/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-2 w-full max-w-[600px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative">
          
          {/* Top highlight for glass effect */}
          <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          {/* Left Glass Orb Logo */}
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-white/20 to-white/0 border border-white/20 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)] shrink-0">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 shadow-inner flex items-center justify-center">
               <span className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary)] animate-pulse"></span>
             </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center justify-center gap-8 px-6 text-sm font-medium">
            <Link href="/" className={`transition-all ${pathname === '/' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-zinc-300 hover:text-white'}`}>Home</Link>
            <Link href="/#departments" className={`transition-all ${isDepartments ? 'text-[var(--primary)] drop-shadow-[0_0_8px_rgba(204,255,0,0.6)]' : 'text-zinc-300 hover:text-white'}`}>Departments</Link>
            <Link href="#" className="text-zinc-300 hover:text-white transition-all">Contact</Link>
            <Link href="#" className="text-zinc-300 hover:text-white transition-all">About</Link>
          </div>

          {/* Profile / Auth */}
          <AuthButton />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative w-full">
        <div className="max-w-[1200px] mx-auto min-h-full flex flex-col p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
