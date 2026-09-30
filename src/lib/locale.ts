import 'server-only';
import { cookies } from 'next/headers';
import { LOCALE_COOKIE } from './auth';
import { createTranslator, isLocale, type Locale, type Translator } from './i18n';

/** Locale courante (cookie `elimu_locale`, français par défaut). */
export async function getLocale(): Promise<Locale> {
  try {
    const store = await cookies();
    const value = store.get(LOCALE_COOKIE)?.value;
    return isLocale(value) ? value : 'fr';
  } catch {
    return 'fr';
  }
}

export async function getTranslator(): Promise<{ locale: Locale; t: Translator }> {
  const locale = await getLocale();
  return { locale, t: createTranslator(locale) };
}
