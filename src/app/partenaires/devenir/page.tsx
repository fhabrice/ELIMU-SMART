import Link from 'next/link';
import { PageHeader } from '@/components/ui';
import { ActionForm, FieldError } from '@/components/forms';
import { submitPartnershipRequestAction } from '@/lib/actions/partners';
import { getTranslator } from '@/lib/locale';
import { PARTNER_TYPE_LABELS, PROVINCES_RDC } from '@/lib/constants';

export const metadata = { title: 'Devenir partenaire académique' };

export default async function BecomePartnerPage() {
  const { t, locale } = await getTranslator();

  return (
    <div>
      <PageHeader eyebrow="Partenariat" title={t('partner.form.title')} description={t('partner.form.subtitle')} />

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900">Formulaire de candidature</h2>
          <p className="mt-1 text-sm text-slate-500">
            Les champs marqués d’un astérisque sont obligatoires. Réponse sous 72 heures ouvrables.
          </p>

          <div className="mt-6">
            <ActionForm
              action={submitPartnershipRequestAction}
              submitLabel="Envoyer ma demande de partenariat"
              pendingLabel="Envoi en cours…"
            >
                              <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor="organizationName">
                        {t('partner.form.organization')} *
                      </label>
                      <input id="organizationName" name="organizationName" required className="input" placeholder="Ex. Institut Supérieur de Goma" />
                      <FieldError name="organizationName" />
                    </div>

                    <div>
                      <label className="label" htmlFor="organizationType">
                        {t('partner.form.type')} *
                      </label>
                      <select id="organizationType" name="organizationType" className="input" defaultValue="UNIVERSITY">
                        {Object.entries(PARTNER_TYPE_LABELS).map(([value, meta]) => (
                          <option key={value} value={value}>
                            {meta.emoji} {locale === 'en' ? meta.en : meta.fr}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label" htmlFor="contactName">
                        {t('partner.form.contact')} *
                      </label>
                      <input id="contactName" name="contactName" required className="input" placeholder="Nom et fonction" />
                      <FieldError name="contactName" />
                    </div>

                    <div>
                      <label className="label" htmlFor="email">
                        {t('common.email')} *
                      </label>
                      <input id="email" name="email" type="email" required className="input" placeholder="direction@institution.cd" />
                      <FieldError name="email" />
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

                    <div>
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

                  <div>
                    <label className="label" htmlFor="message">
                      {t('partner.form.message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="input"
                      placeholder="Décrivez vos filières, le nombre d’étudiants concernés et le type de collaboration souhaité (co-certification, stages, bourses…)."
                    />
                  </div>
                </>
            </ActionForm>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card bg-elimu-50 p-5">
            <p className="text-sm font-bold text-elimu-900">Ce que SMART-ELIMU apporte</p>
            <ul className="mt-3 space-y-2 text-sm text-elimu-900">
              {[
                'Visibilité nationale auprès des apprenants de 26 provinces',
                'Candidatures en ligne qualifiées et suivi des dossiers',
                'Co-certification numérique avec QR code de vérification',
                'Outils de gestion pour vos propres cohortes',
                'Statistiques d’attractivité par filière',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5 text-sm text-slate-600">
            <p className="font-bold text-slate-800">Ce que nous demandons</p>
            <ul className="mt-3 space-y-2">
              <li>• Être agréé par le Ministère de l’ESU ou de la Formation professionnelle</li>
              <li>• Désigner un référent académique pour les échanges</li>
              <li>• Valider les contenus co-certifiés</li>
              <li>• Communiquer les critères d’admission à jour</li>
            </ul>
          </div>

          <div className="card p-5 text-sm text-slate-600">
            <p className="font-bold text-slate-800">Déjà partenaire ?</p>
            <p className="mt-2">Accédez à votre espace pour suivre les candidatures reçues.</p>
            <Link href="/partenaires/espace" className="btn-outline mt-4 w-full">
              Espace partenaire
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
