import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge, InfoRow } from '@/components/ui';
import { ApplicationForm } from '@/components/application-form';
import { getPartnerBySlug, listProgramsByPartner, listScholarships } from '@/lib/data/partners';
import { listCourses } from '@/lib/data/catalog';
import { getCurrentUser } from '@/lib/auth';
import { getTranslator } from '@/lib/locale';
import { PARTNER_TYPE_LABELS } from '@/lib/constants';
import { daysUntil, formatNumber, formatUsd } from '@/lib/utils';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);
  return partner ? { title: partner.name, description: partner.description } : { title: 'Partenaire' };
}

export default async function PartnerDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);
  if (!partner) notFound();

  const [{ t, locale }, user] = await Promise.all([getTranslator(), getCurrentUser()]);
  const programs = listProgramsByPartner(partner.id);
  const courses = listCourses({ partnerId: partner.id });
  const scholarships = listScholarships().filter((item) => item.partnerId === partner.id);
  const typeLabel = PARTNER_TYPE_LABELS[partner.type]?.[locale === 'en' ? 'en' : 'fr'];

  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="container-page py-10">
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <Link href="/partenaires" className="hover:text-elimu-700">
              {t('nav.partners')}
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-700">{partner.name}</span>
          </nav>

          <div className="flex flex-wrap items-start gap-6">
            <span
              className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl"
              style={{ backgroundColor: `${partner.coverColor}1a` }}
            >
              {partner.logoEmoji}
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="blue">{typeLabel}</Badge>
                {partner.isFeatured && <Badge tone="gold">★ Partenaire majeur</Badge>}
                <Badge tone="green">Agrément {partner.accreditation}</Badge>
              </div>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">{partner.name}</h1>
              <p className="mt-2 text-slate-600">
                📍 {partner.city}, {partner.province} · Fondé en {partner.foundedYear} ·{' '}
                {partner.studentsCount ? `${formatNumber(partner.studentsCount)} étudiants` : ''}
              </p>
              <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">{partner.description}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
                <span>✉️ {partner.email}</span>
                <span>☎️ {partner.phone}</span>
                {partner.website && <span>🌐 {partner.website}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.5fr_0.5fr]">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900">
              {t('partners.programs')} ({programs.length})
            </h2>
            <div className="mt-4 space-y-4">
              {programs.map((program) => (
                <article key={program.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{program.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {program.field} · {program.degree.replace('_', ' ')} · {program.durationMonths} mois
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-elimu-800">
                        {program.tuitionUsd ? formatUsd(program.tuitionUsd) : '—'}
                      </p>
                      <p className="text-xs text-slate-400">par année</p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{program.description}</p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {t('partners.requirements')}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{program.requirements}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {t('partners.careers')}
                      </p>
                      <ul className="mt-1 flex flex-wrap gap-1.5">
                        {program.careers.slice(0, 5).map((career) => (
                          <li key={career}>
                            <Badge tone="neutral">{career}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <details className="mt-4" id={`candidature-${program.id}`}>
                    <summary className="btn-primary inline-flex cursor-pointer">
                      {t('partners.apply')} — {program.name}
                    </summary>
                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <ApplicationForm
                        programId={program.id}
                        partnerId={partner.id}
                        defaultName={user?.name}
                        defaultEmail={user?.email}
                        defaultCity={user?.city ?? undefined}
                      />
                    </div>
                  </details>
                </article>
              ))}
              {programs.length === 0 && (
                <p className="card p-6 text-sm text-slate-500">
                  Ce partenaire n’a pas encore publié de filière sur la plateforme.
                </p>
              )}
            </div>
          </section>

          {courses.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-900">Formations certifiantes co-signées</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {courses.map((course) => (
                  <Link key={course.id} href={`/formations/${course.slug}`} className="card card-hover p-4">
                    <span className="text-2xl">{course.coverEmoji}</span>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{course.title}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {course.durationHours} h · {course.priceUsd === 0 ? 'Gratuit' : formatUsd(course.priceUsd)} ·{' '}
                      {course.learnersCount} apprenants
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-5">
          <div className="card p-5">
            <p className="text-sm font-bold text-slate-800">Fiche du partenaire</p>
            <div className="mt-3">
              <InfoRow label="Type" value={typeLabel} />
              <InfoRow label="Ville" value={partner.city} />
              <InfoRow label="Province" value={partner.province} />
              <InfoRow label="Création" value={partner.foundedYear ?? '—'} />
              <InfoRow label="Étudiants" value={partner.studentsCount ? formatNumber(partner.studentsCount) : '—'} />
              <InfoRow label="Filières" value={programs.length} />
              <InfoRow label="Formations en ligne" value={courses.length} />
            </div>
          </div>

          {scholarships.length > 0 && (
            <div className="card bg-gold-50 p-5">
              <p className="text-sm font-bold text-gold-900">🎓 Bourses proposées</p>
              <ul className="mt-3 space-y-3">
                {scholarships.map((scholarship) => (
                  <li key={scholarship.id}>
                    <p className="text-sm font-semibold text-gold-900">{scholarship.title}</p>
                    <p className="text-xs text-gold-800">
                      {scholarship.amountUsd ? formatUsd(scholarship.amountUsd) : '—'} ·{' '}
                      {daysUntil(scholarship.deadline)} jours restants
                    </p>
                  </li>
                ))}
              </ul>
              <Link href="/bourses" className="btn-outline mt-4 w-full">
                {t('scholarship.title')}
              </Link>
            </div>
          )}

          <div className="card p-5 text-sm text-slate-600">
            <p className="font-bold text-slate-800">🏛️ Partenariat</p>
            <p className="mt-2">
              Les formations SMART-ELIMU suivies auprès de ce partenaire donnent lieu à un certificat
              numérique co-signé, vérifiable en ligne.
            </p>
            <Link href="/partenaires/devenir" className="btn-outline mt-4 w-full">
              {t('partners.become')}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
