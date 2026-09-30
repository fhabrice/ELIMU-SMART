import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { getTranslator } from '@/lib/locale';
import { LocaleSwitcher } from './locale-switcher';
import { logoutAction } from '@/lib/actions/auth';
import { initials } from '@/lib/utils';

export async function SiteHeader() {
  const [{ locale, t }, user] = await Promise.all([getTranslator(), getCurrentUser()]);

  const links = [
    { href: '/formations', label: t('nav.courses') },
    { href: '/partenaires', label: t('nav.partners') },
    { href: '/orientation', label: t('nav.orientation') },
    { href: '/bourses', label: t('nav.scholarships') },
    { href: '/ecoles', label: t('nav.schools') },
    { href: '/certificats', label: t('nav.verify') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-elimu-800 text-lg font-bold text-gold-300 shadow-sm">
            SE
          </span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight text-elimu-900">SMART-ELIMU</span>
            <span className="hidden text-[11px] font-medium text-slate-500 sm:block">
              RDC · Formation · Gestion scolaire · Orientation
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-elimu-50 hover:text-elimu-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LocaleSwitcher locale={locale} />
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={user.role === 'SCHOOL_ADMIN' ? '/ecoles/tableau-de-bord' : user.role === 'ADMIN' ? '/admin' : '/tableau-de-bord'}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-elimu-300 hover:text-elimu-800"
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {initials(user.name)}
                </span>
                <span className="hidden md:inline">{t('nav.dashboard')}</span>
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="btn-ghost px-2.5 py-1.5 text-xs">
                  {t('nav.logout')}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/connexion" className="btn-outline px-3 py-2 text-xs sm:text-sm">
                {t('nav.login')}
              </Link>
              <Link href="/inscription" className="btn-primary px-3 py-2 text-xs sm:text-sm">
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 lg:hidden">
        <div className="container-page flex gap-1 overflow-x-auto py-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-elimu-50 hover:text-elimu-800"
            >
              {link.label}
            </Link>
          ))}
          <div className="sm:hidden">
            <LocaleSwitcher locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
