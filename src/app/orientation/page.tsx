import Link from 'next/link';
import { Badge, PageHeader } from '@/components/ui';
import { DIMENSIONS, ORIENTATION_QUESTIONS, DIMENSION_FIELDS } from '@/lib/orientation';
import { listProgramFields } from '@/lib/data/partners';
import { countOrientationResults, orientationProfileDistribution } from '@/lib/data/orientation';
import { getTranslator } from '@/lib/locale';
import { getCurrentUser } from '@/lib/auth';

export const metadata = { title: 'Orientation scolaire & académique' };

export default async function OrientationPage() {
  const { t } = await getTranslator();
  const fields = listProgramFields();
  const distribution = orientationProfileDistribution();
  const total = countOrientationResults();
  const user = await getCurrentUser();

  return (
    <div>
      <PageHeader eyebrow="Pathways" title={t('orientation.title')} description={t('orientation.subtitle')}>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/orientation/test" className="btn-primary px-5 py-3">
            🧭 {t('orientation.start')}
          </Link>
          <span className="text-sm text-slate-500">
            {ORIENTATION_QUESTIONS.length} situations · 6 profils · rapport immédiat
            {user ? ` · ${user.name.split(' ')[0]}, vos rapports sont conservés dans votre espace` : ''}
          </span>
        </div>
      </PageHeader>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-8">
          <section className="card p-6">
            <h2 className="text-xl font-bold text-slate-900">Comment fonctionne le test ?</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                {
                  emoji: '📝',
                  title: '20 situations concrètes',
                  text: 'Des choix de la vie quotidienne congolaise : village sans eau, coopérative scolaire, marché concurrentiel…',
                },
                {
                  emoji: '📊',
                  title: '6 dimensions analysées',
                  text: 'Réaliste, Investigateur, Artistique, Social, Entreprenant, Méthodique (modèle RIASEC adapté).',
                },
                {
                  emoji: '🎯',
                  title: 'Des recommandations utiles',
                  text: 'Filières disponibles chez nos partenaires, métiers correspondants et bourses ouvertes.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl bg-slate-50 p-4">
                  <span className="text-2xl">{item.emoji}</span>
                  <p className="mt-2 font-semibold text-slate-800">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">Les six familles de profils</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {Object.values(DIMENSIONS).map((dimension) => {
                const detail = DIMENSION_FIELDS[dimension.code];
                return (
                  <div key={dimension.code} className="card p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-elimu-100 text-lg">
                        {dimension.emoji}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">
                          {dimension.code} · {dimension.label}
                        </p>
                        <p className="text-xs text-slate-500">{dimension.fr}</p>
                      </div>
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {detail.careers.slice(0, 4).map((career) => (
                        <li key={career}>
                          <Badge tone="neutral">{career}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-bold text-slate-900">Filières disponibles chez nos partenaires</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {fields.map((field) => (
                <Link
                  key={field.field}
                  href={`/partenaires?q=${encodeURIComponent(field.field)}`}
                  className="rounded-full bg-elimu-50 px-3.5 py-2 text-sm font-medium text-elimu-800 transition hover:bg-elimu-100"
                >
                  {field.field} <span className="text-elimu-500">({field.total})</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="card bg-elimu-900 p-6 text-white">
            <p className="text-sm font-bold text-gold-300">Prêt(e) à découvrir votre profil ?</p>
            <p className="mt-2 text-sm text-elimu-100">
              Le test prend 6 à 8 minutes. Aucune connaissance préalable n’est requise : répondez spontanément.
            </p>
            <Link href="/orientation/test" className="btn-gold mt-4 w-full">
              {t('orientation.start')} →
            </Link>
          </div>

          <div className="card p-5">
            <p className="text-sm font-bold text-slate-800">📈 Profils des {total} derniers tests</p>
            {distribution.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">Aucune donnée pour le moment.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {distribution.map((row) => (
                  <li key={row.profileCode} className="flex items-center justify-between gap-3">
                    <span className="text-slate-600">
                      <span className="font-mono font-semibold text-elimu-700">{row.profileCode}</span> ·{' '}
                      {row.profileLabel}
                    </span>
                    <span className="font-semibold text-slate-800">{row.total}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-5 text-sm text-slate-600">
            <p className="font-bold text-slate-800">🤝 Et ensuite ?</p>
            <p className="mt-2">
              Chaque rapport d’orientation propose des filières de nos universités partenaires, avec la possibilité
              de déposer une candidature en ligne et de postuler aux bourses ouvertes.
            </p>
            <Link href="/bourses" className="btn-outline mt-4 w-full">
              Voir les bourses
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
