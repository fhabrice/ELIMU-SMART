import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { USD_TO_CDF } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "1 250 000 FC" — format congolais des montants en francs. */
export function formatCdf(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(Math.round(amount))} FC`;
}

export function formatUsd(amount: number): string {
  return `${new Intl.NumberFormat('en-US').format(Math.round(amount))} $US`;
}

/** Affiche le prix dans les deux monnaies utilisées en RDC. */
export function formatDualPrice(usd: number, cdf?: number): string {
  if (usd === 0 && (!cdf || cdf === 0)) return 'Gratuit';
  const cdfValue = cdf && cdf > 0 ? cdf : usd * USD_TO_CDF;
  return `${formatUsd(usd)} · ${formatCdf(cdfValue)}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value);
}

export function formatDate(date: Date | string, locale = 'fr-FR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
}

export function formatDateShort(date: Date | string, locale = 'fr-FR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
}

export function formatDateTime(date: Date | string, locale = 'fr-FR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function daysUntil(date: Date | string): number {
  const target = typeof date === 'string' ? new Date(date) : date;
  const diff = target.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Couleur d'avatar déterministe à partir d'une chaîne. */
const AVATAR_COLORS = ['#1c60f0', '#0d2a6b', '#db7b02', '#0f766e', '#7c3aed', '#be123c', '#15803d'];
export function colorFromString(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) % 100000;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/** Ordre d'affichage : les éléments les plus récents d'abord. */
export function sortByDateDesc<T extends { createdAt: Date | string }>(items: T[]): T[] {
  return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function truncate(text: string, max = 140): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

/**
 * Rendu minimaliste de Markdown (titres, listes, gras, italique, citations,
 * tableaux simples, code) — évite une dépendance externe pour le contenu
 * pédagogique des leçons.
 */
export function renderMarkdown(markdown: string): string {
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const inline = (s: string) =>
    escapeHtml(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|\s)\*(?!\s)(.+?)\*/g, '$1<em>$2</em>')
      .replace(/`(.+?)`/g, '<code class="rounded bg-slate-100 px-1.5 py-0.5 text-[0.85em] text-elimu-800">$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a class="text-elimu-700 underline underline-offset-2" href="$2">$1</a>');

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let inQuote = false;

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };
  const closeQuote = () => {
    if (inQuote) {
      html.push('</blockquote>');
      inQuote = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      closeList();
      closeQuote();
      continue;
    }

    if (line.startsWith('### ')) {
      closeList(); closeQuote();
      html.push(`<h3 class="mt-6 mb-2 text-lg font-semibold text-slate-900">${inline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      closeList(); closeQuote();
      html.push(`<h2 class="mt-8 mb-3 text-xl font-bold text-slate-900">${inline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith('# ')) {
      closeList(); closeQuote();
      html.push(`<h1 class="mt-8 mb-3 text-2xl font-bold text-slate-900">${inline(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith('> ')) {
      closeList();
      if (!inQuote) { html.push('<blockquote class="my-4 border-l-4 border-gold-400 bg-gold-50 px-4 py-3 text-slate-700">'); inQuote = true; }
      html.push(`<p class="mb-1">${inline(line.slice(2))}</p>`);
      continue;
    }
    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      closeQuote();
      if (listType !== 'ol') { closeList(); html.push('<ol class="my-3 list-decimal space-y-1.5 pl-6 text-slate-700">'); listType = 'ol'; }
      html.push(`<li>${inline(orderedMatch[1])}</li>`);
      continue;
    }
    if (/^[-*•]\s+/.test(line)) {
      closeQuote();
      if (listType !== 'ul') { closeList(); html.push('<ul class="my-3 list-disc space-y-1.5 pl-6 text-slate-700">'); listType = 'ul'; }
      html.push(`<li>${inline(line.replace(/^[-*•]\s+/, ''))}</li>`);
      continue;
    }

    closeList(); closeQuote();
    html.push(`<p class="my-3 leading-relaxed text-slate-700">${inline(line)}</p>`);
  }

  closeList(); closeQuote();
  return html.join('\n');
}
