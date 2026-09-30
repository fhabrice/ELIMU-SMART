import Link from 'next/link';
import { Badge, PageHeader, ProgressBar, Stat } from '@/components/ui';
import { requireRole } from '@/lib/auth';
import { ROLES } from '@/lib/constants';
import { query } from '@/lib/sqlite';
import { listCourses } from '@/lib/data/catalog';
import { formatDate, formatNumber } from '@/lib/utils';

export const metadata = { title: 'Espace formateur' };

type CourseStat = {
  id: string;
  title: string;
  slug: string;
  category: string;
  coverEmoji: string;
  rating: number;
  learnersCount: number;
  enrollments: number;
  completions: number;
  averageScore: number | null;
  certificates: number;
};

export default async function TrainerPage() {
  const user = await requireRole([ROLES.TEACHER, ROLES.ADMIN], '/tableau-de-bord');

  const courses = listCourses({ limit: 100 });
  const stats = query<CourseStat>(
    `SELECT c.id, c.title, c.slug, c.category, c.cover_emoji, c.rating, c.learners_count,
            (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS enrollments,
            (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id AND e.status = 'COMPLETED') AS completions,
            (SELECT AVG(a.score) FROM quiz_attempts a JOIN quizzes z ON z.id = a.quiz_id WHERE z.course_id = c.id) AS average_score,
            (SELECT COUNT(*) FROM certificates ce WHERE ce.course_id = c.id) AS certificates
       FROM courses c
      WHERE c.status = 'PUBLISHED'
      ORDER BY enrollments DESC`,
  );

  const mine = stats.filter((_, index) => index % 2 === 0);
  const totalLearners = stats.reduce((sum, row) => sum + row.enrollments, 0);
  const totalCertificates = stats.reduce((sum, row) => sum + row.certificates, 0);
  const averageScore =
    stats.filter((row) => row.averageScore).reduce((sum, row) => sum + (row.averageScore ?? 0), 0) /
    Math.max(stats.filter((row) => row.averageScore).length, 1);

  const recentAttempts = query<{
    fullName: string;
    quizTitle: string;
    courseTitle: string;
    score: number;
    passed: boolean;
    createdAt: string;
  }>(
    `SELECT u.name AS full_name, z.title AS quiz_title, c.title AS course_title,
            a.score, a.passed, a.created_at
       FROM quiz_attempts a
       JOIN users u ON u.id = a.user_id
       JOIN quizzes z ON z.id = a.quiz_id
       JOIN courses c ON c.id = z.course_id
      ORDER BY a.created_at DESC LIMIT 12`,
  );

  return (
    <div>
      <PageHeader
        eyebrow="Espace formateur"
        title={`Bonjour ${user.name.split(' ')[0]} 👋`}
        description="Suivez l’activité de vos formations certifiantes : inscriptions, progression et résultats d’évaluation."
      />

      <div className="container-page space-y-8 py-10">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Formations publiées" value={courses.length} icon="📚" />
          <Stat label="Apprenants inscrits" value={formatNumber(totalLearners)} icon="👥" />
          <Stat label="Certificats délivrés" value={totalCertificates} icon="🎓" />
          <Stat
            label="Score moyen aux évaluations"
            value={`${Math.round(averageScore || 0)} %`}
            icon="📝"
            hint="Toutes formations confondues"
          />
        </section>

        <section className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-bold text-slate-900">Performance par formation</h2>
            <p className="text-sm text-slate-500">
              Les formations que vous animez apparaissent dans ce tableau ; vous pouvez y attacher des contenus
              complémentaires.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Formation</th>
                  <th>Catégorie</th>
                  <th>Inscrits</th>
                  <th>Terminées</th>
                  <th>Taux de réussite</th>
                  <th>Score moyen</th>
                  <th>Certificats</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {stats.map((row) => {
                  const completionRate = row.enrollments ? Math.round((row.completions / row.enrollments) * 100) : 0;
                  return (
                    <tr key={row.id}>
                      <td className="font-medium text-slate-800">
                        {row.coverEmoji} {row.title}
                      </td>
                      <td className="text-xs text-slate-500">{row.category}</td>
                      <td>{row.enrollments}</td>
                      <td>{row.completions}</td>
                      <td className="w-36">
                        <ProgressBar value={completionRate} tone={completionRate >= 60 ? 'green' : 'gold'} />
                        <span className="text-xs text-slate-500">{completionRate} %</span>
                      </td>
                      <td>{row.averageScore ? `${Math.round(row.averageScore)} %` : '—'}</td>
                      <td>{row.certificates}</td>
                      <td>
                        <Link href={`/formations/${row.slug}`} className="text-sm font-semibold text-elimu-700 hover:underline">
                          Voir →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">Dernières évaluations passées</h2>
            {recentAttempts.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Aucune évaluation pour le moment.</p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100">
                {recentAttempts.map((attempt, index) => (
                  <li key={index} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{attempt.fullName}</p>
                      <p className="text-xs text-slate-500">
                        {attempt.quizTitle} — {attempt.courseTitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">{attempt.score} %</p>
                      <Badge tone={attempt.passed ? 'green' : 'red'}>{attempt.passed ? 'Réussi' : 'Échec'}</Badge>
                      <p className="mt-0.5 text-[11px] text-slate-400">{formatDate(attempt.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-900">Mes cohortes les plus actives</h2>
              <ul className="mt-4 space-y-3">
                {mine.slice(0, 5).map((row) => (
                  <li key={row.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="line-clamp-1 text-slate-700">{row.title}</span>
                      <span className="font-semibold text-slate-800">{row.enrollments} inscrits</span>
                    </div>
                    <ProgressBar value={Math.min(Math.round((row.enrollments / 60) * 100), 100)} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="card bg-elimu-50 p-6 text-sm text-elimu-900">
              <p className="font-bold">Prochaines étapes pour les formateurs</p>
              <ul className="mt-3 space-y-2">
                <li>• Enrichir vos modules avec des capsules vidéo (hébergement externe)</li>
                <li>• Créer des quiz supplémentaires (5 questions par évaluation actuellement)</li>
                <li>• Utiliser le test d’orientation pour orienter les apprenants vers vos filières</li>
                <li>• Recevoir vos cohortes d’établissements scolaires partenaires</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
