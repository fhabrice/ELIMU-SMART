'use client';

import { ActionForm, FieldError } from '@/components/forms';
import { submitProgramApplicationAction } from '@/lib/actions/partners';

export function ApplicationForm({
  programId,
  partnerId,
  defaultName,
  defaultEmail,
  defaultCity,
}: {
  programId: string;
  partnerId: string;
  defaultName?: string;
  defaultEmail?: string;
  defaultCity?: string;
}) {
  return (
    <ActionForm
      action={submitProgramApplicationAction}
      submitLabel="Envoyer ma candidature"
      pendingLabel="Envoi en cours…"
      hiddenFields={{ programId, partnerId }}
    >
      {(state) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor={`fullName-${programId}`}>
                Nom complet *
              </label>
              <input
                id={`fullName-${programId}`}
                name="fullName"
                required
                defaultValue={defaultName}
                className="input"
                placeholder="Ex. Grâce Nsimba"
              />
              <FieldError state={state} name="fullName" />
            </div>
            <div>
              <label className="label" htmlFor={`email-${programId}`}>
                Adresse e-mail *
              </label>
              <input
                id={`email-${programId}`}
                name="email"
                type="email"
                required
                defaultValue={defaultEmail}
                className="input"
                placeholder="vous@exemple.cd"
              />
              <FieldError state={state} name="email" />
            </div>
            <div>
              <label className="label" htmlFor={`phone-${programId}`}>
                Téléphone
              </label>
              <input
                id={`phone-${programId}`}
                name="phone"
                className="input"
                placeholder="+243 …"
              />
            </div>
            <div>
              <label className="label" htmlFor={`city-${programId}`}>
                Ville
              </label>
              <input
                id={`city-${programId}`}
                name="city"
                defaultValue={defaultCity}
                className="input"
                placeholder="Kinshasa, Goma…"
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor={`message-${programId}`}>
              Message au partenaire
            </label>
            <textarea
              id={`message-${programId}`}
              name="message"
              rows={3}
              className="input"
              placeholder="Présentez votre parcours, vos résultats scolaires et votre motivation."
            />
          </div>
        </>
      )}
    </ActionForm>
  );
}
