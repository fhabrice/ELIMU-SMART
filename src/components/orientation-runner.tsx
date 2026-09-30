'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import { submitOrientationAction, type OrientationState } from '@/lib/actions/orientation';
import { ORIENTATION_QUESTIONS } from '@/lib/orientation';
import { PROVINCES_RDC } from '@/lib/constants';
import { cn } from '@/lib/utils';

const EDUCATION_LEVELS = [
  { value: 'SECONDAIRE', label: 'Élève du secondaire' },
  { value: 'DIPLOME_ETAT', label: 'Titulaire du Diplôme d’État' },
  { value: 'LICENCE', label: 'Étudiant(e) du supérieur / Licence' },
  { value: 'AUTRE', label: 'Autre parcours' },
];

/**
 * Questionnaire d'orientation.
 *
 * Le formulaire complet (toutes les questions + coordonnées) est rendu côté
 * serveur : il reste donc utilisable sans JavaScript. Dès que le navigateur
 * exécute le composant, le mode « pas à pas » prend le relais pour une saisie
 * plus rapide sur mobile.
 */
export function OrientationRunner({
  defaultName = '',
  defaultEmail = '',
  defaultProvince = 'Kinshasa',
}: {
  defaultName?: string;
  defaultEmail?: string;
  defaultProvince?: string;
}) {
  const [state, formAction] = useActionState<OrientationState, FormData>(submitOrientationAction, {
    ok: false,
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [stepper, setStepper] = useState(false);

  useEffect(() => setStepper(true), []);

  const total = ORIENTATION_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const isLast = step >= total;
  const progress = Math.round((answeredCount / total) * 100);

  const missingNow = useMemo(
    () => ORIENTATION_QUESTIONS.filter((item) => !answers[item.id]).map((item) => item.id),
    [answers],
  );

  const choose = (questionId: string, optionId: string) => {
    setAnswers((previous) => ({ ...previous, [questionId]: optionId }));
    setStep((current) => current + 1);
  };

  return (
    <form action={formAction} className="space-y-6">
      {stepper && (
        <style>{`
          .elimu-question, .elimu-identity { display: none; }
          .elimu-question[data-active='true'], .elimu-identity[data-active='true'] { display: block; }
        `}</style>
      )}

      {/* -------------------------------------------------- Progression */}
      <div className="card p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-700">
            {stepper
              ? isLast
                ? 'Dernière étape : vos informations'
                : `Question ${Math.min(step + 1, total)} sur ${total}`
              : `${total} situations à compléter`}
          </span>
          <span className="font-bold text-elimu-700">{progress} %</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-elimu-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          {answeredCount} / {total} réponses enregistrées
          {!stepper && ' — répondez à toutes les situations puis validez en bas de page.'}
        </p>
      </div>

      {state.message && (
        <div
          className={cn(
            'rounded-xl border px-4 py-3 text-sm',
            state.ok
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-rose-200 bg-rose-50 text-rose-900',
          )}
        >
          {state.ok ? '✅ ' : '⚠️ '}
          {state.message}
          {state.missing && state.missing.length > 0 && stepper && (
            <>
              {' '}
              <button
                type="button"
                onClick={() =>
                  setStep(ORIENTATION_QUESTIONS.findIndex((item) => item.id === state.missing?.[0]))
                }
                className="font-semibold underline"
              >
                Reprendre le questionnaire
              </button>
            </>
          )}
        </div>
      )}

      {/* -------------------------------------------------- Questions */}
      {ORIENTATION_QUESTIONS.map((question, index) => (
        <section
          key={question.id}
          data-active={stepper ? index === step : undefined}
          className="elimu-question card p-6 sm:p-8"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-elimu-600">
            Situation {index + 1} / {total}
          </p>
          <h2 className="mt-3 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">{question.prompt}</h2>

          <div className="mt-6 space-y-3">
            {question.options.map((option) => {
              const selected = answers[question.id] === option.id;
              return (
                <label
                  key={option.id}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 text-sm font-medium transition',
                    selected
                      ? 'border-elimu-500 bg-elimu-50 text-elimu-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-elimu-300 hover:bg-elimu-50/40',
                  )}
                >
                  <input
                    type="radio"
                    name={`q_${question.id}`}
                    value={option.id}
                    checked={selected}
                    onChange={() => choose(question.id, option.id)}
                    className="mt-0.5 h-4 w-4 shrink-0 border-slate-300 text-elimu-600 focus:ring-elimu-400"
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>

          {stepper && (
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((current) => Math.max(current - 1, 0))}
                disabled={index === 0}
                className="btn-ghost disabled:opacity-40"
              >
                ← Précédent
              </button>
              <button
                type="button"
                onClick={() => setStep((current) => current + 1)}
                className="btn-outline"
              >
                Passer →
              </button>
            </div>
          )}
        </section>
      ))}

      {/* -------------------------------------------------- Coordonnées */}
      <section data-active={stepper ? isLast : undefined} className="elimu-identity card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">Vos informations</h2>
        <p className="mt-1 text-sm text-slate-500">
          Elles apparaissent sur le rapport d’orientation. Votre adresse e-mail permet à notre équipe de vous envoyer
          les opportunités correspondant à votre profil.
        </p>

        {missingNow.length > 0 && (
          <div className="mt-5 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-900">
            ⚠️ {missingNow.length} situation(s) sans réponse. Vous pouvez les compléter
            {stepper ? (
              <>
                {' '}
                <button
                  type="button"
                  onClick={() => setStep(ORIENTATION_QUESTIONS.findIndex((item) => item.id === missingNow[0]))}
                  className="font-semibold underline"
                >
                  reprendre
                </button>{' '}
                ou
              </>
            ) : (
              ' (elles sont plus haut sur cette page) ou'
            )}{' '}
            valider vos réponses actuelles.
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">
              Nom complet *
            </label>
            <input id="name" name="name" required defaultValue={defaultName} className="input" placeholder="Ex. Grâce Nsimba" />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Adresse e-mail
            </label>
            <input id="email" name="email" type="email" defaultValue={defaultEmail} className="input" placeholder="vous@exemple.cd" />
          </div>
          <div>
            <label className="label" htmlFor="educationLevel">
              Niveau d’études actuel
            </label>
            <select id="educationLevel" name="educationLevel" className="input" defaultValue="DIPLOME_ETAT">
              {EDUCATION_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="province">
              Province
            </label>
            <select id="province" name="province" className="input" defaultValue={defaultProvince}>
              {PROVINCES_RDC.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" className="btn-primary" disabled={stepper && answeredCount === 0}>
            📊 Générer mon rapport d’orientation
          </button>
          {stepper && (
            <button type="button" onClick={() => setStep(0)} className="btn-ghost">
              ↺ Revoir les questions
            </button>
          )}
        </div>
      </section>
    </form>
  );
}
