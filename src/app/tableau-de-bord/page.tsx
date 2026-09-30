import Link from 'next/link';
import { Badge, EmptyState, PageHeader, ProgressBar, Stat } from '@/components/ui';
import { UpdateProfileForm } from '@/components/profile-form';
import { listCertificates, listEnrollments, listQuizAttempts } from '@/lib/data/catalog';
import { listOrientationResults } from '@/lib/data/orientation';
import { listProgramApplications } from '@/lib/data/partners';
import { requireUser } from '@/lib/auth';
import { getTranslator } from '@/lib/locale';
import { formatDate, initials } from '@/lib/utils';

export const metadata = { title: 'Mon espace' };

const APPLICATION_STATUS: Record<string, { label: string; tone: 'blue' | 'gold' | 'green' | 'red' | 'neutral' }> = {
  SUBMITTED: { label: 'Envoyée', tone: 'blue' },
  REVIEWING: { label: 'En cours d’examen', tone: 'gold' },
  ACCEPTED: { label: 'Acceptée', tone: 'green' },
  REJECTED: { label: 'Refusée', tone: 'red' },
  ENROLLED: { label: 'Inscrit(e)', tone: 'green' },
};

export default async function LearnerDashboard() {
  const user = await requireUser('/tableau-de-bord');
  const { t } = await getTranslator();

  const enrollments = listEnrollments(user.id);
  const certificates = listCertificates(user.id);
  const attempts = listQuizAttempts(user.id, 5);
  const orientationResults = listOrientationResults(user.id);
  const applications = listProgramApplications({ userId: user.id });

  const completed = enrollments.filter((item) => item.status === 'COMPLETED').length;
  const averageProgress =
    enrollments.length === 0
      ? 0
      : Math.round(enrollments.reduce((sum, item) => sum + item.progressPct, 0) / enrollments.length);

  return (
    <div>
      <PageHeader eyebrow={t('dashboard.title')} title={`${t('dashboard.welcome')}, ${user.name.split(' ')[0]} 👋`}>
        <div className="flex flex-wrap items-center gap-4">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white"
            style={{ backgroundColor: user.avatarColor }}
          >
            {initials(user.name)}
          </span>
          <div className="text-sm text-slate-600">
            <p className="font-semibold text-slate-800">{user.name}</p>
            <p>
              {user.email} {user.city ? `· ${user.city}` : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge tone="blue">{enrollments.length} formation(s)</Badge>
            <Badge tone="green">{certificates.length} certificat(s)</Badge>
            <Badge tone="gold">{orientationResults.length} rapport(s)</Badge>
          </div>
        </div>
      </PageHeader>

      <div className="container-page space-y-10 py-10">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Formations suivies" value={enrollments.length} icon="📚" hint={`${completed} terminée(s)`} />
          <Stat label="Progression moyenne" value={`${averageProgress} %`} icon="📈" hint="Toutes formations" />
          <Stat label="Certificats obtenus" value={certificates.length} icon="🎓" hint="Vérifiables en ligne" />
          <Stat label="Candidatures" value={applications.length} icon="📨" hint="Chez les partenaires" />
        </section>

        {/* ------------------------------------------------------- Formations */}
        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">{t('dashboard.myCourses')}</h2>
            <Link href="/formations" className="btn-outline">
              Explorer le catalogue
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title={t('dashboard.noCourses')}
                description="Choisissez une formation certifiante et commencez dès aujourd’hui."
                icon="📚"
                action={
                  <Link href="/formations" className="btn-primary">
                    Voir les formations
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{enrollment.course.coverEmoji}</span>
                      <div>
                        <p className="text-sm font-bold leading-snug text-slate-900">{enrollment.course.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {enrollment.course.category} · inscrit le {formatDate(enrollment.enrolledAt)}
                        </p>
                      </div>
                    </div>
                    <Badge tone={enrollment.status === 'COMPLETED' ? 'green' : 'blue'}>
                      {enrollment.status === 'COMPLETED' ? 'Terminée' : 'En cours'}
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
                      <span>{t('courses.progress')}</span>
                      <span className="font-semibold text-slate-700">{enrollment.progressPct} %</span>
                    </div>
                    <ProgressBar value={enrollment.progressPct} tone={enrollment.progressPct >= 100 ? 'green' : 'blue'} />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Link href={`/formations/${enrollment.course.slug}/apprendre`} className="btn-primary px-3 py-1.5 text-xs">
                      {enrollment.progressPct >= 100 ? 'Revoir' : t('courses.continue')}
                    </Link>
                    {enrollment.finalScore !== null && (
                      <span className="text-xs text-slate-500">Score final : {enrollment.finalScore} %</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ------------------------------------------------------ Certificats */}
        <section>
          <h2 className="text-xl font-bold text-slate-900">{t('dashboard.myCertificates')}</h2>
          {certificates.length === 0 ? (
            <div className="mt-4">
              <EmptyState title={t('dashboard.noCertificates')} description="Terminez une formation pour débloquer votre certificat." icon="🎓" />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {certificates.map((certificate) => (
                <Link key={certificate.id} href={`/certificats/${certificate.code}`} className="card card-hover p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🎖️</span>
                    <Badge tone={certificate.revoked ? 'red' : 'green'}>
                      {certificate.revoked ? 'Révoqué' : 'Valide'}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm font-bold leading-snug text-slate-900">{certificate.title}</p>
                  <p className="mt-1 font-mono text-xs text-slate-500">{certificate.code}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Délivré le {formatDate(certificate.issuedAt)} · {certificate.score} %
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* -------------------------------------------------- Orientation */}
          <section>
            <h2 className="text-xl font-bold text-slate-900">🧭 {t('dashboard.orientation')}</h2>
            {orientationResults.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  title="Aucun rapport d’orientation"
                  description="Passez le test pour découvrir les filières faites pour vous."
                  icon="🧭"
                  action={
                    <Link href="/orientation/test" className="btn-primary">
                      Commencer le test
                    </Link>
                  }
                />
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {orientationResults.map((result) => (
                  <li key={result.id} className="card flex items-center justify-between gap-4 p-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Profil <span className="font-mono text-elimu-700">{result.profileCode}</span> —{' '}
                        {result.profileLabel}
                      </p>
                      <p className="text-xs text-slate-500">{formatDate(result.createdAt)}</p>
                    </div>
                    <Link href={`/orientation/resultats/${result.shareCode}`} className="btn-outline px-3 py-1.5 text-xs">
                      Ouvrir
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ------------------------------------------------- Candidatures */}
          <section>
            <h2 className="text-xl font-bold text-slate-900">📨 {t('dashboard.applications')}</h2>
            {applications.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  title="Aucune candidature"
                  description="Explorez les filières de nos partenaires et déposez votre dossier."
                  icon="📨"
                  action={
                    <Link href="/partenaires" className="btn-primary">
                      Voir les partenaires
                    </Link>
                  }
                />
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {applications.map((application) => {
                  const status = APPLICATION_STATUS[application.status] ?? {
                    label: application.status,
                    tone: 'neutral' as const,
                  };
                  return (
                    <li key={application.id} className="card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{application.programName}</p>
                          <p className="text-xs text-slate-500">{application.partnerName}</p>
                        </div>
                        <Badge tone={status.tone}>{status.label}</Badge>
                      </div>
                      <p className="mt-2 text-xs text-slate-400">Déposée le {formatDate(application.createdAt)}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        {/* ----------------------------------------------------- Historique */}
        <section className="grid gap-8 lg:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">📝 Dernières évaluations</h2>
            {attempts.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Aucune évaluation passée pour le moment.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100">
                {attempts.map((attempt) => (
                  <li key={attempt.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{attempt.quizTitle}</p>
                      <p className="text-xs text-slate-500">{attempt.courseTitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">{attempt.score} %</p>
                      <p className={`text-xs ${attempt.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {attempt.passed ? 'Réussi' : 'Échec'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">⚙️ {t('dashboard.profile')}</h2>
            <div className="mt-4">
              <UpdateProfileForm
                name={user.name}
                city={user.city ?? ''}
                phone={user.phone ?? ''}
                headline={user.headline ?? ''}
                locale={user.locale}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
