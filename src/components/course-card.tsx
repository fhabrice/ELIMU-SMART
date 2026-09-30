import Link from 'next/link';
import type { CourseWithMeta } from '@/lib/types';
import { COURSE_LEVEL_LABELS } from '@/lib/constants';
import { formatNumber, formatUsd } from '@/lib/utils';
import { Badge } from './ui';

export function CourseCard({ course, locale = 'fr' }: { course: CourseWithMeta; locale?: string }) {
  const level = COURSE_LEVEL_LABELS[course.level] ?? { fr: course.level, en: course.level, short: course.level };
  const levelLabel = locale === 'en' ? level.en : level.fr;

  return (
    <Link href={`/formations/${course.slug}`} className="card card-hover flex flex-col overflow-hidden">
      <div
        className="flex h-28 items-center justify-between px-4 text-3xl"
        style={{ background: `linear-gradient(135deg, ${course.coverColor}22, ${course.coverColor}44)` }}
      >
        <span aria-hidden>{course.coverEmoji}</span>
        <div className="flex flex-col items-end gap-1.5">
          {course.isCertifying && <Badge tone="blue">🎓 {locale === 'en' ? 'Certifying' : 'Certifiant'}</Badge>}
          <Badge tone="gold">{levelLabel}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-elimu-600">{course.category}</p>
        <h3 className="mt-1.5 line-clamp-2 text-base font-bold leading-snug text-slate-900">{course.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">{course.summary}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span>⏱️ {course.durationHours} h</span>
          <span>📚 {course.moduleCount} modules</span>
          <span>⭐ {course.rating.toFixed(1)}</span>
          <span>👥 {formatNumber(course.learnersCount)}</span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-sm font-bold text-elimu-800">
            {course.priceUsd === 0 ? '🎁 Gratuit' : formatUsd(course.priceUsd)}
          </span>
          {course.partnerName && (
            <span className="truncate text-xs text-slate-500" title={course.partnerName}>
              {course.partnerLogo} {course.partnerName}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
