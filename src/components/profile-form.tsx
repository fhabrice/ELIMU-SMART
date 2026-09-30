'use client';

import { ActionForm, FieldError } from '@/components/forms';
import { updateProfileAction } from '@/lib/actions/auth';
import { LOCALES, LOCALE_LABELS } from '@/lib/i18n';

export function UpdateProfileForm({
  name,
  city,
  phone,
  headline,
  locale,
}: {
  name: string;
  city: string;
  phone: string;
  headline: string;
  locale: string;
}) {
  return (
    <ActionForm action={updateProfileAction} submitLabel="Enregistrer mon profil">
      {(state) => (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="profile-name">
              Nom complet
            </label>
            <input id="profile-name" name="name" defaultValue={name} className="input" />
            <FieldError state={state} name="name" />
          </div>
          <div>
            <label className="label" htmlFor="profile-city">
              Ville
            </label>
            <input id="profile-city" name="city" defaultValue={city} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="profile-phone">
              Téléphone
            </label>
            <input id="profile-phone" name="phone" defaultValue={phone} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="profile-headline">
              Présentation courte
            </label>
            <input
              id="profile-headline"
              name="headline"
              defaultValue={headline}
              className="input"
              placeholder="Ex. Étudiante en gestion, passionnée de comptabilité"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="profile-locale">
              Langue de l’interface
            </label>
            <select id="profile-locale" name="locale" defaultValue={locale} className="input">
              {LOCALES.map((code) => (
                <option key={code} value={code}>
                  {LOCALE_LABELS[code].flag} {LOCALE_LABELS[code].name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </ActionForm>
  );
}
