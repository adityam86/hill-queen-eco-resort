'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, KeyRound, X, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SecretDoorTrigger() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // 1. Keyboard shortcut listener: Ctrl + Shift + A or Alt + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
          (e.altKey && e.shiftKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setError(null);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    // 2. Custom event listener from secret clicks/taps
    const handleSecretEvent = () => {
      setIsOpen(true);
      setError(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-secret-gate', handleSecretEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-secret-gate', handleSecretEvent);
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/gatekeeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: keyInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Access denied');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        router.push('/admin/login');
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Access denied: Invalid security key');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-sm glass-dark rounded-3xl p-6 sm:p-8 border border-gold/40 shadow-2xl relative text-ivory animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-ivory/60 hover:text-gold rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-forest border border-gold/40 flex items-center justify-center text-gold shadow-lg mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-ivory">
            Private Access Gate
          </h3>
          <p className="text-xs text-gold/80 mt-1 uppercase tracking-wider font-medium">
            Authorized Personnel Clearance
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-900/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-green-900/60 border border-green-500/50 text-green-200 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            <span>Clearance approved. Opening portal...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="gateKey"
              className="block text-[11px] font-semibold uppercase tracking-wider text-gold mb-1.5"
            >
              Security Passkey
            </label>
            <input
              id="gateKey"
              type="password"
              autoFocus
              required
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-forest/90 border border-gold/30 text-ivory text-sm placeholder-ivory/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full btn-gold py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 shadow-luxury disabled:opacity-50"
          >
            {loading ? (
              <span>Validating...</span>
            ) : success ? (
              <span>Unlocked</span>
            ) : (
              <>
                <span>Unlock Management Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-gold/15 text-center text-[10px] text-ivory/50 flex items-center justify-center gap-1.5">
          <Shield className="w-3 h-3 text-gold/70" />
          <span>Stealth Shield Active • Press Esc to close</span>
        </div>
      </div>
    </div>
  );
}
