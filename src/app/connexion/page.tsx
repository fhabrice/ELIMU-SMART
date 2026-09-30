import Link from 'next/link';
import { ActionForm, FieldError } from '@/components/forms';
import { loginAction } from '@/lib/actions/auth';
import { getTranslator } from '@/lib/locale';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Connexion' };

const DEMO_ACCOUNTS = [
  { label: 'Apprenant', email: 'apprenant@smart-elimu.cd', hint: 'Formations, certificats, orientation' },
  { label: 'Direction d’école', email: 'direction@cs-espoir.cd', hint: 'Élèves, notes, frais scolaires' },
  { label: 'Formateur', email: 'formateur@smart-elimu.cd', hint: 'Suivi pédagogique' },
  { label: 'Partenaire', email: 'partenaire@unv-kinshasa.cd', hint: 'Candidatures reçues' },
  { label: 'Administration', email: 'admin@smart-elimu.cd', hint: 'Pilotage de la plateforme' },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ suivant?: string }>;
}) {
  const params = await searchParams;
  const { t } = await getTranslator();
  const user = await getCurrentUser();
  if (user) redirect(params.suivant ?? '/tableau-de-bord');

  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-2">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900">{t('auth.loginTitle')}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {t('auth.noAccount')}{' '}
          <Link href="/inscription" className="font-semibold text-elimu-700 underline">
            {t('nav.register')}
          </Link>
        </p>

        <div className="card mt-6 p-6">
          <ActionForm action={loginAction} submitLabel={`🔐 ${t('auth.signIn')}`} pendingLabel="Connexion…">
                          <>
                <div>
                  <label className="label" htmlFor="email">
                    {t('common.email')}
                  </label>
                  <input id="email" name="email" type="email" required className="input" placeholder="vous@exemple.cd" />
                  <FieldError name="email" />
                </div>
                <div>
                  <label className="label" htmlFor="password">
                    {t('common.password')}
                  </label>
                  <input id="password" name="password" type="password" required className="input" placeholder="••••••••" />
                  <FieldError name="password" />
                </div>
                <p className="text-xs text-slate-400">
                  {t('auth.forgot')} Contactez l’administration à support@smart-elimu.cd
                </p>
              </>
          </ActionForm>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="card bg-elimu-950 p-6 text-white">
          <p className="text-sm font-bold text-gold-300">🔑 {t('auth.demoAccounts')}</p>
          <p className="mt-2 text-sm text-elimu-100">
            Tous les comptes de démonstration utilisent le mot de passe <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono">elimu2026</code>.
          </p>
          <ul className="mt-4 space-y-2">
            {DEMO_ACCOUNTS.map((account) => (
              <li key={account.email} className="rounded-xl bg-white/5 px-4 py-3">
                <p className="text-sm font-semibold text-white">{account.label}</p>
                <p className="font-mono text-xs text-gold-200">{account.email}</p>
                <p className="text-xs text-elimu-300">{account.hint}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
