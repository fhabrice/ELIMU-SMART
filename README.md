# SMART-ELIMU 🇨🇩

**Plateforme éducative congolaise** : formations certifiantes en ligne, gestion
d'établissement scolaire et orientation scolaire & académique — en partenariat avec des
universités et des centres de formation agréés.

Application web **full-stack** (base de données, authentification, rôles, formulaires et
traitements serveur), pensée pour les réalités de la RDC : interface légère, prix en
**CDF et USD**, notation sur 100 conformément aux usages de l'EPST, noms de provinces,
villes et cursus congolais, mention du **mobile money** dans les parcours de paiement.

---

## 1. Les trois modules

| Module | Ce qu'il permet | Pages principales |
| --- | --- | --- |
| 🎓 **Formations certifiantes** | Catalogue de formations, inscription, lecteur de leçons, progression, évaluation notée sur 100 et **certificat numérique vérifiable** | `/formations`, `/formations/[slug]`, `/formations/[slug]/apprendre`, `/certificats` |
| 🏫 **Gestion d'établissement** | Élèves et matricules, classes, enseignants, présences, notes, bulletins (moyennes pondérées, rang, mention, décision), frais scolaires et recouvrement | `/ecoles`, `/ecoles/inscription`, `/ecoles/tableau-de-bord/*` |
| 🧭 **Orientation scolaire & académique** | Questionnaire RIASEC adapté au contexte congolais, rapport de profil (6 dimensions), filières recommandées et bourses correspondantes | `/orientation`, `/orientation/test`, `/orientation/resultats/[code]` |

Modules transverses : annuaire de **partenaires** (universités, instituts, centres de
formation), **bourses d'études**, **espaces par rôle** (apprenant, direction, formateur,
partenaire, administration), **multilingue FR / EN / Lingala / Swahili**.

---

## 2. Stack technique

- **Next.js 15** (App Router, Server Components, Server Actions) — TypeScript strict
- **Tailwind CSS** (design system maison : `.card`, `.btn-primary`, `.badge`, `.table-base`…)
- **SQLite via better-sqlite3** — schéma SQL versionné dans `db/schema.sql` (25 tables)
- **Sessions par cookie httpOnly** + mots de passe hachés avec **bcrypt**
- **Zod** pour la validation des entrées, **qrcode** pour les certificats imprimables, **lucide-react** pour l'iconographie

> Historique : le schéma a d'abord été écrit pour Prisma/PostgreSQL
> (`docs/modele-de-donnees-reference.prisma`). L'environnement d'exécution ne permettant pas de
> télécharger les binaires Prisma, la couche d'accès a été réécrite en SQL direct
> (`src/lib/sqlite.ts`) **sans changer le modèle de données** ni le reste de l'application.
> La migration vers PostgreSQL reste documentée dans `src/lib/sqlite.ts` et dans le schéma de
> référence.

---

## 3. Démarrage rapide

```bash
npm install          # dépendances (better-sqlite3 fournit un binaire précompilé)
npm run db:setup     # crée data/smart-elimu.db et peuple le jeu de démonstration
npm run dev          # http://localhost:3000
```

### Scripts npm

| Script | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement (écoute sur `0.0.0.0:3000`) |
| `npm run build` / `npm start` | Build et exécution en production |
| `npm run typecheck` | Vérification TypeScript complète |
| `npm run db:setup` | Réinitialise puis peuple la base (jeu de démonstration complet) |
| `npm run db:seed` | Ajoute le jeu de démonstration en conservant les données existantes (`--keep`) |
| `npm run db:reset` | Supprime les fichiers SQLite puis reconstruit la base |
| `npm run db:shell` | Comptages par table ; `npm run db:shell -- "SELECT * FROM schools"` pour une requête |

Variables d'environnement : voir `.env` (`ELIMU_DATA_DIR`, `AUTH_SECRET`,
`NEXT_PUBLIC_APP_URL`). **Remplacer `AUTH_SECRET` en production.**

---

## 4. Comptes de démonstration

Mot de passe commun : **`elimu2026`** (également rappelé sur la page `/connexion`).

| Rôle | Compte | Espace |
| --- | --- | --- |
| Administration plateforme | `admin@smart-elimu.cd` | `/admin` |
| Apprenant | `apprenant@smart-elimu.cd` | `/tableau-de-bord` |
| Direction d'école (Kinshasa) | `direction@cs-espoir.cd` | `/ecoles/tableau-de-bord` |
| Direction d'école (Goma) | `direction@isj-goma.cd` | `/ecoles/tableau-de-bord` |
| Direction d'école (Lubumbashi) | `direction@ep-umoja.cd` | `/ecoles/tableau-de-bord` |
| Direction d'école (Bukavu) | `direction@cs-lareussite.cd` | `/ecoles/tableau-de-bord` |
| Formateur | `formateur@smart-elimu.cd` | `/formateur` |
| Partenaire (université) | `partenaire@unv-kinshasa.cd` | `/partenaires/espace` |

