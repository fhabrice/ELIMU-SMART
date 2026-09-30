import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getActiveSchool } from '@/lib/school-context';
import { getTranslator } from '@/lib/locale';
import { SCHOOL_TYPES } from '@/lib/constants';
import { Badge } from '@/components/ui';

export default async function SchoolLayout({ children }: { children: React.ReactNode }) {
  const context = await getActiveSchool();
  if (!context) redirect('/ecoles/inscription');

  const { school } = context;
  const { t, locale } = await getTranslator();

  const nav = [
    { href: '/ecoles/tableau-de-bord', label: t('school.dashboard'), icon: '📊' },
    { href: '/ecoles/tableau-de-bord/eleves', label: t('school.students'), icon: '🧑🏾‍🎓' },
    { href: '/ecoles/tableau-de-bord/classes', label: t('school.classes'), icon: '🏫' },
    { href: '/ecoles/tableau-de-bord/enseignants', label: t('school.teachers'), icon: '👩🏾‍🏫' },
    { href: '/ecoles/tableau-de-bord/presences', label: t('school.attendance'), icon: '🗓️' },
    { href: '/ecoles/tableau-de-bord/notes', label: t('school.grades'), icon: '📝' },
    { href: '/ecoles/tableau-de-bord/bulletins', label: t('school.reportCard'), icon: '📄' },
    { href: '/ecoles/tableau-de-bord/finances', label: t('school.finance'), icon: '💰' },
  ];

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-page py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                style={{ backgroundColor: `${school.coverColor}1a` }}
              >
                {school.logoEmoji}
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-elimu-600">SMART-ELIMU School</p>
                <h1 className="text-xl font-bold text-slate-900">{school.name}</h1>
                <p className="text-sm text-slate-500">
                  Code {school.code} · {school.city}, {school.province} · Année {school.academicYear}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="blue">
                {SCHOOL_TYPES[school.type]?.[locale === 'en' ? 'en' : 'fr'] ?? school.type}
              </Badge>
              <Badge tone="neutral">Direction : {school.directorName}</Badge>
              <Link href={`/ecoles/${school.code}`} className="btn-outline px-3 py-1.5 text-xs">
                Page publique
              </Link>
            </div>
          </div>

          <nav className="mt-6 flex gap-1 overflow-x-auto">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-elimu-50 hover:text-elimu-800"
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="container-page py-8">{children}</div>
    </div>
  );
}
