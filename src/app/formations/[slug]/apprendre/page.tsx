import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Badge, Breadcrumb, ProgressBar } from '@/components/ui';
import { QuizForm } from '@/components/quiz-form';
import { toggleLessonAction } from '@/lib/actions/learning';
import { getCourseBySlug, getCourseContent, getCertificateForCourse, getEnrollment, listCompletedLessonIds, recomputeProgress } from '@/lib/data/catalog';
import { requireUser } from '@/lib/auth';
import { getTranslator } from '@/lib/locale';
import { LESSON_TYPES } from '@/lib/constants';
import { cn, renderMarkdown } from '@/lib/utils';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  return { title: course ? `Apprendre — ${course.title}` : 'Formation' };
}

export default async function LearnPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const user = await requireUser(`/formations/${slug}`);
  const enrollment = getEnrollment(user.id, course.id);
  if (!enrollment) redirect(`/formations/${slug}`);

  const { t, locale } = await getTranslator();
  const content = getCourseContent(course.id);
  const progress = recomputeProgress(user.id, course.id);
  const completed = new Set(listCompletedLessonIds(enrollment.id));
  const certificate = getCertificateForCourse(user.id, course.id);
  const quiz = content.quizzes[0];

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-page py-6">
          <Breadcrumb
            items={[
              { label: t('nav.courses'), href: '/formations' },
              { label: course.title, href: `/formations/${course.slug}` },
              { label: 'Apprentissage' },
            ]}
          />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {course.coverEmoji} {course.title}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {course.moduleCount} modules · {progress.total} leçons · {course.durationHours} h
              </p>
            </div>
            <div className="min-w-[240px]">
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">{t('courses.progress')}</span>
                <span className="font-bold text-elimu-800">{progress.progressPct} %</span>
              </div>
              <ProgressBar value={progress.progressPct} tone={progress.progressPct >= 100 ? 'green' : 'blue'} />
              <p className="mt-1.5 text-xs text-slate-500">
                {progress.completed} / {progress.total} leçons terminées
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {certificate && (
            <div className="card flex flex-wrap items-center justify-between gap-4 border-emerald-200 bg-emerald-50 p-5">
              <div>
                <p className="font-bold text-emerald-900">🎓 Formation terminée — félicitations !</p>
                <p className="text-sm text-emerald-800">
                  Votre certificat est disponible avec le code{' '}
                  <span className="font-mono font-semibold">{certificate.code}</span>.
                </p>
              </div>
              <Link href={`/certificats/${certificate.code}`} className="btn-primary">
                {t('cert.download')}
              </Link>
            </div>
          )}

          {content.modules.map((module, moduleIndex) => {
            const moduleDone = module.lessons.every((lesson) => completed.has(lesson.id));
            return (
              <section key={module.id} className="card overflow-hidden">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-elimu-600">
                      Module {moduleIndex + 1}
                    </p>
                    <h2 className="text-lg font-bold text-slate-900">
                      {module.title.replace(/^Module \d+ — /, '')}
                    </h2>
                    {module.summary && <p className="text-sm text-slate-500">{module.summary}</p>}
                  </div>
                  {moduleDone && <Badge tone="green">Terminé ✓</Badge>}
                </div>

                <div className="divide-y divide-slate-100">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const done = completed.has(lesson.id);
                    const type = LESSON_TYPES[lesson.type] ?? LESSON_TYPES.TEXTE;
                    return (
                      <details key={lesson.id} className="group px-5 py-4" open={!done && lessonIndex === 0}>
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                          <span className="flex items-center gap-3">
                            <span
                              className={cn(
                                'flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold',
                                done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500',
                              )}
                            >
                              {done ? '✓' : lessonIndex + 1}
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-slate-800">{lesson.title}</span>
                              <span className="text-xs text-slate-400">
                                {type.icon} {type.fr} · {lesson.durationMin} min
                              </span>
                            </span>
                          </span>
                          <span className="text-xs text-slate-400 group-open:hidden">Ouvrir ▾</span>
                        </summary>

                        <div className="mt-4">
                          {lesson.type === 'VIDEO' && (
                            <div className="mb-4 flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                              <span className="text-2xl">🎬</span>
                              Capsule vidéo — le support est rédigé ci-dessous. Les vidéos hébergées seront
                              branchées sur la plateforme de diffusion lors de la mise en production.
                            </div>
                          )}
                          <article
                            className="prose-lesson"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.content) }}
                          />

                          <form action={toggleLessonAction} className="mt-5">
                            <input type="hidden" name="slug" value={course.slug} />
                            <input type="hidden" name="lessonId" value={lesson.id} />
                            <button
                              type="submit"
                              className={cn('btn', done ? 'btn-outline' : 'btn-primary')}
                            >
                              {done ? `↺ ${t('courses.markDone')} (annuler)` : `✓ ${t('courses.markDone')}`}
                            </button>
                          </form>
                        </div>
                      </details>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {quiz && (
            <section className="card p-6" id="evaluation">
              <div className="mb-4 flex items-center gap-2">
                <Badge tone="gold">📝 {t('courses.finalQuiz')}</Badge>
                {progress.progressPct < 100 && (
                  <span className="text-xs text-slate-500">{t('courses.completeAll')}</span>
                )}
              </div>
              <QuizForm
                slug={course.slug}
                quizTitle={quiz.title}
                passingScore={quiz.passingScore}
                questions={quiz.questions}
                labels={{
                  submit: t('quiz.submit'),
                  passed: t('quiz.passed'),
                  failed: t('quiz.failed'),
                  result: t('quiz.result'),
                  explanation: t('quiz.explanation'),
                  retake: t('courses.retake'),
                }}
              />
            </section>
          )}
        </div>

        <aside className="space-y-5">
          <div className="card p-5">
            <p className="text-sm font-bold text-slate-800">Sommaire</p>
            <ol className="mt-3 space-y-2 text-sm">
              {content.modules.map((module, index) => {
                const done = module.lessons.filter((lesson) => completed.has(lesson.id)).length;
                return (
                  <li key={module.id} className="flex items-center justify-between gap-3 text-slate-600">
                    <span className="truncate">
                      {index + 1}. {module.title.replace(/^Module \d+ — /, '')}
                    </span>
                    <span className="whitespace-nowrap text-xs text-slate-400">
                      {done}/{module.lessons.length}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="card p-5">
            <p className="text-sm font-bold text-slate-800">🎓 Certificat</p>
            <p className="mt-2 text-sm text-slate-600">
              Terminez les {progress.total} leçons puis obtenez au moins 70 % à l’évaluation finale pour
              débloquer votre certificat vérifiable.
            </p>
            {certificate ? (
              <Link href={`/certificats/${certificate.code}`} className="btn-primary mt-4 w-full">
                Voir mon certificat
              </Link>
            ) : (
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                Progression requise : {progress.progressPct} % · Reste {Math.max(progress.total - progress.completed, 0)}{' '}
                leçon(s)
              </p>
            )}
          </div>

          <div className="card bg-elimu-50 p-5 text-sm text-elimu-900">
            <p className="font-semibold">Besoin d’aide ?</p>
            <p className="mt-1 text-elimu-800">
              Écrivez-nous à <span className="font-medium">support@smart-elimu.cd</span> ou passez par votre
              centre partenaire.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