Le compte apprenant de démonstration a déjà terminé *Bureautique essentielle* (certificat
`SE-2026-…`), démarré *Éducation financière & mobile money* et un parcours d'orientation.
Le compte administration affiche les candidatures, les demandes de partenariat et les
certificats récents de toute la plateforme.

---

## 5. Jeu de données de démonstration

`npm run db:setup` génère un ensemble **déterministe** (générateur pseudo-aléatoire à graine
fixe) : 12 formations certifiantes (108 leçons, 60 questions d'évaluation), 15 partenaires,
36 filières, 8 bourses, 4 établissements scolaires (23 classes, 45 enseignants, 540 élèves,
notes, présences sur 30 jours, factures et paiements), des rapports d'orientation couvrant
les 6 profils, des candidatures et des demandes de partenariat.

> Toutes les données (établissements, personnes, filières, bourses) sont **fictives** et
> servent uniquement à la démonstration.

---

## 6. Structure du projet

```
db/schema.sql                 Schéma SQL complet (25 tables + index)
docs/                         Schéma Prisma de référence (piste PostgreSQL)
scripts/                      Seed, jeu de données et utilitaire de consultation
src/app/                      Pages (App Router) : modules, espaces, pages publiques
src/components/               Composants UI, formulaires, lecteur de quiz, questionnaire
src/lib/actions/              Server Actions (auth, formations, orientation, école, partenaires, admin)
src/lib/data/                 Requêtes de lecture (catalogue, partenaires, école, statistiques…)
src/lib/sqlite.ts             Accès à la base : requêtes, mapping camelCase, migrations additives
src/lib/auth.ts               Sessions, rôles, hachage, codes et empreintes de certificat
src/lib/orientation.ts        Questionnaire RIASEC congolais et calcul des profils
src/lib/i18n.ts, locale.ts    Traductions FR/EN/Lingala/Swahili et langue active (cookie)
```

### Conventions de base

Identifiants `TEXT` (type cuid), dates ISO en `TEXT`, booléens en `INTEGER 0/1`, objets JSON
dans les colonnes `*_json`, listes dans les colonnes `*_pipe` (`a|b|c`). La couche
`src/lib/sqlite.ts` convertit automatiquement entre `camelCase` (application) et
`snake_case` (SQL).

---

## 7. Fonctionnalités détaillées

### Formations certifiantes
- Catalogue filtrable (recherche, catégorie, niveau, langue) et fiche détaillée (programme,
  prérequis, débouchés, formateur, partenaire certificateur).
- Inscription en un clic, lecteur de leçons avec suivi de progression, quiz noté sur 100
  (seuil de réussite 70 %).
- **Certificat délivré automatiquement** lorsque toutes les leçons sont terminées et que
  l'évaluation est réussie, avec numéro `SE-AAAA-XXXX-XXXX`, empreinte HMAC et QR code.
- Vérification publique sur `/certificats` : un employeur saisit le code et obtient le
  titulaire, la formation, le score, la date et un statut valide/révoqué.

### Gestion d'établissement
- Création de l'espace de l'école (code du type `EP-KIN-0147`), fiche publique, capacité.
- Élèves : inscription avec matricule automatique, dossier individuel, statut, responsable légal.
- Classes : niveau, section, salle, capacité, titulaire, taux d'occupation.
- Enseignants : matière, qualification, contrat, affectation.
- Présences : feuille de présence quotidienne par classe (présent, absent, retard, excusé).
- Notes et bulletins : saisie par matière et période, coefficients, moyennes pondérées,
  classement de la classe, mention et décision automatiques, bulletin imprimable.
- Finances : facturation par classe, encaissements (mobile money, espèces, virement, banque),
  suivi des impayés et taux de recouvrement.

### Orientation
- Questionnaire de 20 situations (6 dimensions : Réaliste, Investigateur, Artistique,
  Social, Entreprenant, Conventionnel) formulé pour le contexte congolais.
- Rapport : profil dominant, scores par dimension, filières et métiers associés, programmes
  recommandés parmi les filières partenaires, bourses correspondantes, code de partage
  `OR-AAAA-XXXX-XXXX`.

---

## 8. Multilingue et devises

Interface disponible en **français, anglais, lingala et swahili** (sélecteur dans l'en-tête,
langue conservée par cookie). Les traductions partielles retombent automatiquement sur le
français. Les montants sont affichés en **CDF** avec conversion indicative en **USD**
(`USD_TO_CDF = 2800`).

---

## 9. Pistes d'évolution

- Branchement des paiements réels (M-Pesa, Orange Money, Airtel Money) et facturation.
- Hébergement vidéo pour les capsules et mise en cache hors ligne (PWA).
- Import Excel des effectifs et des notes pour les établissements existants.
- Migration PostgreSQL pour un déploiement multi-utilisateurs à grande échelle.
- Traduction complète des contenus en lingala et swahili avec les partenaires.

---

© 2026 SMART-ELIMU — Kinshasa, République démocratique du Congo.
