import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge, Breadcrumb, InfoRow } from '@/components/ui';
import { enrollAction } from '@/lib/actions/learning';
import { getCourseBySlug, getCourseContent, getEnrollment, listCourses } from '@/lib/data/catalog';
import { getCurrentUser } from '@/lib/auth';
import { getTranslator } from '@/lib/locale';
import { COURSE_LEVEL_LABELS, LESSON_TYPES } from '@/lib/constants';
import { formatDualPrice, formatNumber, formatUsd } from '@/lib/utils';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: 'Formation introuvable' };
  return {
    title: course.title,
    description: course.summary,
  };
}

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const [{ t, locale }, user] = await Promise.all([getTranslator(), getCurrentUser()]);
  const content = getCourseContent(course.id);
  const enrollment = user ? getEnrollment(user.id, course.id) : null;
  const related = listCourses({ category: course.category, limit: 4 }).filter((item) => item.id !== course.id);
  const level = COURSE_LEVEL_LABELS[course.level] ?? { fr: course.level, en: course.level };

  return (
    <div>
      <div className="bg-elimu-950 text-white">
        <div className="container-page py-10">
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-elimu-300">
            <Link href="/" className="hover:text-white">
              {t('nav.home')}
            </Link>
            <span className="text-elimu-700">/</span>
            <Link href="/formations" className="hover:text-white">
              {t('nav.courses')}
            </Link>
            <span className="text-elimu-700">/</span>
            <span className="text-white">{course.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="gold" className="bg-gold-400 text-elimu-950">
                  {course.category}
                </Badge>
                <Badge className="bg-white/15 text-white">{locale === 'en' ? level.en : level.fr}</Badge>
                {course.isCertifying && (
                  <Badge className="bg-emerald-500/20 text-emerald-100">🎓 {t('common.certified')}</Badge>
                )}
              </div>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                <span className="mr-2" aria-hidden>
                  {course.coverEmoji}
                </span>
                {course.title}
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-elimu-100">{course.summary}</p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-elimu-200">
                <span>⏱️ {course.durationHours} {t('common.hours')}</span>
                <span>📚 {course.moduleCount} modules</span>
                <span>📝 {course.lessonCount} leçons</span>
                <span>⭐ {course.rating.toFixed(1)} / 5</span>
                <span>👥 {formatNumber(course.learnersCount)} {t('common.learners')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.4fr_0.6fr]">
        {/* --------------------------------------------------------- Contenu */}
        <div className="space-y-8">
          <section className="card p-6">
            <h2 className="text-xl font-bold text-slate-900">À propos de cette formation</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{course.description}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-elimu-50 p-4">
                <p className="text-sm font-semibold text-elimu-900">🎯 {t('courses.objects')}</p>
                <ul className="mt-2 space-y-1 text-sm text-elimu-800">
                  {content.modules.slice(0, 3).map((module) => (
                    <li key={module.id}>• {module.title.replace(/^Module \d+ — /, '')}</li>
                  ))}
                  <li>• Préparer et réussir l’évaluation finale certifiante</li>
                </ul>
              </div>
              <div className="rounded-xl bg-gold-50 p-4">
                <p className="text-sm font-semibold text-gold-900">🎓 {t('courses.certificate')}</p>
                <p className="mt-2 text-sm text-gold-800">
                  {course.certificateTitle ?? `Certificat — ${course.title}`}
                </p>
                <p className="mt-1 text-xs text-gold-700">{t('courses.certificateText')}</p>
              </div>
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">{t('courses.program')}</h2>
              <p className="text-sm text-slate-500">
                {content.modules.length} modules · {course.lessonCount} leçons ·{' '}
                {content.quizzes.length} évaluation finale
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {content.modules.map((module, moduleIndex) => (
                <div key={module.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-elimu-600">
                        Module {moduleIndex + 1}
                      </p>
                      <h3 className="text-base font-semibold text-slate-900">
                        {module.title.replace(/^Module \d+ — /, '')}
                      </h3>
                      {module.summary && <p className="mt-1 text-sm text-slate-500">{module.summary}</p>}
                    </div>
                    <span className="whitespace-nowrap text-xs text-slate-400">
                      {module.lessons.length} leçons
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {module.lessons.map((lesson) => {
                      const type = LESSON_TYPES[lesson.type] ?? LESSON_TYPES.TEXTE;
                      return (
                        <li key={lesson.id} className="flex items-center justify-between gap-3 text-sm text-slate-600">
                          <span className="flex items-center gap-2">
                            <span aria-hidden>{type.icon}</span>
                            {lesson.title}
                          </span>
                          <span className="text-xs text-slate-400">{lesson.durationMin} min</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              {content.quizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between gap-4 bg-slate-50 px-6 py-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gold-700">
                      {t('courses.finalQuiz')}
                    </p>
                    <h3 className="text-base font-semibold text-slate-900">{quiz.title}</h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    {quiz.questions.length} questions · {quiz.passingScore} %
                  </span>
                </div>
              ))}
            </div>
          </section>

          {related.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                Formations similaires — {course.category}
              </h2>
              <div className="grid gap-5 sm:grid-cols-3">
                {related.slice(0, 3).map((item) => (
                  <Link key={item.id} href={`/formations/${item.slug}`} className="card card-hover p-4">
                    <span className="text-2xl">{item.coverEmoji}</span>
                    <p className="mt-2 text-sm font-semibold leading-snug text-slate-900">{item.title}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {item.durationHours} h · {item.priceUsd === 0 ? t('common.free') : formatUsd(item.priceUsd)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* -------------------------------------------------------- Colonne CTA */}
        <aside className="space-y-5">
          <div className="card sticky top-20 p-6">
            <p className="text-3xl font-extrabold text-elimu-900">
              {course.priceUsd === 0 ? '🎁 Gratuit' : formatUsd(course.priceUsd)}
            </p>
            {course.priceUsd > 0 && (
              <p className="mt-1 text-sm text-slate-500">{formatDualPrice(course.priceUsd, course.priceCdf)}</p>
            )}

            {enrollment ? (
              <div className="mt-5 space-y-3">
                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  ✅ {t('courses.enrolled')} — {t('courses.progress')} : {enrollment.progressPct} %
                </div>
                <Link href={`/formations/${course.slug}/apprendre`} className="btn-primary w-full">
                  {t('courses.continue')} →
                </Link>
              </div>
            ) : (
              <form action={enrollAction} className="mt-5">
                <input type="hidden" name="slug" value={course.slug} />
                <button type="submit" className="btn-primary w-full">
                  {course.priceUsd === 0 ? `🎓 ${t('courses.enroll')} — ${t('common.free')}` : `🎓 ${t('courses.enroll')}`}
                </button>
                <p className="mt-2 text-center text-xs text-slate-400">
                  {user ? 'Accès immédiat' : 'Un compte gratuit suffit'}
                </p>
              </form>
            )}

            <div className="mt-6">
              <InfoRow label={t('common.duration')} value={`${course.durationHours} ${t('common.hours')}`} />
              <InfoRow
                label={t('common.level')}
                value={locale === 'en' ? level.en : level.fr}
              />
              <InfoRow label={t('common.language')} value={course.language === 'en' ? 'English' : 'Français'} />
              <InfoRow label="Modules" value={`${course.moduleCount}`} />
              <InfoRow label="Leçons" value={`${course.lessonCount}`} />
              <InfoRow label={t('common.certified')} value={course.isCertifying ? 'Oui 🎓' : 'Non'} />
            </div>

            {(course.partnerName || course.instructorName) && (
              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
                {course.partnerName && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">{t('common.partner')}</p>
                    <p className="font-semibold text-slate-800">
                      {course.partnerLogo} {course.partnerName}
                    </p>
                  </div>
                )}
                {course.instructorName && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">{t('courses.instructor')}</p>
                    <p className="font-semibold text-slate-800">👩🏾‍🏫 {course.instructorName}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
