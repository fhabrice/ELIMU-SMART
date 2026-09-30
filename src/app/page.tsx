import Link from 'next/link';
import { CourseCard } from '@/components/course-card';
import { Badge, SectionTitle, Stat } from '@/components/ui';
import { listCourses } from '@/lib/data/catalog';
import { listPartners, listScholarships } from '@/lib/data/partners';
import { platformStats } from '@/lib/data/stats';
import { getTranslator } from '@/lib/locale';
import { PARTNER_TYPE_LABELS } from '@/lib/constants';
import { daysUntil, formatNumber, formatUsd } from '@/lib/utils';

export default async function HomePage() {
  const { t, locale } = await getTranslator();
  const stats = platformStats();
  const courses = listCourses({ limit: 6 });
  const partners = listPartners({ limit: 8 });
  const scholarships = listScholarships().slice(0, 3);

  const pillars = [
    {
      href: '/formations',
      emoji: '🎓',
      title: t('pillar.courses.title'),
      text: t('pillar.courses.text'),
      points: ['12 formations certifiantes', '108 leçons rédigées', 'Certificat vérifiable par QR code'],
      color: 'from-elimu-600 to-elimu-800',
    },
    {
      href: '/ecoles',
      emoji: '🏫',
      title: t('pillar.school.title'),
      text: t('pillar.school.text'),
      points: ['Élèves, classes, enseignants', 'Présences et bulletins automatiques', 'Frais scolaires & mobile money'],
      color: 'from-elimu-800 to-elimu-950',
    },
    {
      href: '/orientation',
      emoji: '🧭',
      title: t('pillar.orientation.title'),
      text: t('pillar.orientation.text'),
      points: ['20 situations concrètes', '6 profils, filières recommandées', 'Bourses et candidatures en ligne'],
      color: 'from-gold-500 to-gold-700',
    },
  ];

  return (
    <div>
      {/* ---------------------------------------------------------------- Héros */}
      <section className="relative overflow-hidden bg-elimu-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(60% 60% at 80% 10%, rgba(252,209,22,0.35), transparent), radial-gradient(50% 50% at 10% 30%, rgba(28,96,240,0.45), transparent)',
          }}
        />
        <div className="container-page relative grid gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div className="animate-fade-up">
            <span className="badge bg-white/10 text-gold-200 ring-1 ring-inset ring-white/20">
              {t('home.badge')}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {t('home.heroTitle')}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-elimu-100">{t('home.heroSubtitle')}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/formations" className="btn-gold px-5 py-3 text-base">
                🎓 {t('home.ctaPrimary')}
              </Link>
              <Link href="/orientation/test" className="btn bg-white/10 px-5 py-3 text-base text-white ring-1 ring-inset ring-white/25 hover:bg-white/15">
                🧭 {t('home.ctaSecondary')}
              </Link>
              <Link href="/ecoles" className="btn bg-transparent px-5 py-3 text-base text-elimu-100 hover:bg-white/5">
                🏫 {t('home.ctaSchool')}
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {[
                { label: t('home.statLearners'), value: formatNumber(stats.learners) },
                { label: t('home.statCourses'), value: stats.courses },
                { label: t('home.statPartners'), value: stats.partners },
                { label: t('home.statSchools'), value: stats.schools },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-xs uppercase tracking-wide text-elimu-300">{item.label}</dt>
                  <dd className="mt-1 text-2xl font-bold text-gold-300">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-gold-200">
                {locale === 'fr' ? 'Certificat numérique vérifiable' : 'Verifiable digital certificate'}
              </p>
              <div className="mt-3 rounded-xl bg-white p-4 text-slate-900 shadow-pop">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-elimu-700">SMART-ELIMU</p>
                    <p className="text-sm font-semibold text-slate-500">République démocratique du Congo</p>
                  </div>
                  <span className="text-2xl">🎖️</span>
                </div>
                <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">Décerné à</p>
                <p className="text-lg font-bold">Grâce Nsimba</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">Formation</p>
                <p className="text-sm font-semibold text-elimu-800">
                  Bureautique essentielle : Word, Excel et PowerPoint
                </p>
                <div className="mt-4 flex items-end justify-between">
                  <div className="font-mono text-[11px] text-slate-500">SE-2026-4K7Q-M2XD</div>
                  <div className="grid h-14 w-14 grid-cols-5 gap-0.5 rounded bg-slate-900 p-1">
                    {Array.from({ length: 25 }).map((_, index) => (
                      <span key={index} className={index % 3 === 0 || index % 7 === 0 ? 'bg-white' : 'bg-slate-900'} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
                {[
                  { label: 'Partenaires agréés', value: `${stats.partners}` },
                  { label: 'Filières', value: `${stats.programs}` },
                  { label: 'Certificats délivrés', value: `${stats.certificates}` },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-white/10 p-3">
                    <p className="text-lg font-bold text-white">{item.value}</p>
                    <p className="text-elimu-200">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Piliers */}
      <section className="container-page py-16">
        <SectionTitle
          eyebrow="SMART-ELIMU"
          title={t('home.pillarsTitle')}
          description={t('home.pillarsSubtitle')}
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Link key={pillar.href} href={pillar.href} className="card card-hover flex flex-col overflow-hidden">
              <div className={`bg-gradient-to-br ${pillar.color} px-6 py-6 text-white`}>
                <span className="text-3xl" aria-hidden>
                  {pillar.emoji}
                </span>
                <h3 className="mt-3 text-lg font-bold">{pillar.title}</h3>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="flex-1 text-sm leading-relaxed text-slate-600">{pillar.text}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="text-emerald-600">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <span className="mt-4 text-sm font-semibold text-elimu-700">
                  {locale === 'fr' ? 'Découvrir →' : 'Explore →'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- Formations */}
      <section className="bg-white py-16">
        <div className="container-page">
          <SectionTitle
            eyebrow={locale === 'fr' ? 'Academy' : 'Academy'}
            title={t('home.featuredCourses')}
            description={t('courses.subtitle')}
            action={
              <Link href="/formations" className="btn-outline">
                {t('common.viewAll')} →
              </Link>
            }
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Partenaires */}
      <section className="container-page py-16">
        <SectionTitle
          eyebrow={locale === 'fr' ? 'Réseau' : 'Network'}
          title={t('home.featuredPartners')}
          description={t('partners.subtitle')}
          action={
            <Link href="/partenaires" className="btn-outline">
              {t('common.viewAll')} →
            </Link>
          }
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner) => (
            <Link key={partner.id} href={`/partenaires/${partner.slug}`} className="card card-hover p-5">
              <div className="flex items-start justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                  style={{ backgroundColor: `${partner.coverColor}1a` }}
                >
                  {partner.logoEmoji}
                </span>
                <Badge tone="neutral">{PARTNER_TYPE_LABELS[partner.type]?.[locale === 'en' ? 'en' : 'fr']}</Badge>
              </div>
              <p className="mt-3 text-sm font-bold leading-snug text-slate-900">{partner.name}</p>
              <p className="mt-1 text-xs text-slate-500">
                📍 {partner.city}, {partner.province}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                {partner.programCount} {locale === 'fr' ? 'filières' : 'programmes'} ·{' '}
                {partner.courseCount} {locale === 'fr' ? 'formations' : 'courses'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------- Orientation & école */}
      <section className="bg-elimu-900 py-16 text-white">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-8 ring-1 ring-inset ring-white/10">
            <Badge tone="gold" className="bg-gold-400 text-elimu-950">
              🧭 {t('orientation.title')}
            </Badge>
            <h3 className="mt-4 text-2xl font-bold">{t('orientation.results')}</h3>
            <p className="mt-3 text-sm leading-relaxed text-elimu-100">{t('orientation.subtitle')}</p>
            <ol className="mt-5 space-y-2 text-sm text-elimu-100">
              {[
                'Répondez à 20 situations concrètes de la vie congolaise',
                'Recevez un profil parmi 6 familles (RIASEC adapté)',
                'Découvrez les filières et métiers recommandés',
                'Candidatez directement auprès d’un partenaire',
              ].map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gold-400 text-xs font-bold text-elimu-950">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <Link href="/orientation/test" className="btn-gold mt-6">
              {t('orientation.start')} →
            </Link>
          </div>

          <div className="rounded-2xl bg-white/5 p-8 ring-1 ring-inset ring-white/10">
            <Badge tone="blue" className="bg-white/15 text-white">
              🏫 {t('school.title')}
            </Badge>
            <h3 className="mt-4 text-2xl font-bold">{t('school.dashboard')}</h3>
            <p className="mt-3 text-sm leading-relaxed text-elimu-100">{t('school.subtitle')}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Élèves suivis', value: formatNumber(540) },
                { label: 'Notes enregistrées', value: formatNumber(6480) },
                { label: 'Présences ce mois', value: formatNumber(14040) },
                { label: 'Factures gérées', value: formatNumber(1080) },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-white/10 p-3">
                  <p className="text-xl font-bold text-gold-300">{item.value}</p>
                  <p className="text-xs text-elimu-200">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/ecoles" className="btn-gold">
                {t('school.requestDemo')}
              </Link>
              <Link href="/connexion" className="btn bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/15">
                {locale === 'fr' ? 'Voir la démonstration' : 'See the demo'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- Bourses */}
      <section className="container-page py-16">
        <SectionTitle
          eyebrow={locale === 'fr' ? 'Opportunités' : 'Opportunities'}
          title={t('scholarship.title')}
          description={t('scholarship.subtitle')}
          action={
            <Link href="/bourses" className="btn-outline">
              {t('common.viewAll')} →
            </Link>
          }
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {scholarships.map((scholarship) => {
            const remaining = daysUntil(scholarship.deadline);
            return (
              <div key={scholarship.id} className="card flex flex-col p-5">
                <div className="flex items-center justify-between">
                  <Badge tone="green">{scholarship.level}</Badge>
                  <span className="text-xs font-semibold text-rose-600">
                    {remaining > 0 ? `${remaining} ${t('scholarship.daysLeft')}` : 'Clôturée'}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-bold leading-snug text-slate-900">{scholarship.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{scholarship.organization}</p>
                <p className="mt-3 line-clamp-3 flex-1 text-sm text-slate-600">{scholarship.description}</p>
                <p className="mt-4 text-lg font-bold text-elimu-800">
                  {scholarship.amountUsd ? formatUsd(scholarship.amountUsd) : '—'}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------ Appel à l'action */}
      <section className="container-page pb-4">
        <div className="card flex flex-col items-center gap-4 bg-gradient-to-br from-elimu-800 to-elimu-950 p-10 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">{t('home.bandTitle')}</h2>
          <p className="max-w-2xl text-elimu-100">{t('home.bandText')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/inscription" className="btn-gold px-5 py-3">
              {t('nav.register')}
            </Link>
            <Link href="/certificats" className="btn bg-white/10 px-5 py-3 text-white ring-1 ring-inset ring-white/20 hover:bg-white/15">
              {t('nav.verify')}
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Statistiques */}
      <section className="container-page py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label={t('home.statLearners')} value={formatNumber(stats.learners)} icon="👥" hint="Comptes + inscriptions" />
          <Stat label={t('home.statCourses')} value={stats.courses} icon="📚" hint={`${stats.programs} filières partenaires`} />
          <Stat label={t('home.statPartners')} value={stats.partners} icon="🤝" hint="Universités, instituts et centres" />
          <Stat label={t('home.statSchools')} value={stats.schools} icon="🏫" hint="Établissements connectés" />
        </div>
      </section>
    </div>
  );
}
