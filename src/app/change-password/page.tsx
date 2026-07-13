'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/AuthCard';

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Set Your Password"
      subtitle="Your account requires a new password before you can continue."
    >
      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-muted)]" htmlFor="newPassword">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-app)] px-4 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 outline-none transition-colors focus:border-[var(--accent)]"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoFocus
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
            placeholder="Repeat your new password"
          />
        </div>

        <button
          type="submit"
          className="mt-1 w-full rounded-xl bg-[var(--accent)] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Saving…' : 'Set Password & Continue'}
        </button>
      </form>
    </AuthCard>
  );
}
