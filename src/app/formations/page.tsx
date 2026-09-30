import Link from 'next/link';
import { CourseCard } from '@/components/course-card';
import { Badge, EmptyState, PageHeader } from '@/components/ui';
import { getCourseCategories, listCourses } from '@/lib/data/catalog';
import { getTranslator } from '@/lib/locale';
import { COURSE_CATEGORIES, COURSE_LEVEL_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Catalogue de formations certifiantes' };

type SearchParams = Promise<{ q?: string; categorie?: string; niveau?: string; langue?: string }>;

export default async function CoursesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { t, locale } = await getTranslator();

  const courses = listCourses({
    q: params.q,
    category: params.categorie,
    level: params.niveau,
    language: params.langue,
  });
  const categories = getCourseCategories();
  const totalByCategory = new Map(categories.map((row) => [row.category, row.total]));

  const buildHref = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const merged = { q: params.q, categorie: params.categorie, niveau: params.niveau, langue: params.langue, ...patch };
    for (const [key, value] of Object.entries(merged)) {
      if (value) next.set(key, value);
    }
    const query = next.toString();
    return query ? `/formations?${query}` : '/formations';
  };

  const levels = ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE'];
  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
  ];

  return (
    <div>
      <PageHeader eyebrow="Academy" title={t('courses.title')} description={t('courses.subtitle')}>
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge tone="blue">{courses.length} formations disponibles</Badge>
          <Badge tone="gold">Certificat vérifiable inclus</Badge>
          <Badge tone="green">Accès immédiat après inscription</Badge>
        </div>
      </PageHeader>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
        {/* ------------------------------------------------------- Filtres */}
        <aside className="space-y-6">
          <form action="/formations" className="card p-5">
            <label className="label" htmlFor="q">
              {t('common.search')}
            </label>
            <input
              id="q"
              name="q"
              defaultValue={params.q ?? ''}
              placeholder={t('courses.searchPlaceholder')}
              className="input"
            />
            {params.categorie && <input type="hidden" name="categorie" value={params.categorie} />}
            <button type="submit" className="btn-primary mt-3 w-full">
              🔍 {t('common.search')}
            </button>
          </form>

          <div className="card p-5">
            <p className="mb-3 text-sm font-bold text-slate-800">{t('common.category')}</p>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href={buildHref({ categorie: undefined })}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2 transition',
                    !params.categorie ? 'bg-elimu-50 font-semibold text-elimu-800' : 'text-slate-600 hover:bg-slate-50',
                  )}
                >
                  {t('common.all')}
                  <span className="text-xs text-slate-400">{courses.length}</span>
                </Link>
              </li>
              {COURSE_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={buildHref({ categorie: category })}
                    className={cn(
                      'flex items-center justify-between gap-2 rounded-lg px-3 py-2 transition',
                      params.categorie === category
                        ? 'bg-elimu-50 font-semibold text-elimu-800'
                        : 'text-slate-600 hover:bg-slate-50',
                    )}
                  >
                    <span className="truncate">{category}</span>
                    <span className="text-xs text-slate-400">{totalByCategory.get(category) ?? ''}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <p className="mb-3 text-sm font-bold text-slate-800">{t('common.level')}</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildHref({ niveau: undefined })}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-semibold',
                  !params.niveau ? 'bg-elimu-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                )}
              >
                {t('common.all')}
              </Link>
              {levels.map((level) => (
                <Link
                  key={level}
                  href={buildHref({ niveau: level })}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-semibold',
                    params.niveau === level ? 'bg-elimu-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                  )}
                >
                  {COURSE_LEVEL_LABELS[level][locale === 'en' ? 'en' : 'fr']}
                </Link>
              ))}
            </div>

            <p className="mb-3 mt-5 text-sm font-bold text-slate-800">{t('common.language')}</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildHref({ langue: undefined })}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-semibold',
                  !params.langue ? 'bg-elimu-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                )}
              >
                {t('common.all')}
              </Link>
              {languages.map((language) => (
                <Link
                  key={language.code}
                  href={buildHref({ langue: language.code })}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-semibold',
                    params.langue === language.code
                      ? 'bg-elimu-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                  )}
                >
                  {language.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="card bg-gold-50 p-5">
            <p className="text-sm font-bold text-gold-900">🎁 {t('common.free')}</p>
            <p className="mt-1 text-sm text-gold-800">
              Deux formations gratuites (bureautique et éducation financière) sont accessibles sans frais,
              certificat compris.
            </p>
          </div>
        </aside>

        {/* ------------------------------------------------------- Résultats */}
        <div>
          {params.q && (
            <p className="mb-4 text-sm text-slate-500">
              {courses.length} résultat(s) pour « <strong>{params.q}</strong> » —{' '}
              <Link href="/formations" className="text-elimu-700 underline">
                réinitialiser
              </Link>
            </p>
          )}

          {courses.length === 0 ? (
            <EmptyState
              title={t('courses.empty')}
              description="Essayez un autre mot-clé ou retirez les filtres actifs."
              icon="🔍"
              action={
                <Link href="/formations" className="btn-primary">
                  {t('common.all')}
                </Link>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
