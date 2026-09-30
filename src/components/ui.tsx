import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'blue' | 'gold' | 'green' | 'red' | 'purple' | 'slate';
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-slate-100 text-slate-700',
    blue: 'bg-elimu-100 text-elimu-800',
    gold: 'bg-gold-100 text-gold-800',
    green: 'bg-emerald-100 text-emerald-800',
    red: 'bg-rose-100 text-rose-800',
    purple: 'bg-purple-100 text-purple-800',
    slate: 'bg-slate-800 text-white',
  };
  return <span className={cn('badge', tones[tone], className)}>{children}</span>;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-elimu-600">{eyebrow}</p>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-slate-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-elimu-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function ProgressBar({ value, tone = 'blue' }: { value: number; tone?: 'blue' | 'gold' | 'green' }) {
  const tones = {
    blue: 'bg-elimu-600',
    gold: 'bg-gold-400',
    green: 'bg-emerald-500',
  };
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className={cn('h-full rounded-full transition-all', tones[tone])}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon = '📭',
  action,
}: {
  title: string;
  description?: string;
  icon?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center justify-center gap-2 p-10 text-center">
      <span className="text-3xl">{icon}</span>
      <p className="font-semibold text-slate-800">{title}</p>
      {description && <p className="max-w-md text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {item.href ? (
            <Link href={item.href} className="hover:text-elimu-700">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-slate-700">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="text-slate-300">/</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container-page py-10 sm:py-12">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-elimu-600">{eyebrow}</p>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-3xl text-slate-600">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}

export function Alert({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
}) {
  const tones = {
    info: 'border-elimu-200 bg-elimu-50 text-elimu-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    warning: 'border-gold-200 bg-gold-50 text-gold-900',
    error: 'border-rose-200 bg-rose-50 text-rose-900',
  };
  const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '⛔' };
  return (
    <div className={cn('rounded-xl border px-4 py-3 text-sm', tones[tone])}>
      <p className="flex gap-2">
        <span aria-hidden>{icons[tone]}</span>
        <span>
          {title && <strong className="block">{title}</strong>}
          {children}
        </span>
      </p>
    </div>
  );
}

export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 py-2 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}
