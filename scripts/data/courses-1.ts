import { l, atelier, video, type SeedCourse } from './types';

/** Catalogue de formations — partie 1 (6 formations). */
export const COURSES_PART_1: SeedCourse[] = [
  {
    title: 'Bureautique essentielle : Word, Excel et PowerPoint',
    summary:
      'Maîtrisez les trois logiciels indispensables en entreprise, en ONG et dans l’administration congolaise.',
    description:
      'Cette formation gratuite vous rend immédiatement opérationnel sur un ordinateur. Vous apprendrez à rédiger des documents professionnels, à construire des tableaux de calcul et des budgets, puis à présenter vos idées avec impact. Les exercices utilisent des cas réels congolais : lettre administrative, budget d’une coopérative, rapport d’activité d’une ONG.',
    category: 'Informatique & Numérique',
    level: 'DEBUTANT',
    language: 'fr',
    durationHours: 24,
    priceUsd: 0,
    coverEmoji: '💻',
    coverColor: '#1c60f0',
    instructorEmail: 'patrick.ilunga@smart-elimu.cd',
    rating: 4.8,
    learnersCount: 2840,
    modules: [
      {
        title: 'Module 1 — Rédiger avec Word',
        summary: 'De la lettre administrative au rapport de stage structuré.',
        lessons: [
          l(
            'Découvrir l’interface et les raccourcis vitaux',
            `Word est le logiciel de traitement de texte le plus utilisé en République démocratique du Congo, aussi bien dans les bureaux de l’administration publique que dans les ONG et les petites entreprises.

Avant de rédiger, repérez les trois zones de l’écran : le **ruban** (les commandes), la **zone de saisie** (la page blanche) et la **barre d’état** (le nombre de pages et de mots).

Les raccourcis qui vous feront gagner des heures chaque semaine :
- *Ctrl + S* : enregistrer — faites-le toutes les cinq minutes
- *Ctrl + C / Ctrl + V* : copier et coller
- *Ctrl + Z* : annuler la dernière action
- *Ctrl + B* : mettre en gras
- *Ctrl + Entrée* : insérer un saut de page

> Conseil SMART-ELIMU : enregistrez toujours votre fichier dès la première minute et nommez-le correctement (exemple : « Rapport_ONG_Janvier_2026.docx »).`,
          ),
          l(
            'Structurer un document professionnel',
            `Un document professionnel se reconnaît à sa structure. Utilisez les **styles de titres** (Titre 1, Titre 2) plutôt que de grossir le texte manuellement : vous pourrez ensuite générer automatiquement une table des matières.

Structure attendue d’un rapport :
1. **Page de garde** : titre, auteur, institution, date
2. **Sommaire** automatique
3. **Introduction** : contexte et objectifs
4. **Développement** organisé en sections numérotées
5. **Conclusion et recommandations**

Pour insérer un tableau de données dans un document, passez par Insertion → Tableau. Un tableau bien fait vaut mieux que trois paragraphes confus.`,
          ),
          atelier(
            'Atelier : rédiger une lettre administrative',
            `**Objectif** : produire une lettre de demande de partenariat prête à être remise à une direction provinciale.

Étapes :
1. Ouvrez un nouveau document et enregistrez-le sous le nom « Lettre_Partenariat_NOM.docx »
2. En haut à gauche, saisissez vos coordonnées, puis la date
3. À droite, indiquez le destinataire : « À Monsieur le Directeur provincial de… »
4. Rédigez les trois paragraphes : qui vous êtes, ce que vous demandez, ce que vous proposez en retour
5. Terminez par la formule de politesse et votre signature

**Critères de réussite** : la lettre tient sur une page, la date et le destinataire sont présents, et aucune faute d’orthographe n’apparaît après relecture.`,
            30,
          ),
        ],
      },
      {
        title: 'Module 2 — Calculer avec Excel',
        summary: 'Formules, budgets, tableaux de suivi et graphiques.',
        lessons: [
          l(
            'Comprendre la logique des cellules et des formules',
            `Une feuille Excel est un quadrillage de cellules repérées par une lettre de colonne et un numéro de ligne : A1, B4, C12.

Toute formule **commence par le signe égal** :
- \`=A1+B1\` additionne deux cellules
- \`=SOMME(B2:B20)\` additionne toute une colonne
- \`=MOYENNE(C2:C30)\` calcule la moyenne d’une classe
- \`=B2*10%\` calcule une commission de 10 %
- \`=SI(D2>50;"Réussi";"Échec")\` affiche une décision automatique

> Les formules se recopient : tirez le petit carré en bas à droite de la cellule pour appliquer le même calcul à toute une colonne.`,
          ),
          l(
            'Construire un budget clair et défendable',
            `Un budget comporte toujours trois blocs : les **recettes** (ce qui rentre), les **dépenses** (ce qui sort) et le **solde**.

Modèle minimal pour une coopérative :
1. Colonne A : poste (Ciment, Transport, Main-d’œuvre…)
2. Colonne B : quantité
3. Colonne C : prix unitaire
4. Colonne D : \`=B2*C2\`
5. Ligne de total : \`=SOMME(D2:D15)\`

Ajoutez une seconde feuille pour le suivi des dépenses réelles, puis comparez avec le prévisionnel. C’est exactement ce que demandent les bailleurs internationaux.`,
          ),
          atelier(
            'Atelier : suivi de paiement des frais scolaires',
            `**Objectif** : créer un tableau qui indique automatiquement qui a payé et qui reste en défaut.

1. Colonnes : Matricule, Nom, Montant attendu, Montant payé, Solde, Statut
2. Colonne Solde : \`=C2-D2\`
3. Colonne Statut : \`=SI(E2<=0;"Payé";SI(D2=0;"Impayé";"Partiel"))\`
4. Mettez en rouge toutes les cellules dont le solde est positif grâce à la mise en forme conditionnelle
5. Ajoutez une ligne de total et un graphique en secteurs

**Livrable** : un fichier exploitable par la direction de l’école le jour de la clôture.`,
            35,
          ),
        ],
      },
      {
        title: 'Module 3 — Présenter avec PowerPoint',
        summary: 'Des diapositives sobres qui convainquent un jury ou un bailleur.',
        lessons: [
          l(
            'Les règles d’or d’une bonne présentation',
            `Une bonne présentation ne se lit pas : elle se regarde et s’écoute.

Règles d’or :
- **Une idée par diapositive**
- Maximum 6 lignes de 6 mots
- Chiffres clés en grand, détails à l’oral
- Police lisible en salle : 28 points minimum pour le corps de texte
- Contraste élevé : texte foncé sur fond clair (les salles sont souvent mal éclairées)

Évitez les animations excessives : elles distraient et consomment du temps de préparation.`,
          ),
          video(
            'Capsule vidéo : la règle du 10-20-30',
            `Dans cette capsule, nous appliquons la règle du 10-20-30 popularisée par Guy Kawasaki : **10 diapositives**, **20 minutes**, **police de 30 points minimum**.

Nous construisons ensemble une présentation de projet en 10 diapositives :
1. Titre et porteur du projet
2. Le problème
3. La solution proposée
4. Le marché et les bénéficiaires
5. Le modèle économique
6. La concurrence
7. L’équipe
8. Le plan d’action
9. Les besoins de financement
10. L’appel à l’action

**Exercice** : réduisez votre propre projet à ces 10 diapositives.`,
            14,
          ),
          atelier(
            'Atelier final : présentation de votre projet',
            `**Objectif** : produire 8 diapositives sur un projet réel (association, coopérative, petite entreprise).

Contraintes :
- Diapositive 1 : titre + votre nom
- Diapositive 2 : le problème en une phrase et une image
- Diapositives 3 à 6 : solution, bénéficiaires, chiffres clés, plan d’action
- Diapositive 7 : ce que vous demandez précisément
- Diapositive 8 : remerciements et contacts

Publiez ensuite le fichier au format PDF pour éviter les problèmes de polices sur l’ordinateur du jury.`,
            40,
          ),
        ],
      },
    ],
    quiz: {
      title: 'Évaluation finale — Bureautique essentielle',
      description: '10 questions pour valider vos acquis en Word, Excel et PowerPoint.',
      questions: [
        {
          prompt: 'Quelle formule affiche « Réussi » si la moyenne est supérieure à 50 ?',
          choices: ['=SI(C2>50;"Réussi";"Échec")', '=MOYENNE(C2>50)', '=SI(C2>50,Réussi)', '=ALORS(C2>50)'],
          correctIndex: 0,
          explanation: 'En français, la fonction conditionnelle s’écrit =SI(test; valeur si vrai; valeur si faux).',
        },
        {
          prompt: 'Pourquoi utiliser les styles de titres plutôt que le gras manuel ?',
          choices: [
            'Parce que c’est plus joli',
            'Pour générer automatiquement une table des matières et une navigation cohérente',
            'Pour consommer moins de mémoire',
            'Parce que le gras n’existe pas dans Word',
          ],
          correctIndex: 1,
          explanation: 'Les styles permettent de générer un sommaire automatique et de garder une hiérarchie cohérente.',
        },
        {
          prompt: 'Quel raccourci enregistre un document ?',
          choices: ['Ctrl + P', 'Ctrl + S', 'Ctrl + Z', 'Ctrl + E'],
          correctIndex: 1,
          explanation: 'Ctrl + S (Save) enregistre le document.',
        },
        {
          prompt: 'Dans un budget, la ligne de total utilise généralement :',
          choices: ['=MAX()', '=SOMME()', '=NB()', '=SI()'],
          correctIndex: 1,
          explanation: 'La fonction SOMME additionne une plage de cellules.',
        },
        {
          prompt: 'Combien d’idées principales par diapositive ?',
          choices: ['Trois', 'Une', 'Cinq', 'Autant que possible'],
          correctIndex: 1,
          explanation: 'Une idée par diapositive : le public retient mieux et l’orateur garde son fil conducteur.',
        },
      ],
    },
  },

  {
    title: 'Initiation à la programmation web',
    summary: 'HTML, CSS et JavaScript : construisez votre première application web en partant de zéro.',
    description:
      'Vous apprendrez à créer des pages web accessibles même avec une connexion lente, à les mettre en ligne et à manipuler des données. Les projets s’inspirent du terrain congolais : site vitrine d’une PME, formulaire d’inscription d’élèves, tableau de bord d’une association.',
    category: 'Informatique & Numérique',
    level: 'DEBUTANT',
    language: 'fr',
    durationHours: 40,
    priceUsd: 45,
    coverEmoji: '🌐',
    coverColor: '#0d2a6b',
    partnerSlug: 'unikin-numerique',
    instructorEmail: 'patrick.ilunga@smart-elimu.cd',
    rating: 4.9,
    learnersCount: 1625,
    modules: [
      {
        title: 'Module 1 — Les fondations du web',
        summary: 'Comprendre Internet, écrire du HTML sémantique.',
        lessons: [
          l(
            'Comment fonctionne réellement un site web',
            `Un site web repose sur deux ordinateurs qui discutent : le **client** (votre navigateur) et le **serveur** (la machine qui héberge le site).

Le parcours d’une page :
1. Vous tapez une adresse (URL)
2. Le navigateur demande la page au serveur via le protocole **HTTP**
3. Le serveur renvoie du **HTML** (structure), du **CSS** (style) et du **JavaScript** (comportement)
4. Le navigateur assemble le tout et affiche la page

> En RDC, la qualité de la connexion varie fortement : un site bien conçu pèse moins de 2 Mo et reste lisible même en 3G.`,
          ),
          l(
            'HTML : la structure et la sémantique',
            `Le HTML décrit le sens du contenu grâce à des balises :

\`\`\`
<h1>Titre principal</h1>
<p>Un paragraphe de texte.</p>
<ul><li>Un élément de liste</li></ul>
<a href="https://exemple.cd">Un lien</a>
<img src="photo.jpg" alt="Description de l’image">
\`\`\`

Les balises **sémantiques** (\`header\`, \`nav\`, \`main\`, \`section\`, \`footer\`) indiquent aux moteurs de recherche et aux lecteurs d’écran la fonction de chaque bloc. Elles améliorent le référencement et l’accessibilité.`,
          ),
          atelier(
            'Atelier : votre première page',
            `Créez un fichier \`index.html\` avec :
- un titre \`h1\` avec le nom de votre projet
- un paragraphe de présentation
- une liste de trois services proposés
- une image avec un texte alternatif
- un lien vers votre adresse e-mail (\`mailto:\`)

**Vérification** : ouvrez le fichier dans le navigateur, puis testez la page en réduisant la largeur de la fenêtre. Le contenu doit rester lisible.`,
            30,
          ),
        ],
      },
      {
        title: 'Module 2 — Habiller avec CSS',
        summary: 'Mise en page moderne, couleurs et adaptation mobile.',
        lessons: [
          l(
            'Sélecteurs, couleurs et typographie',
            `Le CSS s’écrit dans un fichier \`style.css\` relié au HTML :

\`\`\`
body { font-family: system-ui; }
.titre { color: #1c60f0; font-size: 2rem; }
#entete { background: #0d2a6b; padding: 1rem; }
\`\`\`

Trois façons de cibler un élément : par balise (\`p\`), par classe (\`.titre\`) ou par identifiant (\`#entete\`). Privilégiez les **classes**, réutilisables.

Choisissez deux couleurs principales et une couleur d’accent, puis tenez-vous-y sur tout le site : c’est ce qui donne une impression de sérieux.`,
          ),
          l(
            'Flexbox et grilles : la mise en page sans douleur',
            `Avec **Flexbox**, alignez des éléments sur une ligne ou une colonne :

\`\`\`
.cartes { display: flex; gap: 1rem; flex-wrap: wrap; }
.carte { flex: 1 1 280px; }
\`\`\`

Avec **CSS Grid**, créez une vraie grille :

\`\`\`
.grille { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
\`\`\`

Pour le mobile, utilisez les **media queries** :
\`\`\`
@media (max-width: 768px) { .grille { grid-template-columns: 1fr; } }
\`\`\``,
          ),
          atelier(
            'Atelier : mise en page responsive',
            `Transformez la page de l’atelier précédent en une page responsive :
1. Créez un en-tête avec logo et menu horizontal
2. Disposez trois « cartes de service » côte à côte sur ordinateur, empilées sur téléphone
3. Ajoutez un pied de page avec vos contacts
4. Testez avec les outils de développement du navigateur (F12 → mode appareil)

**Critère de réussite** : aucun défilement horizontal sur un écran de 360 pixels de large.`,
            35,
          ),
        ],
      },
      {
        title: 'Module 3 — Dynamiser avec JavaScript',
        summary: 'Interactions, formulaires et consommation d’API.',
        lessons: [
          l(
            'Variables, fonctions et événements',
            `JavaScript rend la page vivante :

\`\`\`
const bouton = document.querySelector('#valider');
bouton.addEventListener('click', () => {
  const nom = document.querySelector('#nom').value;
  alert('Merci ' + nom + ' !');
});
\`\`\`

- \`const\` déclare une valeur qui ne change pas, \`let\` une valeur modifiable
- Une **fonction fléchée** \`() => {}\` regroupe des instructions
- Un **événement** (\`click\`, \`submit\`) déclenche le code au bon moment`,
          ),
          l(
            'Valider et envoyer les données d’un formulaire',
            `Un formulaire mal validé remplit votre base de données de fautes de frappe. Validez toujours côté client **et** côté serveur.

\`\`\`
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.querySelector('#email').value;
  if (!email.includes('@')) {
    document.querySelector('#erreur').textContent = 'Adresse e-mail invalide';
    return;
  }
  fetch('/api/inscription', { method: 'POST', body: JSON.stringify({ email }) });
});
\`\`\`

\`fetch\` permet d’envoyer les données au serveur sans recharger la page — la base d’une application moderne.`,
          ),
          atelier(
            'Atelier final : formulaire d’inscription d’élèves',
            `Construisez un formulaire complet (nom, classe, téléphone du parent) avec :
1. Validation de chaque champ avant envoi
2. Message de confirmation à l’écran
3. Sauvegarde des saisies dans le stockage local du navigateur (\`localStorage\`) afin de ne rien perdre en cas de coupure
4. Bouton d’export au format CSV

**Livrable** : une page autonome, utilisable hors connexion par un secrétariat d’école.`,
            45,
          ),
        ],
      },
    ],
    quiz: {
      title: 'Évaluation finale — Programmation web',
      description: 'Vérifiez votre maîtrise du HTML, du CSS et du JavaScript.',
      questions: [
        {
          prompt: 'Quelle balise crée un titre principal unique par page ?',
          choices: ['<h6>', '<title>', '<h1>', '<head>'],
          correctIndex: 2,
          explanation: '<h1> est le titre principal ; <title> définit le titre de l’onglet.',
        },
        {
          prompt: 'Quelle propriété CSS empile des éléments et gère l’espacement ?',
          choices: ['display: flex', 'text-align', 'position: absolute', 'font-weight'],
          correctIndex: 0,
          explanation: 'Flexbox (display: flex) aligne et répartit les éléments sur un axe.',
        },
        {
          prompt: 'Que fait `event.preventDefault()` dans un formulaire ?',
          choices: [
            'Il efface les champs',
            'Il empêche le rechargement de la page',
            'Il envoie les données',
            'Il valide les champs obligatoires',
          ],
          correctIndex: 1,
          explanation: 'Il bloque le comportement par défaut (rechargement) pour traiter les données en JavaScript.',
        },
        {
          prompt: 'Quelle bonne pratique améliore le référencement et l’accessibilité ?',
          choices: [
            'Utiliser des <div> partout',
            'Utiliser les balises sémantiques (header, nav, main, footer)',
            'Supprimer les attributs alt',
            'Charger de grandes images',
          ],
          correctIndex: 1,
          explanation: 'Le HTML sémantique décrit la fonction de chaque bloc pour les moteurs et les lecteurs d’écran.',
        },
        {
          prompt: 'Pourquoi valider les données aussi côté serveur ?',
          choices: [
            'Parce que JavaScript est lent',
            'Parce que la validation cliente peut être contournée',
            'Pour économiser de la bande passante',
            'Ce n’est pas nécessaire',
          ],
          correctIndex: 1,
          explanation: 'Un utilisateur malveillant peut désactiver le JavaScript : la validation serveur est la seule garantie.',
        },
      ],
    },
  },

  {
    title: 'Marketing digital & vente en ligne en RDC',
    summary: 'Vendre sur Facebook, WhatsApp et TikTok, construire une marque et mesurer ses résultats.',
    description:
      'La majorité des acheteurs congolais découvrent les produits sur les réseaux sociaux. Cette formation vous apprend à créer une page professionnelle, à produire des visuels avec un simple téléphone, à structurer un catalogue WhatsApp Business et à calculer votre rentabilité réelle, frais de transport inclus.',
    category: 'Gestion & Entrepreneuriat',
    level: 'INTERMEDIAIRE',
    language: 'fr',
    durationHours: 30,
    priceUsd: 35,
    coverEmoji: '📣',
    coverColor: '#f7a207',
    partnerSlug: 'cfp-umoja-lubumbashi',
    instructorEmail: 'grace.mbuyi@smart-elimu.cd',
    rating: 4.7,
    learnersCount: 2110,
    modules: [
      {
        title: 'Module 1 — Comprendre son client congolais',
        summary: 'Segments, pouvoir d’achat et parcours d’achat réel.',
        lessons: [
          l(
            'Connaître son marché avant de vendre',
            `Avant de publier quoi que ce soit, répondez à quatre questions :
1. **Qui** achète ? (âge, ville, revenu, profession)
2. **Quoi** achète-t-il exactement ? (produit ou service)
3. **Pourquoi** vous plutôt qu’un autre ?
4. **Combien** est-il prêt à payer ?

À Kinshasa, Goma ou Lubumbashi, le client compare systématiquement trois critères : le prix, la confiance et la rapidité de livraison. Une boutique en ligne sans numéro de téléphone visible perd la majorité de ses visiteurs.`,
          ),
          l(
            'Le parcours d’achat en cinq étapes',
            `1. **Découverte** : publication, recommandation, statut WhatsApp
2. **Intérêt** : le client consulte la page ou écrit en message privé
3. **Désir** : photos réelles, témoignages, disponibilité
4. **Action** : commande et paiement (mobile money le plus souvent)
5. **Fidélisation** : le client recommande et rachète

Votre travail consiste à rendre chaque étape plus simple. Un prospect qui doit poser trois questions avant d’acheter est un prospect perdu.`,
          ),
          atelier(
            'Atelier : fiche persona de votre client idéal',
            `Rédigez la fiche de votre client type :
- Prénom fictif, âge, quartier, profession
- Revenu mensuel approximatif et budget disponible
- Trois problèmes concrets qu’il rencontre
- Où il passe du temps en ligne et à quelles heures
- Trois objections qu’il vous fera

**Livrable** : une page A4 qui guidera toutes vos publications pendant six mois.`,
            25,
          ),
        ],
      },
      {
        title: 'Module 2 — Produire du contenu qui vend',
        summary: 'Photos au téléphone, textes convaincants, calendrier de publication.',
        lessons: [
          video(
            'Capsule vidéo : photo produit réussie avec un téléphone',
            `Nous photographions un sac de riz, une paire de chaussures et un plat cuisiné avec un simple téléphone.

Les cinq réglages :
1. Lumière naturelle, jamais le flash frontal
2. Fond uni (tissu propre, mur clair)
3. Trois angles : face, détail, en situation d’usage
4. Mise au point en appuyant sur l’écran avant de déclencher
5. Nettoyage : recadrage, luminosité, contraste seulement

**Exercice** : photographiez trois produits et demandez à cinq personnes lequel donne le plus envie d’acheter.`,
            16,
          ),
          l(
            'Écrire un texte de vente en cinq lignes',
            `Structure éprouvée :
1. **Accroche** : une douleur ou un désir (« Marre des coupures de courant ? »)
2. **Solution** : votre produit en une phrase
3. **Preuve** : chiffre, témoignage, garantie
4. **Offre** : prix, livraison, délai
5. **Appel à l’action** : « Écrivez-nous sur WhatsApp au 000000000 »

Terminez toujours par une action claire. Un texte sans appel à l’action est une vitrine sans porte.`,
          ),
          atelier(
            'Atelier : construire un calendrier de 30 jours',
            `Préparez un tableau de 30 lignes avec :
- Date
- Type de publication (produit, conseil, témoignage, coulisses)
- Visuel prévu
- Texte rédigé
- Mot-clé et lieu à mentionner
- Résultat observé (portée, messages reçus)

**Règle** : une publication utile pour trois publications commerciales. La générosité construit la confiance plus vite que la publicité.`,
            30,
          ),
        ],
      },
      {
        title: 'Module 3 — Convertir et mesurer',
        summary: 'WhatsApp Business, paiement mobile, indicateurs de rentabilité.',
        lessons: [
          l(
            'Structurer WhatsApp Business comme un magasin',
            `WhatsApp Business est gratuit et remplace un site pour de nombreux vendeurs congolais :
- **Catalogue** : ajoutez chaque produit avec photo, prix et lien
- **Réponses rapides** : créez des raccourcis (\`/prix\`, \`/livraison\`, \`/adresse\`)
- **Messages d’accueil et d’absence** : plus aucun client oublié la nuit
- **Étiquettes** : Nouveau, Commande en cours, Payé, Livré

Une fiche produit doit toujours contenir : photo réelle, prix exact, lieu de retrait, délai de livraison et conditions de retour.`,
          ),
          l(
            'Calculer sa marge réelle',
            `Beaucoup de vendeurs se croient rentables à tort. Calculez :

\`Marge = Prix de vente − (Achat + Transport + Emballage + Frais mobile money + Publicité)\`

Exemple : un article vendu 25 $, acheté 15 $, transporté 2 $, emballé 1 $, frais mobile money 0,5 $, publicité 2 $ → marge réelle **4,5 $**, soit 18 % du prix. Augmentez le prix, négociez l’achat ou regroupez les livraisons.`,
          ),
          atelier(
            'Atelier final : lancer une campagne de 7 jours',
            `1. Créez ou optimisez votre page/statut professionnel
2. Publiez la même offre sous trois formats différents
3. Répondez à chaque message en moins de 15 minutes pendant 7 jours
4. Notez quotidiennement : messages reçus, commandes, chiffre d’affaires
5. Calculez à la fin : coût de la campagne, marge totale, taux de conversion

**Livrable** : un rapport d’une page avec les trois chiffres clés et la décision pour la semaine suivante.`,
            40,
          ),
        ],
      },
    ],
    quiz: {
      title: 'Évaluation finale — Marketing digital',
      description: 'Validez votre maîtrise de la vente en ligne.',
      questions: [
        {
          prompt: 'Combien de questions un client doit-il poser avant d’acheter idéalement ?',
          choices: ['Le moins possible', 'Trois au minimum', 'Cinq', 'Aucune importance'],
          correctIndex: 0,
          explanation: 'Chaque question supplémentaire augmente le risque d’abandon : l’information doit être visible d’emblée.',
        },
        {
          prompt: 'Quelle structure de texte de vente est recommandée ?',
          choices: [
            'Accroche, solution, preuve, offre, appel à l’action',
            'Prix, prix, prix',
            'Long paragraphe sans saut de ligne',
            'Historique de l’entreprise uniquement',
          ],
          correctIndex: 0,
          explanation: 'Cette structure conduit le lecteur de l’attention à l’action.',
        },
        {
          prompt: 'Dans le calcul de marge, que faut-il inclure ?',
          choices: [
            'Seulement le prix d’achat',
            'Achat, transport, emballage, frais de paiement et publicité',
            'Uniquement le transport',
            'Rien, le prix de vente suffit',
          ],
          correctIndex: 1,
          explanation: 'Tous ces coûts réduisent la marge réelle et doivent être comptés.',
        },
        {
          prompt: 'À quoi servent les étiquettes WhatsApp Business ?',
          choices: [
            'À supprimer les clients',
            'À classer les conversations par étape de vente',
            'À changer la couleur de l’application',
            'À envoyer des publicités payantes',
          ],
          correctIndex: 1,
          explanation: 'Les étiquettes permettent de suivre chaque prospect dans son parcours d’achat.',
        },
        {
          prompt: 'Quel indicateur mesurer en priorité après une campagne ?',
          choices: [
            'Le nombre d’abonnés seulement',
            'Le taux de conversion et la marge générée',
            'Le nombre de « j’aime »',
            'La couleur des visuels',
          ],
          correctIndex: 1,
          explanation: 'L’audience sans conversion ne paie pas les factures : conversion et marge sont les indicateurs décisifs.',
        },
      ],
    },
  },

  {
    title: 'Comptabilité générale OHADA appliquée',
    summary: 'Tenir une comptabilité conforme au référentiel OHADA, du journal au bilan.',
    description:
      'La RDC applique le référentiel comptable OHADA (SYSCOHADA révisé). Cette formation vous conduit du classement des pièces justificatives à l’établissement du bilan et du compte de résultat, avec des exercices tirés d’une quincaillerie, d’une pharmacie et d’une ONG locales.',
    category: 'Finance & Comptabilité',
    level: 'INTERMEDIAIRE',
    language: 'fr',
    durationHours: 45,
    priceUsd: 50,
    coverEmoji: '📊',
    coverColor: '#0f766e',
    partnerSlug: 'isc-kinshasa',
    instructorEmail: 'grace.mbuyi@smart-elimu.cd',
    rating: 4.8,
    learnersCount: 1340,
    modules: [
      {
        title: 'Module 1 — Les principes et le plan comptable',
        summary: 'Partie double, plan SYSCOHADA, pièces justificatives.',
        lessons: [
          l(
            'Le principe de la partie double',
            `Toute opération comptable enregistre simultanément un **débit** et un **crédit** d’égale valeur.

Exemple : achat de marchandises 500 000 CDF payées en espèces
- Débit : compte 601 « Achats de marchandises » … 500 000
- Crédit : compte 571 « Caisse » … 500 000

Cette règle garantit que le total des débits égale toujours le total des crédits. Si l’équilibre est rompu, une erreur s’est glissée dans la saisie.`,
          ),
          l(
            'Les grandes classes du plan SYSCOHADA',
            `- **Classe 1** : ressources durables (capital, emprunts)
- **Classe 2** : actif immobilisé (terrains, véhicules, matériel)
- **Classe 3** : stocks
- **Classe 4** : tiers (clients, fournisseurs, personnel)
- **Classe 5** : trésorerie (banque, caisse, mobile money)
- **Classe 6** : charges (achats, salaires, loyers)
- **Classe 7** : produits (ventes, subventions)
- **Classe 8** : comptes spéciaux

Un compte se lit toujours sous la forme **classe → compte principal → sous-compte** (exemple : 411 clients).`,
          ),
          atelier(
            'Atelier : classer 15 pièces justificatives',
            `Vous recevez 15 pièces (factures, reçus, bordereaux bancaires, bulletins de paie). Pour chacune :
1. Identifiez la nature de l’opération
2. Déterminez le compte à débiter et le compte à créditer
3. Rédigez l’écriture au journal

**Contrôle** : total des débits = total des crédits, et chaque pièce est justifiée par une référence.`,
            35,
          ),
        ],
      },
      {
        title: 'Module 2 — Journal, grand livre et balance',
        summary: 'De l’écriture quotidienne aux états de synthèse.',
        lessons: [
          l(
            'Tenir le journal et le grand livre',
            `Le **journal** enregistre les opérations jour après jour, dans l’ordre chronologique. Le **grand livre** regroupe les mêmes écritures par compte.

Méthode pratique :
1. Numérotez les pièces et classez-les par date
2. Saisissez l’écriture au journal (date, comptes, libellé, montants)
3. Reportez au grand livre
4. Vérifiez l’équilibre chaque semaine, pas chaque trimestre

> Un logiciel de tableur suffit pour une petite structure : deux feuilles « Journal » et « Grand livre », avec une somme de contrôle en bas de page.`,
          ),
          l(
            'Lire une balance avant clôture',
            `La balance présente tous les comptes avec leurs totaux débit et crédit. Elle permet de détecter immédiatement :
- des **comptes anormalement élevés** (caisse créditrice, impossible)
- des **comptes clients dormants** de plus de 90 jours
- des charges sans produit correspondant

À l’approche de la clôture, procédez aux travaux d’inventaire : amortissements, provisions, régularisations de charges et de produits.`,
          ),
          atelier(
            'Atelier : construire une balance équilibrée',
            `À partir de 20 écritures fournies :
1. Saisissez le journal dans un tableur
2. Extrayez automatiquement les totaux par compte
3. Produisez la balance générale
4. Identifiez les anomalies et proposez les corrections

**Livrable** : une balance dont le total débit égale le total crédit, avec la liste des régularisations à effectuer.`,
            40,
          ),
        ],
      },
      {
        title: 'Module 3 — États financiers et fiscalité',
        summary: 'Bilan, compte de résultat, DGI et déclarations.',
        lessons: [
          l(
            'Comprendre le bilan et le compte de résultat',
            `Le **bilan** photographie le patrimoine à une date donnée : ce que l’entreprise possède (actif) et ce qu’elle doit (passif). La relation fondamentale reste : **Actif = Passif**.

Le **compte de résultat** explique la performance de l’exercice : produits − charges = résultat.

Trois indicateurs à surveiller :
1. **Marge brute** : ventes − coût d’achat des marchandises vendues
2. **Résultat d’exploitation** : ce que l’activité courante génère réellement
3. **Trésorerie** : le solde en banque et en caisse, essentiel même en cas de bénéfice comptable`,
          ),
          l(
            'Les obligations déclaratives en RDC',
            `Toute entreprise formelle doit tenir une comptabilité régulière et déposer ses déclarations auprès de la **Direction générale des impôts (DGI)**.

À retenir :
- La **TVA** s’applique au taux de 16 % sur la majorité des biens et services
- L’**impôt sur les bénéfices et profits (IBP)** frappe le résultat fiscal
- Les **retenues** sur salaires et sur loyers doivent être versées dans les délais
- Conservez toutes les pièces pendant **10 ans**

> Un calendrier fiscal affiché au mur évite 90 % des pénalités de retard.`,
          ),
          atelier(
            'Atelier final : produire les états financiers d’un exercice',
            `À partir d’une balance après inventaire :
1. Établissez le compte de résultat
2. Établissez le bilan
3. Calculez trois ratios : marge nette, rentabilité des capitaux propres, autonomie financière
4. Rédigez une note de trois paragraphes expliquant la situation à un dirigeant non comptable

**Livrable** : les deux états financiers cohérents et la note de synthèse.`,
            50,
          ),
        ],
      },
    ],
    quiz: {
      title: 'Évaluation finale — Comptabilité OHADA',
      description: 'Contrôlez vos acquis sur le journal, la balance et les états financiers.',
      questions: [
        {
          prompt: 'Dans un achat de marchandises payé en espèces, quel compte est crédité ?',
          choices: ['601 Achats', '571 Caisse', '411 Clients', '701 Ventes'],
          correctIndex: 1,
          explanation: 'La caisse diminue : elle est créditée, tandis que le compte d’achat est débité.',
        },
        {
          prompt: 'Quelle égalité fondamentale structure le bilan ?',
          choices: ['Actif = Passif', 'Produits = Charges', 'Débit = Résultat', 'Caisse = Banque'],
          correctIndex: 0,
          explanation: 'Le total de l’actif est toujours égal au total du passif.',
        },
        {
          prompt: 'Quel est le taux de TVA appliqué en RDC ?',
          choices: ['10 %', '16 %', '18 %', '20 %'],
          correctIndex: 1,
          explanation: 'La TVA est de 16 % en République démocratique du Congo.',
        },
        {
          prompt: 'Combien de temps faut-il conserver les pièces justificatives ?',
          choices: ['1 an', '3 ans', '10 ans', 'Elles peuvent être jetées'],
          correctIndex: 2,
          explanation: 'La conservation légale des pièces comptables est de 10 ans.',
        },
        {
          prompt: 'Une entreprise bénéficiaire peut-elle manquer de trésorerie ?',
          choices: [
            'Non, c’est impossible',
            'Oui, si ses clients ne paient pas à temps',
            'Seulement si elle fraude',
            'Uniquement en cas de faillite',
          ],
          correctIndex: 1,
          explanation: 'Le résultat comptable n’est pas de l’argent encaissé : les délais de paiement clients créent des tensions de trésorerie.',
        },
      ],
    },
  },

  {
    title: 'Entrepreneuriat & gestion d’une PME en RDC',
    summary: 'De l’idée au modèle économique rentable : créer et structurer son entreprise.',
    description:
      'Formalités de création (Guichet unique), étude de marché de terrain, modèle économique, gestion des équipes et financement : cette formation vous donne une méthode complète pour lancer une activité formelle et durable en République démocratique du Congo.',
    category: 'Gestion & Entrepreneuriat',
    level: 'DEBUTANT',
    language: 'fr',
    durationHours: 28,
    priceUsd: 30,
    coverEmoji: '🚀',
    coverColor: '#db7b02',
    partnerSlug: 'cfp-umoja-lubumbashi',
    instructorEmail: 'grace.mbuyi@smart-elimu.cd',
    rating: 4.6,
    learnersCount: 1875,
    modules: [
      {
        title: 'Module 1 — De l’idée au projet',
        summary: 'Tester une idée avec peu de moyens.',
        lessons: [
          l(
            'Trouver une idée qui résout un vrai problème',
            `Une bonne idée d’entreprise ne commence jamais par « je veux vendre… » mais par « les gens perdent du temps, de l’argent ou de la santé parce que… ».

Trois gisements d’opportunités en RDC :
1. **Réduire les intermédiaires** dans la distribution (agriculture, pièces détachées)
2. **Remplacer l’attente** (livraison, réparation, formalités administratives)
3. **Améliorer la qualité** dans un marché où tout est vendu au même prix

Testez votre idée auprès de 20 clients potentiels avant d’investir un seul dollar.`,
          ),
          l(
            'L’étude de marché de terrain',
            `Vous n’avez pas besoin d’un cabinet d’études. Interrogez directement :
- 20 clients potentiels : que paient-ils aujourd’hui, où, combien, et qu’est-ce qui les ennuie ?
- 5 concurrents : prix, qualité, délais, ce qu’ils font mal
- 3 fournisseurs : prix de gros, quantités minimales, délais

Notez les réponses dans un cahier. Un entretien de quinze minutes vous apprend plus qu’une semaine de lectures.`,
          ),
          atelier(
            'Atelier : 20 entretiens en 7 jours',
            `1. Rédigez cinq questions ouvertes (jamais « achèteriez-vous ? »)
2. Interrogez 20 personnes de votre cible, dans trois lieux différents
3. Consignez chaque réponse dans un tableau
4. Identifiez les trois phrases qui reviennent le plus souvent

**Livrable** : une synthèse d’une page avec le problème principal confirmé, le prix acceptable et le canal de vente privilégié.`,
            45,
          ),
        ],
      },
      {
        title: 'Module 2 — Structurer et formaliser',
        summary: 'Guichet unique, obligations sociales, organisation interne.',
        lessons: [
          l(
            'Les formalités de création en RDC',
            `La création d’entreprise passe par le **Guichet unique de création d’entreprise (GUCE)**, qui regroupe plusieurs formalités en un seul lieu.

Étapes habituelles :
1. Réservation du nom (greffe)
2. Rédaction des statuts et dépôt du capital social
3. Immatriculation au registre du commerce (RCCM)
4. Obtention de l’identifiant national et du numéro impôt
5. Affiliation à la **CNSS** pour la sécurité sociale
6. Autorisations sectorielles éventuelles (santé, mines, transport)

Avantages de la formalisation : accès aux marchés publics et aux banques, protection juridique, possibilité de facturer la TVA.`,
          ),
          l(
            'Organiser pour ne pas dépendre de soi-même',
            `Une entreprise qui repose entièrement sur son fondateur ne grandit pas. Dès la première année :

- Écrivez les **procédures** (ouverture de caisse, commande, livraison)
- Séparez la caisse personnelle de la caisse de l’entreprise
- Fixez des **indicateurs hebdomadaires** : ventes, dépenses, clients nouveaux
- Recrutez en fonction des tâches, pas des relations familiales
- Payez les charges sociales : un employé déclaré reste fidèle plus longtemps`,
          ),
          atelier(
            'Atelier : votre tableau de bord hebdomadaire',
            `Construisez une feuille de suivi contenant :
- Chiffre d’affaires de la semaine par produit
- Dépenses par poste
- Marge brute en pourcentage
- Nombre de nouveaux clients et de clients revenus
- Trois décisions prises pour la semaine suivante

**Règle d’or** : un tableau de bord qui ne se remplit pas en moins de dix minutes finira abandonné.`,
            30,
          ),
        ],
      },
      {
        title: 'Module 3 — Financer et grandir',
        summary: 'Autofinancement, microfinance, subventions et investisseurs.',
        lessons: [
          l(
            'Choisir son financement sans se mettre en danger',
            `Du plus sûr au plus exigeant :
1. **Autofinancement** : réinvestir les bénéfices, le moins risqué
2. **Famille et tontines** : informel mais fréquent ; formalisez toujours par écrit
3. **Microfinance** : crédits de 500 à 20 000 $ avec garanties ou épargne préalable
4. **Subventions et incubateurs** : accompagnement gratuit, financement non remboursable
5. **Investisseurs** : capitaux contre parts de l’entreprise, à réserver à une croissance déjà prouvée

Ne financez jamais un besoin de trésorerie par un crédit à court terme coûteux : vous fragilisez l’entreprise.`,
          ),
          l(
            'Pitcher pour convaincre',
            `Un pitch de trois minutes contient cinq blocs :
1. **Problème** : chiffré et vécu
2. **Solution** : votre offre en une phrase
3. **Marché** : nombre de clients possibles et votre part visée
4. **Modèle économique** : comment vous gagnez de l’argent
5. **Demande** : montant exact, emplois à l’usage

Terminez par une question précise : « Pouvons-nous signer la convention cette semaine ? »`,
          ),
          atelier(
            'Atelier final : plan d’affaires simplifié',
            `Rédigez un plan de 6 pages :
1. Résumé exécutif (1 page)
2. Problème et solution
3. Marché et concurrence
4. Plan marketing et commercial
5. Prévisions financières sur 12 mois (recettes, charges, seuil de rentabilité)
6. Besoins de financement et calendrier de mise en œuvre

**Livrable** : un document présentable à un incubateur ou à une banque partenaire.`,
            60,
          ),
        ],
      },
    ],
    quiz: {
      title: 'Évaluation finale — Entrepreneuriat',
      description: 'Vérifiez votre méthode de création d’entreprise.',
      questions: [
        {
          prompt: 'Combien de clients potentiels interroger avant d’investir ?',
          choices: ['Aucun, il faut agir vite', 'Environ 20', 'Plus de 500', 'Deux suffisent'],
          correctIndex: 1,
          explanation: 'Une vingtaine d’entretiens permet de détecter un vrai besoin sans immobiliser du capital.',
        },
        {
          prompt: 'Quel organisme centralise la création d’entreprise en RDC ?',
          choices: ['La CNSS', 'Le GUCE', 'La DGI', 'La Banque centrale'],
          correctIndex: 1,
          explanation: 'Le Guichet unique de création d’entreprise regroupe les formalités.',
        },
        {
          prompt: 'Pourquoi séparer la caisse de l’entreprise de celle du dirigeant ?',
          choices: [
            'Pour payer moins d’impôts',
            'Pour connaître la véritable rentabilité de l’activité',
            'C’est inutile',
            'Pour impressionner les clients',
          ],
          correctIndex: 1,
          explanation: 'Sans séparation, il est impossible de savoir si l’entreprise gagne ou perd de l’argent.',
        },
        {
          prompt: 'Quel financement est le moins risqué pour démarrer ?',
          choices: ['Un crédit court terme coûteux', 'L’autofinancement / réinvestissement', 'Un prêt usuraire', 'Une dette garantie par le logement familial'],
          correctIndex: 1,
          explanation: 'Réinvestir ses propres bénéfices limite le risque de surendettement.',
        },
        {
          prompt: 'Que doit contenir un pitch de trois minutes ?',
          choices: [
            'L’histoire personnelle uniquement',
            'Problème, solution, marché, modèle, demande précise',
            'La liste des concurrents seulement',
            'Des remerciements longs',
          ],
          correctIndex: 1,
          explanation: 'Ces cinq blocs permettent à l’interlocuteur de décider rapidement.',
        },
      ],
    },
  },

  {
    title: 'Éducation financière & mobile money',
    summary: 'Gérer un budget familial, épargner et utiliser mobile money en toute sécurité.',
    description:
      'Destinée au grand public, cette formation gratuite explique comment construire un budget familial réaliste, se constituer une épargne de précaution, éviter le surendettement et utiliser M-Pesa, Orange Money ou Airtel Money sans se faire arnaquer.',
    category: 'Finance & Comptabilité',
    level: 'DEBUTANT',
    language: 'fr',
    durationHours: 16,
    priceUsd: 0,
    coverEmoji: '💰',
    coverColor: '#15803d',
    instructorEmail: 'grace.mbuyi@smart-elimu.cd',
    rating: 4.9,
    learnersCount: 3620,
    modules: [
      {
        title: 'Module 1 — Reprendre le contrôle de son budget',
        summary: 'Revenus réels, dépenses cachées, épargne automatique.',
        lessons: [
          l(
            'Connaître son revenu réel',
            `Beaucoup de familles connaissent leur salaire mais ignorent leur revenu réel, fait de plusieurs sources irrégulières : petit commerce, location, aide familiale, travaux ponctuels.

Exercice : pendant un mois, notez **tout** ce qui entre. À la fin du mois, vous découvrirez souvent un écart de 10 à 20 % avec votre estimation.

Une fois ce chiffre connu, vous pouvez décider d’une épargne régulière sans vous mettre en difficulté.`,
          ),
          l(
            'Les trois enveloppes du budget familial',
            `Répartissez chaque entrée d’argent en trois enveloppes :
1. **Dépenses obligatoires** (loyer, école, nourriture, transport, santé) — environ 60 %
2. **Épargne de précaution** — au moins 10 %, prélevée en premier, pas en dernier
3. **Vie courante et projets** — environ 30 %

Astuce : ouvrez un compte mobile money dédié à l’épargne et n’en retirez jamais sans raison grave. La séparation physique de l’argent est plus efficace que la volonté.`,
          ),
          atelier(
            'Atelier : construire son budget du mois',
            `1. Listez vos revenus des trois derniers mois
2. Listez toutes vos dépenses par catégorie
3. Calculez le solde et identifiez les trois postes à réduire
4. Fixez un objectif d’épargne atteignable ce mois-ci
5. Notez dans un carnet (ou un fichier) chaque dépense supérieure à 5 000 CDF

**Livrable** : un budget écrit, affiché à la maison, avec l’objectif d’épargne visible.`,
            30,
          ),
        ],
      },
      {
        title: 'Module 2 — Utiliser le mobile money en sécurité',
        summary: 'Frais, transferts, code secret et arnaques fréquentes.',
        lessons: [
          l(
            'Comprendre les frais et choisir ses transferts',
            `Chaque opérateur applique des frais selon le montant, l’opérateur de destination et le type d’opération.

Règles pratiques :
- Regroupez les petits transferts en une seule opération
- Privilégiez les transferts vers le même opérateur, moins coûteux
- Retirez de préférence chez un agent proche, pour réduire le transport
- Vérifiez le **solde demandé** avant de valider : les frais s’ajoutent parfois
`,
          ),
          l(
            'Reconnaître et éviter les arnaques',
            `Les fraudes les plus courantes :
1. L’appel d’un faux agent demandant votre code secret
2. Le faux SMS annonçant un gain à retirer
3. La demande d’avance pour un prétendu marché lucratif
4. Le « transfert erroné » qu’on vous demande de renvoyer

**Règles absolues** : votre code secret ne se partage **jamais**, même avec un agent, un policier ou un proche au téléphone. Aucun opérateur ne le demande. En cas de doute, raccrochez et composez vous-même le service client.`,
          ),
          atelier(
            'Atelier : sécuriser ses comptes',
            `1. Changez votre code secret s’il s’agit d’une date de naissance
2. Activez la vérification par code sur votre téléphone
3. Notez les numéros du service client dans vos contacts
4. Expliquez les quatre arnaques à trois personnes de votre entourage
5. Définissez une règle familiale : personne ne donne son code, même à un proche pressé

**Livrable** : une liste de contrôle affichée dans la maison.`,
            25,
          ),
        ],
      },
      {
        title: 'Module 3 — Épargner et investir prudemment',
        summary: 'Tontines sécurisées, épargne à moyen terme, éviter le surendettement.',
        lessons: [
          l(
            'La tontine et la coopérative d’épargne',
            `La tontine reste l’outil d’épargne le plus répandu. Pour la rendre sûre :
- Écrivez le règlement : montant, fréquence, ordre de passage, sanctions
- Nommez un trésorier et un secrétaire, avec double signature
- Consignez chaque remise dans un cahier tenu par le secrétaire
- Limitez le nombre de membres pour éviter les impayés

Les coopératives d’épargne et de crédit offrent en plus un compte rémunéré et un accès au crédit.`,
          ),
          l(
            'Éviter le piège du surendettement',
            `Signe d’alerte : vous empruntez pour rembourser un autre crédit.

Règles de prudence :
- Le remboursement mensuel ne doit pas dépasser **30 %** du revenu
- Ne jamais emprunter pour un besoin de consommation courante
- Préférez un crédit qui finance un actif productif (moto, machine, stock)
- Exigez toujours le coût total : intérêts, frais de dossier, assurances`,
          ),
          atelier(
            'Atelier final : mon plan d’épargne sur 12 mois',
            `1. Fixez un objectif précis (frais scolaires, moto, fonds de commerce)
2. Calculez le montant à épargner chaque semaine
3. Choisissez deux canaux d’épargne (mobile money + tontine)
4. Prévoyez une réserve de précaution de trois mois de dépenses
5. Suivez votre progression chaque fin de mois dans un tableau

**Livrable** : un plan écrit avec le montant, la fréquence et le canal choisi.`,
            30,
          ),
        ],
      },
    ],
    quiz: {
      title: 'Évaluation finale — Éducation financière',
      description: 'Vérifiez vos réflexes de gestion et de sécurité financière.',
      questions: [
        {
          prompt: 'Quelle part de vos revenus devrait être épargnée en priorité ?',
          choices: ['0 %', 'Au moins 10 %', '50 %', 'Tout'],
          correctIndex: 1,
          explanation: 'Épargner au moins 10 % avant les dépenses de vie courante construit la sécurité du foyer.',
        },
        {
          prompt: 'Un « agent » vous demande votre code secret au téléphone. Que faites-vous ?',
          choices: [
            'Je le donne, il est agent',
            'Je refuse et je raccroche',
            'Je le donne partiellement',
            'Je l’envoie par SMS',
          ],
          correctIndex: 1,
          explanation: 'Aucun agent légitime ne demande un code secret. Refusez systématiquement.',
        },
        {
          prompt: 'Quel pourcentage maximal du revenu consacrer au remboursement d’une dette ?',
          choices: ['10 %', '30 %', '70 %', 'Aucune limite'],
          correctIndex: 1,
          explanation: 'Au-delà de 30 %, le risque de spirale de surendettement devient très élevé.',
        },
        {
          prompt: 'Pourquoi écrire le règlement d’une tontine ?',
          choices: [
            'Pour la rendre officielle auprès de l’État',
            'Pour éviter les conflits sur les montants et l’ordre de passage',
            'Ce n’est pas utile',
            'Pour payer des impôts',
          ],
          correctIndex: 1,
          explanation: 'Un règlement écrit protège tous les membres en cas de litige.',
        },
        {
          prompt: 'Quel signal doit vous alerter immédiatement ?',
          choices: [
            'Vous épargnez régulièrement',
            'Vous empruntez pour rembourser un autre crédit',
            'Vous notez vos dépenses',
            'Vous avez un compte d’épargne',
          ],
          correctIndex: 1,
          explanation: 'Emprunter pour rembourser une dette existante signale une spirale de surendettement.',
        },
      ],
    },
  },
];
