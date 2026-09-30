import Link from 'next/link';
import { ActionForm, FieldError } from '@/components/forms';
import { registerAction } from '@/lib/actions/auth';
import { getTranslator } from '@/lib/locale';
import { PROVINCES_RDC } from '@/lib/constants';

export const metadata = { title: 'Créer un compte' };

const PROFILES = [
  { value: 'LEARNER', label: 'Apprenant(e)', hint: 'Suivre des formations et obtenir des certificats' },
  { value: 'TEACHER', label: 'Enseignant(e) / Formateur(trice)', hint: 'Encadrer des cohortes et créer des contenus' },
  { value: 'SCHOOL_ADMIN', label: 'Direction d’établissement', hint: 'Gérer une école sur SMART-ELIMU School' },
  { value: 'PARTNER', label: 'Partenaire académique', hint: 'Université, institut ou centre de formation' },
];

export default async function RegisterPage() {
  const { t } = await getTranslator();

  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-2xl font-bold text-slate-900">{t('auth.registerTitle')}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {t('auth.hasAccount')}{' '}
          <Link href="/connexion" className="font-semibold text-elimu-700 underline">
            {t('nav.login')}
          </Link>
        </p>

        <div className="card mt-6 p-6">
          <ActionForm action={registerAction} submitLabel={`${t('auth.signUp')} →`} pendingLabel="Création du compte…">
                          <>
                <fieldset>
                  <legend className="label">{t('auth.role')}</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {PROFILES.map((profile) => (
                      <label
                        key={profile.value}
                        className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-3 text-sm transition hover:border-elimu-300 hover:bg-elimu-50/40"
                      >
                        <input
                          type="radio"
                          name="role"
                          value={profile.value}
                          defaultChecked={profile.value === 'LEARNER'}
                          className="mt-0.5 h-4 w-4 border-slate-300 text-elimu-700 focus:ring-elimu-400"
                        />
                        <span>
                          <span className="block font-semibold text-slate-800">{profile.label}</span>
                          <span className="text-xs text-slate-500">{profile.hint}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="name">
                      Nom complet *
                    </label>
                    <input id="name" name="name" required className="input" placeholder="Ex. Grâce Nsimba" />
                    <FieldError name="name" />
                  </div>
                  <div>
                    <label className="label" htmlFor="email">
                      {t('common.email')} *
                    </label>
                    <input id="email" name="email" type="email" required className="input" placeholder="vous@exemple.cd" />
                    <FieldError name="email" />
                  </div>
                  <div>
                    <label className="label" htmlFor="password">
                      {t('common.password')} *
                    </label>
                    <input id="password" name="password" type="password" required minLength={6} className="input" placeholder="6 caractères minimum" />
                    <FieldError name="password" />
                  </div>
                  <div>
                    <label className="label" htmlFor="phone">
                      {t('common.phone')}
                    </label>
                    <input id="phone" name="phone" className="input" placeholder="+243 …" />
                  </div>
                  <div>
                    <label className="label" htmlFor="city">
                      {t('common.city')}
                    </label>
                    <input id="city" name="city" className="input" placeholder="Kinshasa" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="province">
                      {t('common.province')}
                    </label>
                    <select id="province" name="province" className="input" defaultValue="Kinshasa">
                      {PROVINCES_RDC.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  En créant un compte, vous acceptez les conditions d’utilisation et la politique de protection des
                  données personnelles de SMART-ELIMU.
                </p>
              </>
          </ActionForm>
        </div>
      </div>

      <aside className="space-y-5">
        <div className="card bg-gradient-to-br from-elimu-700 to-elimu-950 p-6 text-white">
          <p className="text-lg font-bold">Un compte, trois services</p>
          <ul className="mt-4 space-y-3 text-sm text-elimu-100">
            <li>🎓 <strong className="text-white">Academy</strong> — formations certifiantes et certificat numérique vérifiable</li>
            <li>🧭 <strong className="text-white">Pathways</strong> — test d’orientation, filières et bourses</li>
            <li>🏫 <strong className="text-white">School</strong> — gestion complète de votre établissement</li>
          </ul>
        </div>

        <div className="card p-5 text-sm text-slate-600">
          <p className="font-bold text-slate-800">Gratuit et sans engagement</p>
          <ul className="mt-3 space-y-2">
            <li>• Deux formations certifiantes entièrement gratuites</li>
            <li>• Test d’orientation illimité</li>
            <li>• Candidatures en ligne chez les partenaires</li>
            <li>• Aucun frais caché : les formations payantes affichent le prix en USD et en CDF</li>
          </ul>
        </div>

        <div className="card bg-gold-50 p-5 text-sm text-gold-900">
          <p className="font-bold">Paiement adapté au contexte</p>
          <p className="mt-2 text-gold-800">
            Les frais de formation peuvent être réglés par mobile money (M-Pesa, Orange Money, Airtel Money) auprès
            de votre centre partenaire. Le paiement en ligne sera activé lors de la phase suivante.
          </p>
        </div>
      </aside>
    </div>
  );
}
