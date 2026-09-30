'use client';

import { createContext, useContext, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { ReactNode } from 'react';
import type { ActionState } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';

type ServerAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

const INITIAL_STATE: ActionState = { ok: false };

const FormStateContext = createContext<ActionState>(INITIAL_STATE);

export function SubmitButton({
  children,
  className,
  pendingLabel = 'Traitement…',
}: {
  children: ReactNode;
  className?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn('btn-primary', className)}>
      {pending ? pendingLabel : children}
    </button>
  );
}

export function FormMessage({ state }: { state?: ActionState }) {
  const contextState = useContext(FormStateContext);
  const current = state ?? contextState;
  if (!current.message) return null;
  return (
    <div
      role="status"
      className={cn(
        'rounded-xl border px-4 py-3 text-sm',
        current.ok
          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
          : 'border-rose-200 bg-rose-50 text-rose-900',
      )}
    >
      {current.ok ? '✅ ' : '⚠️ '}
      {current.message}
    </div>
  );
}

export function FieldError({ state, name }: { state?: ActionState; name: string }) {
  const contextState = useContext(FormStateContext);
  const error = (state ?? contextState).fieldErrors?.[name];
  if (!error) return null;
  return <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>;
}

/**
 * Formulaire relié à une action serveur.
 *
 * - Depuis un composant serveur : passer les champs en `children` (JSX simple) ;
 *   `FieldError` et `FormMessage` lisent l'état via le contexte du formulaire.
 * - Depuis un composant client : `children` peut aussi être une fonction
 *   `(state) => JSX` pour un affichage conditionnel avancé.
 */
export function ActionForm({
  action,
  children,
  className,
  submitLabel = 'Envoyer',
  pendingLabel,
  hiddenFields,
  footer,
}: {
  action: ServerAction;
  children: ReactNode | ((state: ActionState) => ReactNode);
  className?: string;
  submitLabel?: string;
  pendingLabel?: string;
  hiddenFields?: Record<string, string>;
  footer?: ReactNode;
}) {
  const [state, formAction] = useActionState(action, INITIAL_STATE);
  const done = state.ok;

  return (
    <form action={formAction} className={cn('space-y-4', className)}>
      {hiddenFields &&
        Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
      <FormStateContext.Provider value={state}>
        {state.message && <FormMessage />}
        {done && footer ? footer : null}
        {!done && (
          <>
            {typeof children === 'function' ? children(state) : children}
            <SubmitButton pendingLabel={pendingLabel}>{submitLabel}</SubmitButton>
          </>
        )}
      </FormStateContext.Provider>
    </form>
  );
}
