'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, LogIn, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get('next') ?? '/';
  const authError = searchParams.get('error');
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [error, setError] = useState<string | null>(
    authError ? 'Sign-in failed. Please try again.' : null
  );
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          data: {
            full_name: name || undefined,
          },
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        if (data.session) {
          router.push(next);
          router.refresh();
        } else {
          setMessage('Registration successful! Please check your email to confirm your account.');
          setLoading(false);
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push(next);
        router.refresh();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
      <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 space-y-6 relative overflow-hidden">
        {/* Decorative glass overlay glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--primary)]/10 rounded-full blur-2xl pointer-events-none"></div>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--muted-foreground)] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isSignUp ? 'Create an account' : 'Sign in'}
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">
            Access past papers, class notes, and vote on learning resources.
          </p>
        </div>

        {configured ? (
          <div className="space-y-4">
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 font-bold py-2.5 rounded-md transition-all disabled:opacity-60 cursor-pointer text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                or use email
              </span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Switch Tabs */}
            <div className="flex border-b border-white/5 mb-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                  setMessage(null);
                }}
                className={`flex-1 pb-2 text-center text-xs font-mono uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  !isSignUp
                    ? 'border-[var(--primary)] text-white font-bold'
                    : 'border-transparent text-[var(--muted-foreground)] hover:text-zinc-300'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError(null);
                  setMessage(null);
                }}
                className={`flex-1 pb-2 text-center text-xs font-mono uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  isSignUp
                    ? 'border-[var(--primary)] text-white font-bold'
                    : 'border-transparent text-[var(--muted-foreground)] hover:text-zinc-300'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-white/5 border border-white/10 focus:border-[var(--primary)]/50 rounded-md px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@suiit.ac.in"
                  className="w-full bg-white/5 border border-white/10 focus:border-[var(--primary)]/50 rounded-md px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 focus:border-[var(--primary)]/50 rounded-md px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--neon-hover)] text-[var(--primary-foreground)] font-bold py-2.5 rounded-md transition-all cursor-pointer disabled:opacity-60 text-sm mt-2"
              >
                <Mail className="w-4 h-4" />
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>
          </div>
        ) : (
          <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md p-3">
            Sign-in is not available yet — the Supabase backend has not been
            configured. See <code>supabase/README.md</code>.
          </p>
        )}

        {message && (
          <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md p-3">
            {message}
          </p>
        )}

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md p-3">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginCard />
    </Suspense>
  );
}

