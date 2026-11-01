'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mountain, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminLoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Successful login
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative text-ivory">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-forest via-forest-dark to-forest-dark opacity-60" />

      {/* Back to Site link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-gold/80 hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-forest border border-gold/40 flex items-center justify-center text-gold shadow-luxury">
            <Mountain className="w-7 h-7" />
          </div>
        </div>
        <h2 className="mt-4 text-center font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ivory">
          HILL QUEEN ECO RESORT
        </h2>
        <p className="mt-1 text-center text-xs tracking-widest text-gold uppercase font-medium">
          Owner Management Dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-dark py-8 px-6 shadow-luxury-lg rounded-3xl sm:px-10 border border-gold/25">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="identifier"
                className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5"
              >
                Username or Email
              </label>
              <div className="relative">
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Username or registered email"
                  className="w-full px-4 py-3 rounded-xl bg-forest/80 border border-gold/30 text-ivory placeholder-ivory/40 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5"
              >
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-forest/80 border border-gold/30 text-ivory placeholder-ivory/40 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-3 px-4 rounded-xl text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 shadow-luxury disabled:opacity-50"
              >
                {loading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Secure Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gold/15 text-center text-[11px] text-ivory/60 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>Encrypted Session • Server Authorization Required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
