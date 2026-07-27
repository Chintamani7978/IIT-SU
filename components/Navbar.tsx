'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
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
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link href="/departments" className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Departments
              </Link>
              <Link href="/moderation" className="flex items-center gap-1 text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <ShieldCheck className="w-4 h-4" /> Moderation
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/departments" className="text-slate-300 hover:text-cyan-400 block px-3 py-2 rounded-md text-base font-medium">
              Departments
            </Link>
            <Link href="/moderation" className="text-slate-300 hover:text-cyan-400 block px-3 py-2 rounded-md text-base font-medium">
              Moderation Queue
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
