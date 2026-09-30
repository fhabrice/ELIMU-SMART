'use client';

import { useRef, useTransition } from 'react';
import { LOCALES, LOCALE_LABELS, type Locale } from '@/lib/i18n';
import { setLocaleAction } from '@/lib/actions/locale';
import { cn } from '@/lib/utils';

export function LocaleSwitcher({ locale, redirectTo = '/' }: { locale: Locale; redirectTo?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  const submit = (value: Locale) => {
    const form = formRef.current;
    if (!form) return;
    const input = form.elements.namedItem('locale') as HTMLInputElement;
    input.value = value;
    startTransition(() => {
      form.requestSubmit();
    });
  };

  return (
    <form ref={formRef} action={setLocaleAction} className="flex items-center gap-0.5">
      <input type="hidden" name="locale" defaultValue={locale} />
      <input type="hidden" name="redirectTo" defaultValue={redirectTo} />
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => submit(code)}
          disabled={pending}
          title={LOCALE_LABELS[code].name}
          className={cn(
            'rounded-lg px-2 py-1 text-xs font-semibold transition',
            code === locale
              ? 'bg-elimu-100 text-elimu-800'
              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700',
          )}
        >
          {LOCALE_LABELS[code].label}
        </button>
      ))}
    </form>
  );
}
