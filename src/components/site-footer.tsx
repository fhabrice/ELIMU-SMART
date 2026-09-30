import Link from 'next/link';
import { getTranslator } from '@/lib/locale';
import { coverage, LOCALES, LOCALE_LABELS } from '@/lib/i18n';

export async function SiteFooter() {
  const { t, locale } = await getTranslator();

  return (
    <footer className="mt-16 bg-elimu-950 text-elimu-100">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-400 text-lg font-bold text-elimu-950">
              SE
            </span>
            <div>
              <p className="text-lg font-extrabold text-white">SMART-ELIMU</p>
              <p className="text-xs text-elimu-300">{t('brand.tagline')}</p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-elimu-200">{t('brand.promise')}</p>
          <p className="mt-4 text-sm text-elimu-300">
            📍 {t('footer.basedIn')} · ✉️ contact@smart-elimu.cd · ☎️ +243 800 000 000
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {LOCALES.map((code) => (
              <span
                key={code}
                className="rounded-full bg-elimu-900 px-2.5 py-1 text-elimu-200"
                title={`${LOCALE_LABELS[code].name} — ${coverage(code)}%`}
              >
                {LOCALE_LABELS[code].flag} {LOCALE_LABELS[code].name} {coverage(code)}%
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">{t('footer.product')}</p>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/formations', label: t('nav.courses') },
              { href: '/orientation', label: t('nav.orientation') },
              { href: '/ecoles', label: t('nav.schools') },
              { href: '/partenaires', label: t('nav.partners') },
              { href: '/bourses', label: t('nav.scholarships') },
              { href: '/certificats', label: t('nav.verify') },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-elimu-200 transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">{t('footer.resources')}</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/a-propos" className="text-elimu-200 transition hover:text-white">
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <Link href="/partenaires/devenir" className="text-elimu-200 transition hover:text-white">
                {t('partners.become')}
              </Link>
            </li>
            <li>
              <Link href="/ecoles/inscription" className="text-elimu-200 transition hover:text-white">
                {t('school.enrollSchool')}
              </Link>
            </li>
            <li>
              <Link href="/connexion" className="text-elimu-200 transition hover:text-white">
                {t('nav.login')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-elimu-900">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-elimu-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SMART-ELIMU. {t('footer.rights')}</p>
          <p>
            {t('footer.legal')} · Langue active : {LOCALE_LABELS[locale].name}
          </p>
        </div>
      </div>
    </footer>
  );
}
