'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { LOCALE_COOKIE } from '../auth';
import { isLocale } from '../i18n';

/** Change la langue de l'interface (cookie persistant un an). */
export async function setLocaleAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'fr');
  const target = String(formData.get('redirectTo') ?? '/');
  if (!isLocale(locale)) return;

  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  revalidatePath(target);
  revalidatePath('/', 'layout');
}
