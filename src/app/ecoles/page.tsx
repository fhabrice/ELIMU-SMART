import Link from 'next/link';
import { Badge, PageHeader } from '@/components/ui';
import { listSchools } from '@/lib/data/school';
import { getTranslator } from '@/lib/locale';
import { SCHOOL_TYPES } from '@/lib/constants';
import { formatNumber } from '@/lib/utils';

export const metadata = { title: 'Gestion d’établissement scolaire' };

const MODULES = [
  {
    emoji: '🧑🏾‍🎓',
    title: 'Dossiers élèves',
    text: 'Inscription, matricule automatique, informations du responsable légal, transferts et statuts.',
  },
  {
    emoji: '🏫',
    title: 'Classes et sections',
    text: 'Création des classes, capacité, salle, enseignant titulaire et taux d’occupation.',
  },
  {
    emoji: '🗓️',
    title: 'Présences',
    text: 'Feuille de présence quotidienne par classe, absences, retards et justifications.',
  },
  {
    emoji: '📝',
    title: 'Notes et bulletins',
    text: 'Saisie par matière et par période, moyennes pondérées, rang, mention et décision automatiques.',
  },
  {
    emoji: '💰',
    title: 'Frais scolaires',
    text: 'Facturation par classe, encaissements mobile money, suivi des impayés et taux de recouvrement.',
  },
  {
    emoji: '👩🏾‍🏫',
    title: 'Équipe pédagogique',
    text: 'Fiches enseignants, matières, contrats et affectation aux classes.',
  },
];

export default async function SchoolsPage() {
  const { t, locale } = await getTranslator();
  const schools = listSchools();
  const totalStudents = schools.reduce((sum, school) => sum + school.studentCount, 0);

  return (
    <div>
      <PageHeader eyebrow="SMART-ELIMU School" title={t('school.title')} description={t('school.subtitle')}>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/ecoles/inscription" className="btn-primary px-5 py-3">
            🏫 {t('school.enrollSchool')}
          </Link>
          <Link href="/connexion" className="btn-outline px-5 py-3">
            Accéder à mon tableau de bord
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="blue">{schools.length} établissements en démonstration</Badge>
          <Badge tone="gold">{formatNumber(totalStudents)} élèves gérés</Badge>
        </div>
      </PageHeader>

      <div className="container-page space-y-12 py-10">
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((module) => (
            <div key={module.title} className="card p-6">
              <span className="text-3xl">{module.emoji}</span>
              <h2 className="mt-3 text-base font-bold text-slate-900">{module.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{module.text}</p>
            </div>
          ))}
        </section>

        <section className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-bold text-slate-900">Établissements utilisant SMART-ELIMU</h2>
            <p className="text-sm text-slate-500">
              Comptes de démonstration : chaque direction dispose de son propre espace sécurisé.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Établissement</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Province</th>
                  <th>Élèves</th>
                  <th>Classes</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {schools.map((school) => (
                  <tr key={school.id}>
                    <td className="font-medium text-slate-800">
                      {school.logoEmoji} {school.name}
                    </td>
                    <td className="font-mono text-xs text-slate-500">{school.code}</td>
                    <td className="text-xs text-slate-500">
                      {SCHOOL_TYPES[school.type]?.[locale === 'en' ? 'en' : 'fr'] ?? school.type}
                    </td>
                    <td className="text-xs text-slate-500">{school.province}</td>
                    <td>{school.studentCount}</td>
                    <td>{school.classCount}</td>
                    <td>
                      <Link href={`/ecoles/${school.code}`} className="text-sm font-semibold text-elimu-700 hover:underline">
                        Fiche publique →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="card bg-elimu-900 p-6 text-white lg:col-span-2">
            <h2 className="text-xl font-bold">Pourquoi digitaliser votre établissement ?</h2>
            <ul className="mt-4 grid gap-3 text-sm text-elimu-100 sm:grid-cols-2">
              <li>✓ Fin des cahiers de cotes perdus ou illisibles</li>
              <li>✓ Bulletins générés en quelques clics, sans recalcul manuel</li>
              <li>✓ Recouvrement des frais scolaires suivi au quotidien</li>
              <li>✓ Statistiques fiables pour les rapports d’inspection</li>
              <li>✓ Communication facilitée avec les parents</li>
              <li>✓ Historique conservé d’une année scolaire à l’autre</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/ecoles/inscription" className="btn-gold">
                {t('school.enrollSchool')}
              </Link>
              <Link href="/connexion" className="btn bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/15">
                Essayer la démonstration
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">Comptes de démonstration</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <strong>Kinshasa</strong> — direction@cs-espoir.cd
              </li>
              <li>
                <strong>Goma</strong> — direction@isj-goma.cd
              </li>
              <li>
                <strong>Lubumbashi</strong> — direction@ep-umoja.cd
              </li>
              <li>
                <strong>Bukavu</strong> — direction@cs-lareussite.cd
              </li>
            </ul>
            <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
              Mot de passe commun : <span className="font-mono">elimu2026</span>
            </p>
            <Link href="/connexion" className="btn-outline mt-4 w-full">
              Se connecter
            </Link>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-bold text-slate-900">Combien ça coûte ?</h2>
          <p className="mt-2 text-sm text-slate-600">
            SMART-ELIMU fonctionne selon un modèle adapté aux réalités congolaises : un abonnement annuel modulé
            selon la taille de l’établissement, avec une première année d’accompagnement incluse (formation des
            enseignants sur SMART-ELIMU Academy, saisie assistée des effectifs).
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              { name: 'École primaire', desc: 'Jusqu’à 500 élèves', price: 'Sur devis' },
              { name: 'École secondaire', desc: '500 à 1 200 élèves', price: 'Sur devis' },
              { name: 'Complexe scolaire', desc: 'Plus de 1 200 élèves', price: 'Sur devis' },
            ].map((plan) => (
              <div key={plan.name} className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-800">{plan.name}</p>
                <p className="text-xs text-slate-500">{plan.desc}</p>
                <p className="mt-3 text-lg font-bold text-elimu-800">{plan.price}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
