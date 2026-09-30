import Link from 'next/link';
import { Badge, EmptyState, PageHeader } from '@/components/ui';
import { listPartners } from '@/lib/data/partners';
import { getTranslator } from '@/lib/locale';
import { PARTNER_TYPES, PARTNER_TYPE_LABELS } from '@/lib/constants';
import { cn, formatNumber } from '@/lib/utils';

export const metadata = { title: 'Universités & centres de formation partenaires' };

type SearchParams = Promise<{ q?: string; type?: string }>;

export default async function PartnersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { t, locale } = await getTranslator();
  const partners = listPartners({ q: params.q, type: params.type });

  const buildHref = (type?: string) => {
    const search = new URLSearchParams();
    if (params.q) search.set('q', params.q);
    if (type) search.set('type', type);
    const query = search.toString();
    return query ? `/partenaires?${query}` : '/partenaires';
  };

  const provinces = new Set(partners.map((partner) => partner.province));

  return (
    <div>
      <PageHeader eyebrow="Réseau SMART-ELIMU" title={t('partners.title')} description={t('partners.subtitle')}>
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">{partners.length} institutions actives</Badge>
          <Badge tone="gold">{provinces.size} provinces couvertes</Badge>
          <Link href="/partenaires/devenir" className="btn-primary px-3 py-1.5 text-xs">
            {t('partners.become')} →
          </Link>
        </div>
      </PageHeader>

      <div className="container-page py-10">
        <div className="flex flex-wrap items-center gap-3">
          <form action="/partenaires" className="flex w-full max-w-md gap-2">
            <input
              name="q"
              defaultValue={params.q ?? ''}
              placeholder="Rechercher une université, un centre, une ville…"
              className="input"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              🔍
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            <Link
              href={buildHref()}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold',
                !params.type ? 'bg-elimu-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              )}
            >
              {t('common.all')}
            </Link>
            {Object.keys(PARTNER_TYPES).map((type) => (
              <Link
                key={type}
                href={buildHref(type)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-semibold',
                  params.type === type ? 'bg-elimu-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                )}
              >
                {PARTNER_TYPE_LABELS[type].emoji}{' '}
                {PARTNER_TYPE_LABELS[type][locale === 'en' ? 'en' : 'fr']}
              </Link>
            ))}
          </div>
        </div>

        {partners.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="Aucun partenaire trouvé" description="Modifiez votre recherche ou retirez les filtres." icon="🏛️" />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {partners.map((partner) => (
              <Link key={partner.id} href={`/partenaires/${partner.slug}`} className="card card-hover flex flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                    style={{ backgroundColor: `${partner.coverColor}1a` }}
                  >
                    {partner.logoEmoji}
                  </span>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge tone="blue">{PARTNER_TYPE_LABELS[partner.type]?.[locale === 'en' ? 'en' : 'fr']}</Badge>
                    {partner.isFeatured && <Badge tone="gold">★ Mis en avant</Badge>}
                  </div>
                </div>

                <h2 className="mt-4 text-base font-bold leading-snug text-slate-900">{partner.name}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  📍 {partner.city}, {partner.province}
                </p>
                <p className="mt-3 line-clamp-3 flex-1 text-sm text-slate-600">{partner.description}</p>

                <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-slate-50 p-2.5">
                    <dt className="text-slate-400">Filières</dt>
                    <dd className="text-base font-bold text-elimu-800">{partner.programCount}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5">
                    <dt className="text-slate-400">Formations</dt>
                    <dd className="text-base font-bold text-elimu-800">{partner.courseCount}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5">
                    <dt className="text-slate-400">Étudiants</dt>
                    <dd className="text-base font-bold text-elimu-800">
                      {partner.studentsCount ? formatNumber(partner.studentsCount) : '—'}
                    </dd>
                  </div>
                </dl>

                <p className="mt-3 text-[11px] text-slate-400">Agrément : {partner.accreditation}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
