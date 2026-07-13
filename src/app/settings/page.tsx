'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader, UserPlus, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [allowRegistration, setAllowRegistration] = useState(false);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [saving, setSaving] = useState(false);

  // Create user state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetch('/api/settings/registration')
      .then((res) => {
        if (res.status === 401) {
          router.push('/login');
          return null;
        }
        if (res.status === 403) {
          setForbidden(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setAllowRegistration(!!data.allowRegistration);
      })
      .catch(() => setForbidden(true))
      .finally(() => setLoading(false));
  }, [router]);

  const toggleRegistration = async (next: boolean) => {
    setSaving(true);
    setAllowRegistration(next);
    try {
      const res = await fetch('/api/settings/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allowRegistration: next }),
      });
      if (!res.ok) throw new Error('Failed to update setting');
      const data = await res.json();
      setAllowRegistration(!!data.allowRegistration);
    } catch {
      setAllowRegistration(!next);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    if (!newUsername.trim() || !newPassword.trim()) {
      setCreateError('Username and password are required');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername.trim(), password: newPassword.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      setCreateSuccess(
        `Account "@${data.username}" created. They will be prompted to set a new password on first login.`
      );
      setNewUsername('');
      setNewPassword('');
    } catch (err: any) {
      setCreateError(err.message || 'Something went wrong');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] px-4 py-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to notes
        </Link>

        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">Admin Settings</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Manage your McNotes instance.</p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <Loader className="animate-spin" size={18} /> Loading…
          </div>
        ) : forbidden ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 text-sm text-[var(--text-muted)]">
            You do not have permission to view this page. Only the instance administrator can manage
            settings.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Registration toggle */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 sm:p-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Access
              </h2>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-[var(--text-main)]">Public registration</span>
                  <span className="text-sm text-[var(--text-muted)]">
                    Allow anyone to create an account on this instance.
                  </span>
                </div>
                {/* Peer-based toggle — thumb is positioned via CSS pseudo-element, never overflows */}
                <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={allowRegistration}
                    disabled={saving}
                    onChange={() => toggleRegistration(!allowRegistration)}
                  />
                  <span
                    className="
                      relative h-6 w-11 rounded-full border border-transparent transition-colors
                      bg-[var(--border)]
                      peer-checked:bg-[var(--accent)]
                      peer-disabled:cursor-not-allowed peer-disabled:opacity-60
                      after:absolute after:left-0.5 after:top-0.5
                      after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm
                      after:transition-transform after:content-['']
                      peer-checked:after:translate-x-5
                    "
                  />
                </label>
              </div>
            </div>

            {/* Create user */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 sm:p-6">
              <div className="mb-1 flex items-center gap-2">
                <UserPlus size={18} className="text-[var(--accent)]" />
                <h2 className="font-semibold text-[var(--text-main)]">Create User Account</h2>
              </div>
              <p className="mb-5 text-sm text-[var(--text-muted)]">
                Create an account and share the credentials. The user will be prompted to set their
                own password on first sign-in.
              </p>

              {createError && (
                <div className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-500">
                  {createError}
                </div>
              )}

              {createSuccess && (
                <div className="mb-4 flex items-start gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-600" />
                  {createSuccess}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-sm font-medium text-[var(--text-muted)]"
                    htmlFor="newUsername"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="newUsername"
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg-app)] px-4 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 outline-none transition-colors focus:border-[var(--accent)]"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="e.g. alice"
                    autoComplete="off"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-sm font-medium text-[var(--text-muted)]"
                    htmlFor="newPassword"
                  >
                    Temporary Password
                  </label>
                  <input
                    type="text"
                    id="newPassword"
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg-app)] px-4 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 outline-none transition-colors focus:border-[var(--accent)] font-mono tracking-wide"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Temporary password to share"
                    autoComplete="off"
                  />
                  <p className="text-xs text-[var(--text-muted)]">
                    Share this with the user — they&apos;ll be asked to change it on first sign-in.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[var(--accent)] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={creating}
                >
                  {creating ? 'Creating…' : 'Create Account'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

  useEffect(() => {
    fetch('/api/settings/registration')
      .then((res) => {
        if (res.status === 401) {
          router.push('/login');
          return null;
        }
        if (res.status === 403) {
          setForbidden(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setAllowRegistration(!!data.allowRegistration);
      })
      .catch(() => setForbidden(true))
      .finally(() => setLoading(false));
  }, [router]);

  const toggleRegistration = async (next: boolean) => {
    setSaving(true);
    setAllowRegistration(next);
    try {
      const res = await fetch('/api/settings/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allowRegistration: next }),
      });
      if (!res.ok) throw new Error('Failed to update setting');
      const data = await res.json();
      setAllowRegistration(!!data.allowRegistration);
    } catch {
      // Revert on failure
      setAllowRegistration(!next);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] px-4 py-10">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)]"
        >
          <ArrowLeft size={16} />
          Back to notes
        </Link>

        <h1 className="text-2xl font-semibold text-[var(--text-main)]">Admin Settings</h1>

        {loading ? (
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <Loader className="animate-spin" size={18} /> Loading…
          </div>
        ) : forbidden ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 text-sm text-[var(--text-muted)]">
            You do not have permission to view this page. Only the instance administrator can manage
            settings.
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-[var(--text-main)]">Public registration</span>
                <span className="text-sm text-[var(--text-muted)]">
                  Allow anyone to create an account on this instance.
                </span>
              </div>
              <button
                role="switch"
                aria-checked={allowRegistration}
                disabled={saving}
                onClick={() => toggleRegistration(!allowRegistration)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
                  allowRegistration ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    allowRegistration ? 'translate-x-[1.4rem]' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
