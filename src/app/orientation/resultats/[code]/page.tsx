import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui';
import { getOrientationResult } from '@/lib/data/orientation';
import { DIMENSIONS, DIMENSION_FIELDS, computeOrientationProfile, maxScoresByDimension, type DimensionCode } from '@/lib/orientation';
import { listPrograms } from '@/lib/data/partners';
import { listScholarships } from '@/lib/data/partners';
import { getTranslator } from '@/lib/locale';
import { daysUntil, formatDate, formatUsd } from '@/lib/utils';

type Params = Promise<{ code: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { code } = await params;
  const result = getOrientationResult(code);
  return {
    title: result ? `Rapport d’orientation — ${result.respondentName}` : 'Rapport d’orientation',
  };
}

export default async function OrientationResultPage({ params }: { params: Params }) {
  const { code } = await params;
  const result = getOrientationResult(code);
  if (!result) notFound();

  const { t } = await getTranslator();
  const outcome = computeOrientationProfile(result.answers as Record<string, string>);
  const maxima = maxScoresByDimension();
  const programs = listPrograms({ limit: 60 }).filter((program) => result.recommendedProgramIds.includes(program.id));
  const scholarships = listScholarships().slice(0, 3);

  const dimensions = Object.values(DIMENSIONS);
  const dominant = outcome.ranked[0];

  return (
    <div className="bg-slate-50">
      {/* ------------------------------------------------------------ En-tête */}
      <div className="bg-elimu-950 text-white">
        <div className="container-page py-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
                Rapport d’orientation SMART-ELIMU
              </p>
              <h1 className="mt-2 text-3xl font-extrabold">{result.respondentName}</h1>
              <p className="mt-2 text-elimu-200">
                {result.educationLevel.replace('_', ' ')} · rapport établi le {formatDate(result.createdAt)} · code{' '}
                <span className="font-mono">{result.shareCode}</span>
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 text-center ring-1 ring-inset ring-white/20">
              <p className="text-xs uppercase tracking-wide text-elimu-200">Profil dominant</p>
              <p className="mt-1 font-mono text-4xl font-extrabold text-gold-300">{outcome.profileCode}</p>
              <p className="mt-1 text-sm text-white">{outcome.profileLabel}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.5fr_0.5fr]">
        <div className="space-y-8">
          {/* ------------------------------------------------------- Synthèse */}
          <section className="card p-6">
            <h2 className="text-xl font-bold text-slate-900">
              {DIMENSIONS[dominant].emoji} Votre profil : {DIMENSIONS[dominant].label}
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">{outcome.profileSummary}</p>

            <div className="mt-6 space-y-3">
              {dimensions.map((dimension) => {
                const value = outcome.scores[dimension.code as DimensionCode] ?? 0;
                const maximum = maxima[dimension.code as DimensionCode] || 1;
                const percent = Math.round((value / maximum) * 100);
                const isTop = outcome.ranked.slice(0, 3).includes(dimension.code as DimensionCode);
                return (
                  <div key={dimension.code}>
                    <div className="flex items-center justify-between text-sm">
                      <span className={isTop ? 'font-semibold text-elimu-800' : 'text-slate-600'}>
                        {dimension.emoji} {dimension.label} — <span className="text-slate-400">{dimension.fr}</span>
                      </span>
                      <span className="font-semibold text-slate-700">{percent} %</span>
                    </div>
                    <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={isTop ? 'h-full rounded-full bg-elimu-600' : 'h-full rounded-full bg-slate-400'}
                        style={{ width: `${Math.max(percent, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* -------------------------------------------------------- Filières */}
          <section className="card p-6">
            <h2 className="text-xl font-bold text-slate-900">🎯 {t('orientation.topFields')}</h2>
            <p className="mt-1 text-sm text-slate-500">
              Domaines où votre profil s’exprime le mieux, d’après vos trois dimensions dominantes.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {outcome.topFields.map((field) => (
                <Badge key={field} tone="blue">
                  {field}
                </Badge>
              ))}
            </div>

            <h3 className="mt-6 font-semibold text-slate-800">{t('orientation.topCareers')}</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {outcome.topCareers.map((career) => (
                <li key={career} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <span className="text-emerald-600">✓</span>
                  {career}
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl bg-elimu-50 p-4 text-sm text-elimu-900">
              <p className="font-semibold">Conseil SMART-ELIMU</p>
              <p className="mt-1">
                {DIMENSION_FIELDS[dominant].fields.slice(0, 3).join(', ')} sont les filières les plus alignées avec
                votre profil. Vérifiez les conditions d’admission de chaque programme avant de candidater.
              </p>
            </div>
          </section>

          {/* --------------------------------------------------- Programmes */}
          <section>
            <h2 className="text-xl font-bold text-slate-900">{t('orientation.recommended')}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {programs.length} programme(s) correspondant à votre profil, proposés par nos partenaires agréés.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {programs.map((program) => (
                <article key={program.id} className="card flex flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-2xl">{program.partnerLogo}</span>
                    <Badge tone="neutral">{program.degree.replace('_', ' ')}</Badge>
                  </div>
                  <h3 className="mt-3 text-base font-bold leading-snug text-slate-900">{program.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {program.partnerName} · {program.partnerCity}
                  </p>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">{program.description}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-semibold text-elimu-800">
                      {program.tuitionUsd ? formatUsd(program.tuitionUsd) : '—'}
                    </span>
                    <span className="text-xs text-slate-400">{program.durationMonths} mois</span>
                  </div>
                  <Link href={`/partenaires#candidature-${program.id}`} className="btn-outline mt-3 w-full">
                    Voir et candidater
                  </Link>
                </article>
              ))}
              {programs.length === 0 && (
                <p className="card p-5 text-sm text-slate-500">
                  Aucun programme disponible pour le moment — explorez l’annuaire complet des partenaires.
                </p>
              )}
            </div>
          </section>

          {/* -------------------------------------------------------- Bourses */}
          <section>
            <h2 className="text-xl font-bold text-slate-900">{t('scholarship.title')}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {scholarships.map((scholarship) => (
                <div key={scholarship.id} className="card p-5">
                  <Badge tone="green">{scholarship.level}</Badge>
                  <p className="mt-3 text-sm font-bold leading-snug text-slate-900">{scholarship.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{scholarship.organization}</p>
                  <p className="mt-3 text-sm font-semibold text-elimu-800">
                    {scholarship.amountUsd ? formatUsd(scholarship.amountUsd) : '—'}
                  </p>
                  <p className="mt-1 text-xs text-rose-600">
                    {daysUntil(scholarship.deadline)} {t('scholarship.daysLeft')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* -------------------------------------------------------- Barre latérale */}
        <aside className="space-y-5">
          <div className="card p-5">
            <p className="text-sm font-bold text-slate-800">{t('orientation.shareCode')}</p>
            <p className="mt-2 break-all rounded-lg bg-slate-100 px-3 py-2 font-mono text-sm text-elimu-800">
              {result.shareCode}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Partagez ce code avec votre conseiller d’orientation ou votre établissement : il donne accès à ce
              rapport.
            </p>
          </div>

          <div className="card p-5">
            <p className="text-sm font-bold text-slate-800">Prochaines étapes</p>
            <ol className="mt-3 space-y-2 text-sm text-slate-600">
              <li>1. Consultez les formations certifiantes correspondant à votre profil.</li>
              <li>2. Déposez une candidature auprès d’un partenaire.</li>
              <li>3. Suivez l’avancement de votre dossier dans votre espace personnel.</li>
            </ol>
            <Link href="/formations" className="btn-primary mt-4 w-full">
              Voir les formations
            </Link>
            <Link href="/orientation/test" className="btn-outline mt-2 w-full">
              {t('orientation.retake')}
            </Link>
          </div>

          <div className="card bg-gold-50 p-5 text-sm text-gold-900">
            <p className="font-bold">📄 Rapport imprimable</p>
            <p className="mt-2 text-gold-800">
              Utilisez la fonction d’impression de votre navigateur pour conserver une copie PDF de ce rapport
              (l’en-tête et le pied de page du site ne seront pas imprimés).
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
