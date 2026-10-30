'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, KeyRound, ArrowRight, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

function PortalGateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const keyParam = searchParams.get('key');
    if (keyParam) {
      setSecretKey(keyParam);
      handleGatekeeperSubmit(keyParam);
    }
  }, [searchParams]);

  const handleGatekeeperSubmit = async (keyToTest: string) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/gatekeeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: keyToTest }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Access denied');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/login');
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Access denied');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim()) return;
    handleGatekeeperSubmit(secretKey.trim());
  };

  return (
    <div className="min-h-screen bg-[#0E1A16] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative text-ivory">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#182B25] via-[#0E1A16] to-[#080F0D] opacity-80" />

      {/* Return to website */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-gold/70 hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Public Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-forest border border-gold/40 flex items-center justify-center text-gold shadow-2xl">
            <KeyRound className="w-7 h-7" />
          </div>
        </div>
        <h2 className="mt-4 text-center font-serif text-2xl font-bold tracking-tight text-ivory">
          Private Access Clearance
        </h2>
        <p className="mt-1 text-center text-xs tracking-wider text-gold/80 uppercase font-medium">
          Authorized Resort Personnel Only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-dark py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-gold/25">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/50 border border-red-500/40 text-red-200 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-900/50 border border-green-500/40 text-green-200 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span>Key verified. Opening management portal...</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="secretKey"
                className="block text-xs font-semibold uppercase tracking-wider text-gold mb-2"
              >
                Owner Security Passkey
              </label>
              <input
                id="secretKey"
                name="secretKey"
                type="password"
                required
                autoFocus
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter private security key"
                className="w-full px-4 py-3 rounded-xl bg-forest/80 border border-gold/30 text-ivory placeholder-ivory/30 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full btn-gold py-3 px-4 rounded-xl text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 shadow-luxury disabled:opacity-50"
            >
              {loading ? (
                <span>Validating Clearance...</span>
              ) : success ? (
                <span>Clearance Approved</span>
              ) : (
                <>
                  <span>Unlock Management Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gold/15 text-center text-[11px] text-ivory/50 flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 text-gold/70" />
            <span>Cloaked Access • 404 Shield Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortalGatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0E1A16] flex items-center justify-center text-gold text-xs">
          Loading Security Gate...
        </div>
      }
    >
      <PortalGateContent />
    </Suspense>
  );
}
