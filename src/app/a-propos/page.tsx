import Link from 'next/link';
import { Badge, PageHeader } from '@/components/ui';
import { coverage, LOCALES, LOCALE_LABELS } from '@/lib/i18n';
import { platformStats } from '@/lib/data/stats';
import { formatNumber } from '@/lib/utils';

export const metadata = { title: 'À propos de SMART-ELIMU' };

const ROADMAP = [
  {
    phase: 'Phase 1 — Socle (livré)',
    status: 'Terminé',
    tone: 'green' as const,
    items: [
      'Catalogue de 12 formations certifiantes (108 leçons, 60 questions d’évaluation)',
      'Gestion complète d’établissement : élèves, classes, notes, bulletins, présences, frais',
      'Test d’orientation RIASEC adapté + recommandations de filières et de bourses',
      'Réseau de 15 partenaires avec 36 filières et 8 bourses',
      'Certificats numériques vérifiables par QR code',
      'Interface multilingue (français, anglais, lingala, swahili)',
    ],
  },
  {
    phase: 'Phase 2 — Paiements & vidéos',
    status: 'À venir',
    tone: 'gold' as const,
    items: [
      'Paiement en ligne par mobile money (M-Pesa, Orange Money, Airtel Money) et carte',
      'Hébergement vidéo et lecteur optimisé pour les connexions lentes',
      'Mode hors ligne (PWA) pour la saisie des présences en zone rurale',
      'Application mobile Android (Google Play)',
    ],
  },
  {
    phase: 'Phase 3 — Réseau & IA',
    status: 'Prospectif',
    tone: 'blue' as const,
    items: [
      'Interopérabilité avec les systèmes des ministères (EPST, ESU, Formation professionnelle)',
      'Assistant d’orientation conversationnel en français, lingala et swahili',
      'Co-certification automatique avec les universités partenaires',
      'Tableaux de bord statistiques pour les provinces',
    ],
  },
];

export default function AboutPage() {
  const stats = platformStats();

  return (
    <div>
      <PageHeader
        eyebrow="À propos"
        title="SMART-ELIMU, l’infrastructure éducative numérique de la RDC"
        description="Née à Kinshasa, SMART-ELIMU relie trois besoins structurels du système éducatif congolais : qualifier la jeunesse, outiller les établissements et éclairer les choix d’orientation."
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">🇨🇩 Basée en RDC</Badge>
          <Badge tone="gold">Partenaires agréés ESU / MFPM</Badge>
          <Badge tone="green">Données hébergées et maîtrisées localement</Badge>
        </div>
      </PageHeader>

      <div className="container-page space-y-12 py-10">
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900">Notre mission</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              En République démocratique du Congo, plus de la moitié de la population a moins de 20 ans. Chaque année,
              des centaines de milliers de jeunes sortent du secondaire sans qualification professionnelle, tandis que
              les établissements scolaires gèrent encore leurs notes et leurs effectifs sur papier. Parallèlement, les
              universités et centres de formation agréés peinent à faire connaître leurs filières.
            </p>
            <p className="mt-3 leading-relaxed text-slate-600">
              SMART-ELIMU apporte une réponse unique : une plateforme qui <strong>forme et certifie</strong> les
              apprenants, <strong>outille</strong> les établissements scolaires et <strong>oriente</strong> les jeunes
              vers les filières et les partenaires qui leur correspondent.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Formations certifiantes', value: stats.courses },
                { label: 'Partenaires agréés', value: stats.partners },
                { label: 'Établissements connectés', value: stats.schools },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-2xl font-bold text-elimu-800">{item.value}</p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">Nos principes</h2>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              <li>
                <strong className="text-slate-800">Accessibilité</strong> — interface légère, utilisable en 3G, en
                français comme en langues nationales.
              </li>
              <li>
                <strong className="text-slate-800">Qualité vérifiable</strong> — chaque certificat possède un code et
                une empreinte cryptographique contrôlables par un employeur.
              </li>
              <li>
                <strong className="text-slate-800">Partenariat réel</strong> — les contenus et les filières sont
                co-validés avec des institutions agréées.
              </li>
              <li>
                <strong className="text-slate-800">Souveraineté des données</strong> — la plateforme peut être
                hébergée en RDC et fonctionner sans dépendance à un service extérieur.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">Feuille de route</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {ROADMAP.map((phase) => (
              <div key={phase.phase} className="card flex flex-col p-6">
                <Badge tone={phase.tone}>{phase.status}</Badge>
                <h3 className="mt-3 text-base font-bold text-slate-900">{phase.phase}</h3>
                <ul className="mt-3 flex-1 space-y-2 text-sm text-slate-600">
                  {phase.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-elimu-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-slate-900">Langues disponibles</h2>
            <p className="mt-2 text-sm text-slate-600">
              L’interface est traduite progressivement. Les clés non traduites retombent automatiquement sur le
              français, ce qui permet à nos partenaires de contribuer aux versions lingala et swahili.
            </p>
            <ul className="mt-4 space-y-3">
              {LOCALES.map((code) => (
                <li key={code}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-slate-700">
                      {LOCALE_LABELS[code].flag} {LOCALE_LABELS[code].name}
                    </span>
                    <span className="font-semibold text-slate-800">{coverage(code)} %</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-elimu-600" style={{ width: `${coverage(code)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold text-slate-900">Contact & partenariats</h2>
            <div className="mt-3 space-y-3 text-sm text-slate-600">
              <p>📍 Kinshasa, République démocratique du Congo</p>
              <p>✉️ contact@smart-elimu.cd</p>
              <p>🤝 partenariat@smart-elimu.cd</p>
              <p>☎️ +243 800 000 000</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/partenaires/devenir" className="btn-primary">
                Devenir partenaire
              </Link>
              <Link href="/ecoles/inscription" className="btn-outline">
                Inscrire mon établissement
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              {formatNumber(stats.learners)} apprenants accompagnés · {stats.certificates} certificats délivrés ·{' '}
              {stats.orientationTests} rapports d’orientation
            </p>
          </div>
        </section>

        <section className="card bg-elimu-950 p-8 text-white">
          <h2 className="text-xl font-bold">Construit pour le contexte congolais</h2>
          <div className="mt-4 grid gap-6 text-sm text-elimu-100 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-semibold text-gold-300">Connexion limitée</p>
              <p className="mt-1">
                Pages compressées, images légères, aucune dépendance à un CDN externe ; le contenu pédagogique est
                textuel en priorité.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gold-300">Deux monnaies</p>
              <p className="mt-1">
                Les prix sont affichés en dollars et en francs congolais pour éviter toute ambiguïté lors de
                l’inscription.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gold-300">Paiement mobile</p>
              <p className="mt-1">
                Les frais scolaires et de formation sont encaissés via mobile money, avec référence de transaction.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gold-300">Système national</p>
              <p className="mt-1">
                Notation sur 100, seuil de réussite à 50 %, mentions et décisions conformes aux usages de l’EPST.
              </p>
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-bold text-slate-900">Avertissement</h2>
          <p className="mt-2 text-sm text-slate-600">
            Les établissements, programmes, bourses et données d’élèves présentés dans cette version de démonstration
            sont fictifs et servent à illustrer le fonctionnement de la plateforme. Aucune donnée réelle d’élève n’est
            utilisée.
          </p>
        </section>
      </div>
    </div>
  );
}
