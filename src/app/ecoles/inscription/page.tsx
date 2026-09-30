import Link from 'next/link';
import { PageHeader } from '@/components/ui';
import { ActionForm, FieldError } from '@/components/forms';
import { createSchoolAction } from '@/lib/actions/school';
import { getCurrentUser } from '@/lib/auth';
import { PROVINCES_RDC, SCHOOL_TYPES } from '@/lib/constants';

export const metadata = { title: 'Inscrire mon établissement' };

export default async function RegisterSchoolPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <PageHeader
        eyebrow="SMART-ELIMU School"
        title="Inscrire mon établissement"
        description="Créez l’espace de gestion de votre école en quelques minutes. Les données existantes peuvent ensuite être importées depuis un fichier Excel."
      />

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          {!user ? (
            <div className="space-y-4">
              <p className="text-slate-700">
                La création d’un espace établissement nécessite un compte SMART-ELIMU. Cela prend moins d’une minute.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/inscription" className="btn-primary">
                  Créer mon compte
                </Link>
                <Link href="/connexion?suivant=/ecoles/inscription" className="btn-outline">
                  J’ai déjà un compte
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-slate-900">Informations de l’établissement</h2>
              <p className="mt-1 text-sm text-slate-500">
                Connecté(e) en tant que <strong>{user.name}</strong> ({user.email}). Un code d’établissement sera
                généré automatiquement.
              </p>

              <div className="mt-6">
                <ActionForm action={createSchoolAction} submitLabel="Créer l’espace de mon école" pendingLabel="Création…">
                                      <>
                      <div>
                        <label className="label" htmlFor="name">
                          Nom de l’établissement *
                        </label>
                        <input id="name" name="name" required className="input" placeholder="Ex. Complexe Scolaire Espoir" />
                        <FieldError name="name" />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="label" htmlFor="type">
                            Type d’établissement *
                          </label>
                          <select id="type" name="type" className="input" defaultValue="MIXTE">
                            {Object.entries(SCHOOL_TYPES).map(([value, meta]) => (
                              <option key={value} value={value}>
                                {meta.fr}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="label" htmlFor="capacity">
                            Capacité d’accueil
                          </label>
                          <input id="capacity" name="capacity" type="number" min={20} defaultValue={500} className="input" />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="label" htmlFor="city">
                            Ville *
                          </label>
                          <input id="city" name="city" required className="input" placeholder="Kinshasa" />
                          <FieldError name="city" />
                        </div>
                        <div>
                          <label className="label" htmlFor="province">
                            Province *
                          </label>
                          <select id="province" name="province" className="input" defaultValue={user.province ?? 'Kinshasa'}>
                            {PROVINCES_RDC.map((province) => (
                              <option key={province} value={province}>
                                {province}
                              </option>
                            ))}
                          </select>
                          <FieldError name="province" />
                        </div>
                      </div>

                      <div>
                        <label className="label" htmlFor="address">
                          Adresse complète
                        </label>
                        <input id="address" name="address" className="input" placeholder="Avenue, quartier, commune" />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="label" htmlFor="directorName">
                            Nom du directeur / de la directrice *
                          </label>
                          <input
                            id="directorName"
                            name="directorName"
                            required
                            className="input"
                            defaultValue={user.name}
                          />
                          <FieldError name="directorName" />
                        </div>
                        <div>
                          <label className="label" htmlFor="phone">
                            Téléphone
                          </label>
                          <input id="phone" name="phone" className="input" defaultValue={user.phone ?? ''} placeholder="+243 …" />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="label" htmlFor="email">
                            E-mail de l’établissement
                          </label>
                          <input id="email" name="email" type="email" className="input" placeholder="direction@ecole.cd" />
                          <FieldError name="email" />
                        </div>
                        <div>
                          <label className="label" htmlFor="motto">
                            Devise / slogan
                          </label>
                          <input id="motto" name="motto" className="input" placeholder="Discipline — Travail — Excellence" />
                        </div>
                      </div>

                      <p className="text-xs text-slate-400">
                        En créant l’espace, votre compte devient « Direction d’établissement » et vous accédez
                        immédiatement au tableau de bord.
                      </p>
                    </>
                </ActionForm>
              </div>
            </>
          )}
        </div>

        <aside className="space-y-5">
          <div className="card p-5">
            <p className="text-sm font-bold text-slate-800">Ce qui est inclus</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>✓ Dossiers élèves illimités (selon votre capacité déclarée)</li>
              <li>✓ Classes, enseignants, présences et notes</li>
              <li>✓ Bulletins automatiques avec mention et décision</li>
              <li>✓ Facturation des frais scolaires et suivi des paiements</li>
              <li>✓ Formation gratuite de vos enseignants sur SMART-ELIMU Academy</li>
            </ul>
          </div>

          <div className="card bg-gold-50 p-5 text-sm text-gold-900">
            <p className="font-bold">Migration de vos données</p>
            <p className="mt-2 text-gold-800">
              Vous utilisez déjà un fichier Excel ou un cahier de cotes ? Notre équipe vous accompagne pour importer
              vos listes d’élèves et vos notes sans ressaisie.
            </p>
            <p className="mt-2 font-medium">support@smart-elimu.cd</p>
          </div>

          <div className="card p-5 text-sm text-slate-600">
            <p className="font-bold text-slate-800">Fonctionne hors ligne</p>
            <p className="mt-2">
              Les pages sont optimisées pour les connexions lentes. Les saisies de présences peuvent être préparées
              hors connexion puis synchronisées dès le retour du réseau.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
