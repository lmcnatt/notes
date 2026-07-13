'use client';

import React from 'react';
import Image from 'next/image';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-app)] px-4 py-10">
      <div className="flex w-full max-w-sm flex-col gap-7 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 shadow-[var(--shadow)]">
        {/* Branding header */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="w-full flex items-center justify-center">
            <Image
              src="/branding/logos/mcnotes-logo-full-app.svg"
              alt="McNotes logo"
              width={360}
              height={116}
              className="h-auto w-full max-w-[13rem]"
              priority
            />
          </div>
          <h1 className="text-xl font-semibold text-[var(--text-main)]">{title}</h1>
          {subtitle && <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
