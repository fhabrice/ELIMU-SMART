import Link from 'next/link';
import { Badge, PageHeader, EmptyState } from '@/components/ui';
import { listScholarships } from '@/lib/data/partners';
import { getTranslator } from '@/lib/locale';
import { cn, daysUntil, formatDate, formatUsd } from '@/lib/utils';

export const metadata = { title: 'Bourses d’études & financements' };

type SearchParams = Promise<{ niveau?: string }>;

const LEVELS = [
  { value: 'SECONDAIRE', label: 'Secondaire' },
  { value: 'LICENCE', label: 'Licence' },
  { value: 'MASTER', label: 'Master' },
  { value: 'FORMATION_PRO', label: 'Formation professionnelle' },
];

export default async function ScholarshipsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { t } = await getTranslator();
  const scholarships = listScholarships({ level: params.niveau });
  const totalAmount = scholarships.reduce((sum, item) => sum + (item.amountUsd ?? 0), 0);

  return (
    <div>
      <PageHeader eyebrow="Opportunités" title={t('scholarship.title')} description={t('scholarship.subtitle')}>
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">{scholarships.length} opportunités ouvertes</Badge>
          <Badge tone="gold">
            {formatUsd(totalAmount)} de financements disponibles
          </Badge>
        </div>
      </PageHeader>

      <div className="container-page py-10">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/bourses"
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-semibold',
              !params.niveau ? 'bg-elimu-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            Tous les niveaux
          </Link>
          {LEVELS.map((level) => (
            <Link
              key={level.value}
              href={`/bourses?niveau=${level.value}`}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold',
                params.niveau === level.value
                  ? 'bg-elimu-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              )}
            >
              {level.label}
            </Link>
          ))}
        </div>

        {scholarships.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="Aucune bourse pour ce niveau" description="Essayez un autre niveau d’études." icon="🎓" />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {scholarships.map((scholarship) => {
              const remaining = daysUntil(scholarship.deadline);
              return (
                <article key={scholarship.id} className="card flex flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-xl">
                        {scholarship.partnerLogo ?? '🎓'}
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-elimu-600">
                          {scholarship.organization}
                        </p>
                        <p className="text-xs text-slate-500">
                          Niveau : {LEVELS.find((level) => level.value === scholarship.level)?.label ?? scholarship.level}
                        </p>
                      </div>
                    </div>
                    <Badge tone={remaining <= 15 ? 'red' : remaining <= 30 ? 'gold' : 'green'}>
                      {remaining > 0 ? `${remaining} ${t('scholarship.daysLeft')}` : 'Clôturée'}
                    </Badge>
                  </div>

                  <h2 className="mt-4 text-lg font-bold leading-snug text-slate-900">{scholarship.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{scholarship.description}</p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-400">{t('scholarship.amount')}</p>
                      <p className="text-lg font-bold text-elimu-800">
                        {scholarship.amountUsd ? formatUsd(scholarship.amountUsd) : '—'}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-400">{t('scholarship.deadline')}</p>
                      <p className="text-sm font-semibold text-slate-800">{formatDate(scholarship.deadline)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t('scholarship.eligibility')}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{scholarship.eligibility}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {scholarship.partnerName && (
                      <Link href={`/partenaires/${scholarship.partnerSlug ?? ''}`} className="btn-outline">
                        Voir le partenaire
                      </Link>
                    )}
                    {scholarship.url && (
                      <a href={scholarship.url} target="_blank" rel="noreferrer" className="btn-primary">
                        Postuler ↗
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="card mt-10 bg-elimu-50 p-6">
          <h2 className="text-lg font-bold text-elimu-900">Comment maximiser vos chances ?</h2>
          <ul className="mt-3 grid gap-2 text-sm text-elimu-900 sm:grid-cols-2">
            <li>• Préparez un dossier complet : bulletin, attestation de naissance, lettre de motivation</li>
            <li>• Faites vérifier vos documents par votre établissement d’origine</li>
            <li>• Passez le test d’orientation pour cibler la filière adaptée à votre profil</li>
            <li>• Déposez votre candidature au moins 10 jours avant la date limite</li>
          </ul>
          <Link href="/orientation/test" className="btn-primary mt-5">
            Passer le test d’orientation →
          </Link>
        </div>
      </div>
    </div>
  );
}
