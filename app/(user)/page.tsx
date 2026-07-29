'use client';

import { useEffect, useRef } from 'react';
import { Search, Trophy, UploadCloud } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LandingAccordion from '@/components/LandingAccordion';

gsap.registerPlugin(ScrollTrigger);

export default function UserLandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const heroTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } });

      heroTimeline
        .fromTo('[data-hero-glow]', { opacity: 0 }, { opacity: 1, duration: 0.9 })
        .fromTo('[data-hero-ping]', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6 }, '-=0.4')
        .fromTo('[data-hero-word]', { opacity: 0, y: 24, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.08, duration: 0.75 }, '-=0.2')
        .fromTo('[data-hero-subtitle]', { opacity: 0, y: 20, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, '-=0.35')
        .fromTo('[data-hero-cta]', { opacity: 0, scale: 0.9, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.7 }, '-=0.3')
        .fromTo('[data-hero-device]', { opacity: 0, y: 60, scale: 0.95, rotateX: 6, filter: 'blur(12px)' }, { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)', duration: 1 }, '-=0.4');

      gsap.to('[data-float]', {
        y: -15,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.4,
      });

      gsap.utils.toArray<HTMLElement>('[data-section-reveal]').forEach((section) => {
        gsap.fromTo(
          section,
          { y: 36, opacity: 0, scale: 0.98, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 84%',
              once: true,
            },
          }
        );
      });
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="flex flex-col py-0 md:py-2">
      
      {/* Hero Section */}
      <div className="text-center max-w-5xl mx-auto mb-4 px-4">

        <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tighter mb-3 leading-tight">
          <span data-hero-word className="inline-block mr-2">Master</span>
          <span data-hero-word className="inline-block">Your</span> <br/>
          <span data-hero-word className="inline-block text-[var(--foreground)] mr-2">
            Engineering
          </span>
          <span data-hero-word className="inline-block text-[var(--foreground)]">
            Studies
          </span>
        </h1>
        
        <p className="text-sm md:text-base text-zinc-400 font-light mb-6 max-w-xl mx-auto leading-relaxed tracking-wide" data-hero-subtitle>
          The ultimate resource hub for SUIIT students. Access verified notes, PYQs, and curated video lectures.
        </p>

        {/* Centralized Search Bar */}
        <div className="max-w-2xl mx-auto relative group mb-0" data-hero-cta>
          <div className="absolute inset-0 bg-[var(--primary)]/10 rounded-3xl blur-2xl group-hover:bg-[var(--primary)]/20 transition-all duration-700 -z-10"></div>
          <div className="relative flex items-center bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl overflow-hidden focus-within:border-[var(--primary)]/40 focus-within:bg-zinc-900/80 transition-all duration-500">
            <div className="pl-4 pr-3 text-zinc-500 group-focus-within:text-[var(--primary)] transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder="Search Subject or Topic..." 
              className="flex-1 bg-transparent border-none outline-none text-[var(--foreground)] placeholder:text-zinc-600 py-1.5 text-sm font-light tracking-wide"
            />
            <button className="hidden md:flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-zinc-400 px-3 py-1.5 rounded-xl text-[9px] font-semibold tracking-wider uppercase transition-colors border border-white/5 mr-1">
              <kbd className="font-mono text-[8px] bg-black/40 px-1 py-0.5 rounded">Ctrl</kbd>
              <kbd className="font-mono text-[8px] bg-black/40 px-1 py-0.5 rounded">K</kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Action Workflow (Accordion) */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4" data-hero-device data-section-reveal>
        <LandingAccordion />
      </div>

      {/* Lower Section: Secondary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-32 w-full px-4">
        {/* Quick Actions */}
        <div className="dash-card p-8 rounded-[2rem] border border-white/5 bg-zinc-900/30 hover:bg-zinc-900/60 backdrop-blur-sm transition-all duration-500 group cursor-pointer relative overflow-hidden" data-float data-section-reveal>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 blur-[80px] rounded-full group-hover:bg-[var(--primary)]/20 transition-colors translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center text-[var(--primary)] mb-6 border border-white/5 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-2xl text-[var(--foreground)] mb-3 tracking-tight">Contribute Notes</h3>
          <p className="text-base text-zinc-400 font-light leading-relaxed">Upload your handwritten notes or PYQ solutions to help your juniors and build your reputation.</p>
        </div>

        {/* Top Contributors */}
        <div className="dash-card p-8 rounded-[2rem] border border-white/5 bg-zinc-900/30 hover:bg-zinc-900/60 backdrop-blur-sm transition-all duration-500 group cursor-pointer relative overflow-hidden" data-float data-section-reveal>
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full group-hover:bg-amber-500/20 transition-colors translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center text-amber-400 mb-6 border border-white/5 shadow-inner">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-2xl text-[var(--foreground)] mb-3 tracking-tight">Top Contributors</h3>
          <p className="text-base text-zinc-400 font-light leading-relaxed">View the leaderboard of brilliant students who have contributed the most this semester.</p>
        </div>
      </div>
      
    </div>
  );
}
