'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '@/components/AuthCard';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState<boolean | null>(null);
  const [isFirstRun, setIsFirstRun] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/registration-status')
      .then((res) => res.json())
      .then((data) => {
        setAllowRegistration(!!data.allowRegistration);
        setIsFirstRun(!data.hasUsers);
      })
      .catch(() => setAllowRegistration(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const title = isFirstRun ? 'Create Admin Account' : 'Create Account';
  const subtitle = isFirstRun
    ? 'This first account will be the instance administrator'
    : 'Start writing your outlines and stories';

  return (
    <AuthCard title={title} subtitle={subtitle}>
      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm text-red-500">
          {error}
        </div>
      )}

      {allowRegistration === false ? (
        <div className="flex flex-col gap-4 text-center">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-app)] px-4 py-4 text-sm text-[var(--text-muted)]">
            Registration is currently disabled on this instance. Please contact the administrator
            for access.
          </div>
          <Link href="/login" className="font-semibold text-[var(--accent)] hover:underline">
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-muted)]" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-app)] px-4 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 outline-none transition-colors focus:border-[var(--accent)]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-muted)]" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-app)] px-4 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 outline-none transition-colors focus:border-[var(--accent)]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-muted)]" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-app)] px-4 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 outline-none transition-colors focus:border-[var(--accent)]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-[var(--accent)] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm text-[var(--text-muted)]">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[var(--accent)] hover:underline">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthCard>
  );
}
