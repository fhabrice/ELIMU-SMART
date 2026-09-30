import { l, atelier, video, type SeedCourse } from './types';

/** Catalogue de formations — partie 2 (6 formations). */
export const COURSES_PART_2: SeedCourse[] = [
  {
    title: 'Santé communautaire & premiers secours',
    summary: 'Gestes qui sauvent, prévention des épidémies et accompagnement des familles en milieu rural.',
    description:
      'Conçue avec un institut supérieur de santé publique, cette formation prépare les relais communautaires, enseignants et parents à intervenir efficacement : arrêter une hémorragie, réagir à une noyade, reconnaître le choléra ou le paludisme grave, et organiser la prévention dans un quartier.',
    category: 'Santé & Bien-être',
    level: 'DEBUTANT',
    language: 'fr',
    durationHours: 32,
    priceUsd: 40,
    coverEmoji: '🩺',
    coverColor: '#be123c',
    partnerSlug: 'esak-sp-kinshasa',
    instructorEmail: 'esther.mukendi@smart-elimu.cd',
    rating: 4.9,
    learnersCount: 1490,
    modules: [
      {
        title: 'Module 1 — Les gestes qui sauvent',
        summary: 'Évaluer, alerter, agir dans les premières minutes.',
        lessons: [
          video(
            'Capsule vidéo : la chaîne de survie',
            `En cas d’urgence, chaque minute compte : le cerveau supporte moins de quatre minutes sans oxygène.

La chaîne de survie comporte cinq maillons :
1. **Reconnaître** l’urgence et appeler à l’aide
2. **Alerter** les secours (numéro local, proche du lieu)
3. **Dégager** la victime sans se mettre en danger
4. **Pratiquer** la réanimation ou la compression
5. **Transmettre** les informations à l’équipe médicale

**Règle d’or** : ne devenez jamais une deuxième victime. Évaluez la scène avant d’intervenir.`,
            14,
          ),
          l(
            'Arrêter une hémorragie et traiter une plaie',
            `Une hémorragie importante peut tuer en quelques minutes.

Méthode :
1. **Compression directe** avec un linge propre, appuyée fermement, sans relâcher
2. **Surélévation** du membre si possible
3. Si le linge est imbibé, **ajoutez** par-dessus, ne retirez jamais
4. Garrot uniquement en dernier recours, en notant l’heure de pose

Pour une plaie simple : lavage à l’eau propre et au savon, désinfection, pansement propre. Vérifiez la vaccination contre le **tétanos** : un rappel tous les dix ans.`,
          ),
          atelier(
            'Atelier : simulation d’intervention',
            `En groupes de trois (victime, secouriste, observateur) :
1. Simulez une chute avec hémorragie au bras
2. Appliquez la compression directe pendant trois minutes
3. L’observateur note les erreurs et les délais
4. Inversez les rôles

**À mémoriser** : appuyer fort, ne pas relâcher, parler à la victime pour la rassurer.`,
            35,
          ),
        ],
      },
      {
        title: 'Module 2 — Prévenir les maladies fréquentes',
        summary: 'Paludisme, diarrhées, choléra, hygiène de l’eau.',
        lessons: [
          l(
            'Paludisme : prévenir et reconnaître les signes graves',
            `Le paludisme reste la première cause de consultation en RDC.

Prévention : dormir sous **moustiquaire imprégnée**, assainir les alentours (eaux stagnantes), consulter dès les premiers symptômes.

Signes de gravité imposant une évacuation immédiate :
- Fièvre chez un **enfant de moins de cinq ans**
- Convulsions, perte de conscience
- Vomissements répétés, refus de boire
- Urines très foncées, pâleur extrême

Un test rapide réalisé tôt permet un traitement efficace et souvent gratuit pour les enfants.`,
          ),
          l(
            'Eau, hygiène et maladies diarrhéiques',
            `80 % des diarrhées se préviennent par trois gestes simples :
1. **Traiter l’eau** : ébullition pendant une minute ou chloration
2. **Se laver les mains** au savon après les toilettes et avant de cuisiner
3. **Protéger les aliments** des mouches et de la poussière

Devant une diarrhée, la priorité est la **réhydratation** : sels de réhydratation orale (SRO) préparés selon la notice, donnés en petites quantités très fréquemment, surtout aux enfants.`,
          ),
          atelier(
            'Atelier : organiser une campagne d’assainissement',
            `1. Cartographiez les points d’eau de votre quartier
2. Identifiez les zones d’eau stagnante
3. Fixez une date de journée communautaire d’assainissement
4. Préparez un plan de sensibilisation par porte-à-porte
5. Mesurez avant/après : nombre de familles équipées de latrines propres

**Livrable** : un plan d’action d’une page avec dates et responsables.`,
            40,
          ),
        ],
      },
      {
        title: 'Module 3 — Accompagner et orienter',
        summary: 'Référer au bon niveau de soins, communiquer sans stigmatiser.',
        lessons: [
          l(
            'Le système de santé en RDC et le rôle du relais communautaire',
            `Le parcours de soins s’organise en trois niveaux :
- **Centre de santé** : soins primaires, accouchements, vaccination, paludisme simple
- **Hôpital général de référence** : chirurgie, complications, hospitalisation
- **Hôpitaux spécialisés** : pathologies complexes

Le relais communautaire **ne remplace pas l’infirmier** : il informe, détecte tôt, accompagne et réfère. Il connaît les personnes vulnérables de son aire et les suit.`,
          ),
          l(
            'Communiquer avec les familles',
            `Une famille en détresse retient peu d’informations. Trois principes :
1. **Écouter d’abord**, sans juger
2. **Une seule consigne à la fois**, en langage simple
3. **Faire reformuler** pour vérifier la compréhension

Pour le VIH, la tuberculose ou la fistule obstétricale, bannissez les mots de rejet : la stigmatisation fait fuir les patients et aggrave l’épidémie.

Confidentialité absolue : ne racontez jamais l’état d’un patient à un tiers.`,
          ),
          atelier(
            'Atelier final : plan d’action de votre aire de santé',
            `Rédigez un plan de quatre mois comprenant :
1. Diagnostic : principales causes de morbidité locale
2. Trois priorités (exemple : vaccination, hygiène, suivi des femmes enceintes)
3. Actions concrètes, calendrier et responsables
4. Indicateurs de suivi simples (nombre de familles visitées, enfants référés)
5. Partenaires à mobiliser (centre de santé, ONG, églises, écoles)

**Livrable** : un document d’une page affiché au centre de santé.`,
            45,
          ),
        ],
      },
    ],
    quiz: {
      title: 'Évaluation finale — Santé communautaire',
      description: 'Validez vos réflexes de secourisme et de prévention.',
      questions: [
        {
          prompt: 'Quelle est la première action face à une hémorragie importante ?',
          choices: ['Poser un garrot immédiatement', 'Appliquer une compression directe ferme', 'Donner de l’eau à boire', 'Déplacer la victime'],
          correctIndex: 1,
          explanation: 'La compression directe est le geste de première intention ; le garrot reste un recours exceptionnel.',
        },
        {
          prompt: 'Comment traiter l’eau de boisson à domicile ?',
          choices: ['La laisser reposer', 'Ébullition d’au moins une minute ou chloration', 'Y ajouter du sucre', 'La filtrer avec un tissu uniquement'],
          correctIndex: 1,
          explanation: 'L’ébullition ou la chloration élimine les agents pathogènes responsables des diarrhées.',
        },
        {
          prompt: 'Quel signe impose une évacuation immédiate chez un enfant fébrile ?',
          choices: ['Il joue normalement', 'Convulsions ou perte de conscience', 'Il a faim', 'Il tousse légèrement'],
          correctIndex: 1,
          explanation: 'Convulsions et perte de conscience sont des signes de paludisme grave nécessitant une référence urgente.',
        },
        {
          prompt: 'Que fait en priorité un relais communautaire ?',
          choices: [
            'Prescrire des médicaments',
            'Informer, détecter tôt, accompagner et référer',
            'Pratiquer la chirurgie',
            'Remplacer le médecin',
          ],
          correctIndex: 1,
          explanation: 'Le relais communautaire complète le système de santé sans se substituer aux soignants.',
        },
        {
          prompt: 'Combien de consignes donner à la fois à une famille stressée ?',
          choices: ['Une seule', 'Cinq', 'Dix', 'Le plus possible'],
          correctIndex: 0,
          explanation: 'Une consigne unique, reformulée par la famille, a bien plus de chances d’être appliquée.',
        },
      ],
    },
  },

  {
    title: 'Production agricole durable : maïs, manioc et maraîchage',
    summary: 'Améliorer les rendements avec des techniques accessibles et respectueuses des sols.',
    description:
      'Cette formation pratique s’adresse aux agriculteurs, coopératives et agri-entrepreneurs. Elle couvre le choix des semences, la préparation du sol, la fertilisation organique, la lutte contre les ravageurs et la commercialisation groupée, avec des cas du Kongo-Central, du Kasaï et du Nord-Kivu.',
    category: 'Agriculture & Environnement',
    level: 'DEBUTANT',
    language: 'fr',
    durationHours: 36,
    priceUsd: 25,
    coverEmoji: '🌱',
    coverColor: '#15803d',
    partnerSlug: 'ctap-kivu-bukavu',
    instructorEmail: 'joseph.kabongo@smart-elimu.cd',
    rating: 4.8,
    learnersCount: 1235,
    modules: [
      {
        title: 'Module 1 — Préparer une parcelle productive',
        summary: 'Sol, semences, calendrier cultural.',
        lessons: [
          l(
            'Comprendre et améliorer son sol',
            `Avant de semer, observez : couleur, odeur, présence de vers de terre, profondeur de la terre meuble.

Trois gestes qui augmentent la fertilité :
1. **Compostage** : alterner couches de résidus végétaux et de fumier, retourner toutes les trois semaines, arroser sans détremper
2. **Paillage** : couvrir le sol de résidus pour limiter l’évaporation et l’érosion
3. **Rotation** : ne jamais remettre la même culture au même endroit deux saisons de suite

Un sol vivant produit plus, même sans engrais chimique.`,
          ),
          l(
            'Choisir ses semences et son calendrier',
            `Utilisez des semences **améliorées certifiées** pour les cultures vivrières principales : elles coûtent un peu plus cher mais doublent souvent le rendement.

Calendrier indicatif (à adapter selon la province) :
- **Maïs** : semis au début de la saison des pluies, récolte 3 à 4 mois plus tard
- **Manioc** : boutures en début de pluies, récolte de 9 à 18 mois
- **Maraîchage** (amarante, oseille, tomate) : possible en contre-saison près d’un point d’eau

Notez chaque saison ce que vous semez et quand, pour comparer les résultats d’une année sur l’autre.`,
          ),
          atelier(
            'Atelier : plan de campagne agricole',
            `Préparez un calendrier sur 12 mois :
1. Découpez vos parcelles et affectez une culture à chacune
2. Fixez les dates de préparation, semis, entretien et récolte
3. Estimez les quantités de semences et de compost nécessaires
4. Prévoyez la main-d’œuvre familiale et les journées de travail salarié
5. Inscrivez les prix de vente attendus par culture

**Livrable** : un plan affiché, révisé chaque mois.`,
            35,
          ),
        ],
      },
      {
        title: 'Module 2 — Protéger la culture',
        summary: 'Ravageurs, maladies, fertilisation raisonnée.',
        lessons: [
          l(
            'Reconnaître les principaux ravageurs',
            `- **Chenilles légionnaires** sur le maïs : trous dans les jeunes feuilles, sciure au cœur
- **Mouche blanche** : feuilles jaunies, dépôt blanc au revers
- **Charançon** dans les stocks de maïs : pertes pouvant atteindre 30 % en trois mois
- **Maladies fongiques** : taches brunes, pourriture de la tige

Méthodes de lutte intégrée : rotation, association de cultures, traitement des semences, pulvérisation d’extraits de neem ou de piment, et destruction des résidus infectés.`,
          ),
          l(
            'Fertiliser sans ruiner son sol',
            `Une fertilisation raisonnée suit trois principes :
1. **Nourrir le sol d’abord** (compost, fumier, résidus)
2. **Apporter les minéraux au bon moment** : azote en début de croissance, phosphore et potassium près du semis
3. **Ne jamais dépasser les doses** : un excès brûle les racines et pollue les cours d’eau

Testez sur une bande de contrôle : la comparaison avec et sans traitement vous indiquera la vraie rentabilité de vos intrants.`,
          ),
          atelier(
            'Atelier : fabriquer du compost de qualité',
            `1. Choisissez un site ombragé, proche d’un point d’eau
2. Montez le tas en couches : 20 cm de résidus végétaux, 10 cm de fumier, une fine couche de cendre
3. Arrosez sans détremper, couvrez de feuilles de bananier
4. Retournez toutes les trois semaines, pendant deux à trois mois
5. Le compost est mûr quand il est homogène, brun et sans odeur forte

**Livrable** : un tas de compost suivi pendant trois mois avec un carnet de suivi.`,
            40,
          ),
        ],
      },
      {
        title: 'Module 3 — Vendre et se regrouper',
        summary: 'Stocker, transformer, commercialiser en coopérative.',
        lessons: [
          l(
            'Réduire les pertes après récolte',
            `Entre la récolte et la vente, 30 % des produits sont perdus. Pour limiter ces pertes :
- Récoltez au bon stade de maturité
- Séchez correctement (sur bâche, jamais à même le sol humide)
- Stockez dans des sacs propres, sur palettes, dans un lieu ventilé
- Traitez contre les insectes avec des méthodes sans danger alimentaire
- Vendez régulièrement plutôt que d’attendre un hypothétique prix élevé`,
          ),
          l(
            'Vendre par la coopérative',
            `Vendre seul, c’est accepter le prix du premier acheteur. Vendre groupé, c’est négocier.

Fonctionnement d’une coopérative agricole :
1. Les membres apportent leur production à un magasin commun
2. Un contrôle de qualité est effectué (humidité, propreté, calibre)
3. La coopérative négocie avec des acheteurs formels (industries, ONG, marchés institutionnels)
4. Les recettes sont réparties selon les apports, une réserve est conservée pour l’investissement

**Avantage décisif** : accès aux appels d’offres et contrats de fourniture réguliers.`,
          ),
          atelier(
            'Atelier final : plan de commercialisation',
            `1. Identifiez cinq acheteurs potentiels dans un rayon de 100 km
2. Comparez leurs prix, leurs exigences de qualité et leurs délais de paiement
3. Calculez votre prix de revient complet par kilo ou par sac
4. Rédigez une offre commerciale d’une page
5. Fixez une stratégie de stockage sur trois mois

**Livrable** : une fiche produit et une liste d’acheteurs avec contacts vérifiés.`,
            45,
          ),
        ],
      },
    ],
    quiz: {
      title: 'Évaluation finale — Agriculture durable',
      description: 'Vérifiez vos pratiques culturales et commerciales.',
      questions: [
        {
          prompt: 'Quel geste augmente la fertilité du sol sans engrais chimique ?',
          choices: ['Brûler les résidus', 'Le compostage et le paillage', 'Labourer profondément chaque saison', 'Laisser le sol nu'],
          correctIndex: 1,
          explanation: 'Le compost nourrit le sol et le paillage protège l’humidité et limite l’érosion.',
        },
        {
          prompt: 'Pourquoi pratiquer la rotation des cultures ?',
          choices: [
            'Pour embellir la parcelle',
            'Pour casser le cycle des ravageurs et préserver les nutriments',
            'Pour occuper les voisins',
            'Pour réduire le nombre de semences',
          ],
          correctIndex: 1,
          explanation: 'Alterner les cultures limite les maladies et équilibre les besoins du sol.',
        },
        {
          prompt: 'Quel est le risque d’un excès d’engrais minéral ?',
          choices: ['Aucun', 'Brûlure des racines et pollution de l’eau', 'Meilleur goût des produits', 'Moins de mauvaises herbes'],
          correctIndex: 1,
          explanation: 'Un excès d’intrants détruit les racines et pollue les cours d’eau.',
        },
        {
          prompt: 'Comment réduire les pertes après récolte ?',
          choices: [
            'Stocker à même le sol humide',
            'Sécher et stocker dans un lieu ventilé sur palettes',
            'Attendre six mois pour vendre',
            'Mélanger produits sains et abîmés',
          ],
          correctIndex: 1,
          explanation: 'Séchage correct et stockage ventilé réduisent fortement les pertes.',
        },
        {
          prompt: 'Quel est le principal avantage de vendre en coopérative ?',
          choices: [
            'Vendre plus vite au premier prix venu',
            'Négocier des contrats et des prix auprès d’acheteurs formels',
            'Éviter de travailler',
            'Obtenir des subventions automatiques',
          ],
          correctIndex: 1,
          explanation: 'Le volume groupé donne un pouvoir de négociation et l’accès aux marchés formels.',
        },
      ],
    },
  },

  {
    title: 'Enseignement efficace & pédagogie active',
    summary: 'Concevoir des leçons vivantes et évaluer les acquis réels de chaque élève.',
    description:
      'Destinée aux enseignants du primaire et du secondaire, cette formation propose des méthodes applicables dès demain dans une classe de 60 élèves : objectifs clairs, questions ouvertes, travail en groupes, évaluation formative et gestion positive de la discipline.',
    category: 'Éducation & Pédagogie',
    level: 'INTERMEDIAIRE',
    language: 'fr',
    durationHours: 26,
    priceUsd: 20,
    coverEmoji: '👩🏾‍🏫',
    coverColor: '#1c60f0',
    partnerSlug: 'isp-bandundu',
    instructorEmail: 'esther.mukendi@smart-elimu.cd',
    rating: 4.9,
    learnersCount: 980,
    modules: [
      {
        title: 'Module 1 — Préparer une leçon qui fonctionne',
        summary: 'Objectifs observables, progression, matériel local.',
        lessons: [
          l(
            'Écrire un objectif d’apprentissage observable',
            `Un objectif flou ne se vérifie pas. Comparez :
- ❌ « Comprendre les fractions »
- ✅ « À la fin de la leçon, l’élève sait comparer deux fractions de dénominateurs différents et justifier sa réponse »

Formule utile : **verbe d’action + contenu + condition de réussite**.
Les verbes d’action : classer, calculer, expliquer, construire, démontrer, argumenter.`,
          ),
          l(
            'Structurer la leçon en cinq temps',
            `1. **Rappel** (5 min) : question sur la leçon précédente
2. **Situation problème** (5 min) : une question concrète qui intrigue
3. **Recherche en groupes** (15 min) : les élèves cherchent, l’enseignant circule
4. **Mise en commun** (10 min) : un rapporteur par groupe, l’enseignant structure
5. **Exercice individuel** (10 min) : application personnelle, correction immédiate

Ce schéma fonctionne même avec 60 élèves et sans matériel moderne. Il change simplement le centre de gravité : l’élève travaille, l’enseignant guide.`,
          ),
          atelier(
            'Atelier : préparer une leçon avec le matériel local',
            `Choisissez une notion de votre programme et préparez :
1. L’objectif observable
2. Une situation problème tirée du quotidien (marché, champ, transport)
3. Deux exercices différenciés (un simple, un défi)
4. Un matériel fabriqué avec des objets locaux (bouchons, bâtonnets, sable)

**Livrable** : une fiche de préparation d’une page, testable dès la semaine suivante.`,
            35,
          ),
        ],
      },
      {
        title: 'Module 2 — Faire parler les élèves',
        summary: 'Questions ouvertes, travail de groupe, gestion de classe.',
        lessons: [
          l(
            'Poser des questions qui font réfléchir',
            `Hiérarchie des questions :
1. **Rappel** : « Quelle est la formule ? » — utile mais insuffisant
2. **Application** : « Calcule ce cas précis »
3. **Analyse** : « Pourquoi as-tu procédé ainsi ? »
4. **Évaluation** : « Quelle méthode est plus fiable ici, et pourquoi ? »

Laissez **cinq secondes de silence** après chaque question. Ce temps double le nombre d’élèves capables de répondre.`,
          ),
          l(
            'Gérer une classe nombreuse avec bienveillance',
            `Trois principes qui réduisent les incidents :
1. **Règles claires et peu nombreuses** : affichées, expliquées, appliquées par tous
2. **Routines** : entrée, distribution des cahiers, sortie — toujours identiques
3. **Intervention discrète** : s’approcher, parler à voix basse, éviter l’humiliation publique

Sanctionner un élève devant 60 camarades le braque. Le corriger en privé fonctionne beaucoup mieux. Valorisez publiquement le travail bien fait : la reconnaissance est le meilleur outil de discipline.`,
          ),
          atelier(
            'Atelier : concevoir une activité de groupe',
            `Pour une notion de votre choix :
1. Formez des groupes de cinq avec un rôle par élève (animateur, secrétaire, rapporteur, gardien du temps, vérificateur)
2. Rédigez la consigne au tableau, en une phrase
3. Prévoyez une tâche bonus pour les groupes rapides
4. Préparez trois questions de relance
5. Chronométrez et ajustez

**Livrable** : la fiche de l’activité, testée en classe, avec vos observations notées.`,
            40,
          ),
        ],
      },
      {
        title: 'Module 3 — Évaluer pour faire progresser',
        summary: 'Évaluation formative, remédiation, bulletins utiles.',
        lessons: [
          l(
            'L’évaluation formative au quotidien',
            `L’évaluation n’est pas seulement une note : c’est un outil pour savoir **où en est chaque élève**.

Techniques rapides :
- **Billets de sortie** : trois questions en fin de cours, ramassées en sortant
- **Doigts levés** : 1 = je n’ai pas compris, 5 = je peux l’expliquer
- **Tableau blanc individuel** ou ardoise : toute la classe répond en même temps
- **Correction entre pairs** : chaque élève corrige le travail d’un camarade avec une grille

En cinq minutes, vous obtenez la carte des incompréhensions de la classe.`,
          ),
          l(
            'Remédier sans ralentir toute la classe',
            `Trois niveaux d’intervention :
1. **Groupe de besoin** : 15 minutes avec cinq élèves pendant que les autres avancent
2. **Explication entre pairs** : un élève qui a compris explique à un autre
3. **Exercice ciblé** : une seule compétence à retravailler, corrigée immédiatement

Un élève qui reste au bord du chemin en primaire décroche au secondaire. Repérer et intervenir tôt coûte bien moins cher que de reprendre un cursus.`,
          ),
          atelier(
            'Atelier final : construire une grille de compétences',
            `1. Choisissez une compétence annuelle de votre programme
2. Décrivez quatre niveaux : non atteint, partiel, atteint, dépassé
3. Associez à chaque niveau une manifestation observable
4. Testez la grille sur dix copies
5. Préparez un commentaire type pour chaque niveau, à recopier dans les bulletins

**Livrable** : une grille utilisable pour toute l’année scolaire.`,
            45,
          ),
        ],
      },
    ],
    quiz: {
      title: 'Évaluation finale — Pédagogie active',
      description: 'Contrôlez votre maîtrise de la préparation et de l’évaluation.',
      questions: [
        {
          prompt: 'Quel objectif est correctement formulé ?',
          choices: [
            'Comprendre les fractions',
            'L’élève compare deux fractions de dénominateurs différents et justifie sa réponse',
            'Savoir les mathématiques',
            'Étudier la leçon 4',
          ],
          correctIndex: 1,
          explanation: 'Un objectif doit être observable et vérifiable par une action précise.',
        },
        {
          prompt: 'Combien de temps attendre après avoir posé une question ?',
          choices: ['1 seconde', '5 secondes', '30 secondes', 'Aucune attente'],
          correctIndex: 1,
          explanation: 'Cinq secondes de silence augmentent nettement le nombre de réponses de qualité.',
        },
        {
          prompt: 'Quelle est la meilleure réaction face à un élève perturbateur ?',
          choices: [
            'Le sanctionner devant toute la classe',
            'S’approcher et lui parler à voix basse',
            'L’exclure définitivement',
            'Ignorer totalement',
          ],
          correctIndex: 1,
          explanation: 'L’intervention discrète évite le rapport de force et protège la dignité de l’élève.',
        },
        {
          prompt: 'À quoi sert un « billet de sortie » ?',
          choices: [
            'À occuper les élèves',
            'À repérer rapidement les incompréhensions de la classe',
            'À noter définitivement les élèves',
            'À remplir le bulletin',
          ],
          correctIndex: 1,
          explanation: 'C’est un outil d’évaluation formative immédiat, non noté.',
        },
        {
          prompt: 'Pourquoi intervenir tôt auprès des élèves en difficulté ?',
          choices: [
            'Pour remplir les statistiques',
            'Parce que le décrochage se creuse et devient coûteux à rattraper',
            'Pour réduire le nombre d’élèves',
            'Ce n’est pas nécessaire',
          ],
          correctIndex: 1,
          explanation: 'Les difficultés non traitées au primaire s’aggravent et conduisent au décrochage.',
        },
      ],
    },
  },

  {
    title: 'Sécurité minière & travaux en hauteur',
    summary: 'Prévenir les accidents sur les sites artisanaux et industriels du Katanga et du Lualaba.',
    description:
      'Formation HSE conçue pour les creuseurs, techniciens et chefs d’équipe : identification des risques, équipements de protection, travail en hauteur, espaces confinés, premiers secours et procédures d’urgence. Conforme aux bonnes pratiques internationales du secteur.',
    category: 'Mines & Industrie',
    level: 'INTERMEDIAIRE',
    language: 'fr',
    durationHours: 22,
    priceUsd: 60,
    coverEmoji: '⛑️',
    coverColor: '#7a350d',
    partnerSlug: 'amg-haut-katanga',
    instructorEmail: 'joseph.kabongo@smart-elimu.cd',
    rating: 4.7,
    learnersCount: 760,
    modules: [
      {
        title: 'Module 1 — Identifier les risques',
        summary: 'Analyse de poste, permis de travail, hiérarchie des protections.',
        lessons: [
          l(
            'La hiérarchie des mesures de protection',
            `Dans l’ordre d’efficacité décroissante :
1. **Supprimer** le danger (déplacer l’opération)
2. **Remplacer** par une technique moins risquée
3. **Isoler** par des barrières physiques
4. **Organiser** le travail (rotation, pauses, signalisation)
5. **Protéger** l’individu (casque, chaussures, gants, lunettes, harnais)

L’équipement de protection individuelle est la **dernière** barrière, jamais la première. Un casque ne remplace pas un étaiement correct.`,
          ),
          l(
            'Le permis de travail et l’analyse de risque',
            `Avant toute tâche dangereuse (travail en hauteur, espace confiné, travaux à chaud) :
1. Décrire la tâche en cinq étapes
2. Identifier un danger par étape
3. Définir une mesure de contrôle pour chaque danger
4. Nommer un responsable et fixer l’heure de fin
5. Faire signer par le chef d’équipe et l’exécutant

Cinq minutes de préparation évitent la majorité des accidents graves.`,
          ),
          atelier(
            'Atelier : analyse de risque sur votre poste',
            `1. Choisissez une tâche réelle de votre site
2. Listez tous les dangers (chutes, poussière, bruit, machines, électricité, gaz)
3. Attribuez une gravité et une probabilité de 1 à 5
4. Calculez le risque (gravité × probabilité)
5. Proposez trois mesures de contrôle pour les risques les plus élevés

**Livrable** : une fiche d’analyse de risque signée par l’équipe.`,
            35,
          ),
        ],
      },
      {
        title: 'Module 2 — Travailler en sécurité',
        summary: 'Hauteur, espaces confinés, électricité, poussière.',
        lessons: [
          l(
            'Travailler en hauteur sans tomber',
            `La chute est la première cause de décès au travail.

Points de contrôle obligatoires :
- Harnais **attaché à un point d’ancrage résistant**, jamais à un tuyau ou une barre de fortune
- Échelle inclinée, pieds stabilisés, un seul opérateur à la fois
- Échafaudage monté par une personne formée, avec garde-corps et plinthes
- Zone au sol balisée pour protéger les collègues en dessous

Vérifiez vos équipements **avant chaque utilisation**, pas une fois par mois.`,
          ),
          l(
            'Espaces confinés, électricité et poussière',
            `**Espace confiné** (citerne, puits, silo) : on ne rentre jamais seul. Contrôlez l’oxygène et les gaz, ventilez, gardez un surveillant extérieur avec un moyen d’alerte.

**Électricité** : consignez (coupez, verrouillez, vérifiez l’absence de tension), portez des gants isolants, jamais deux personnes sur une même installation sans coordination.

**Poussière de silice** : mouillez les zones de foration, portez un masque adapté, ne mangez jamais sur la zone d’extraction. La silicose est irréversible.`,
          ),
          atelier(
            'Atelier : préparer une intervention à risque',
            `Préparez le dossier complet pour une intervention en hauteur :
1. Analyse de risque
2. Permis de travail rempli
3. Liste du matériel vérifié (harnais, longe, ancrage)
4. Balisage au sol et briefing de l’équipe
5. Procédure d’évacuation en cas de chute

**Livrable** : un dossier validé par le chef de site, applicable immédiatement.`,
            40,
          ),
        ],
      },
      {
        title: 'Module 3 — Urgences et culture sécurité',
        summary: 'Évacuation, secours à victime, remontée des incidents.',
        lessons: [
          l(
            'Réagir à un accident',
            `Séquence d’intervention :
1. **Protéger** la zone (couper l’énergie, baliser)
2. **Alerter** le secours et donner la localisation exacte
3. **Secourir** sans déplacer un blessé suspecté atteint à la colonne vertébrale
4. **Transmettre** l’information à la hiérarchie et au service médical

Tout accident, même bénin, doit être déclaré : la déclaration oblige l’employeur à corriger la cause.`,
          ),
          l(
            'Faire vivre la culture sécurité',
            `La sécurité n’est pas un document, c’est une habitude collective.

Rituels efficaces :
- **Causerie de cinq minutes** avant chaque poste, sur un risque précis
- **Tournée d’observation** par un chef d’équipe, chaque semaine
- **Remontée des presqu’accidents** : ce qui a failli arriver est l’information la plus précieuse
- **Féliciter** ceux qui signalent, jamais sanctionner un signalement de bonne foi
`,
          ),
          atelier(
            'Atelier final : plan HSE du site',
            `Construisez un plan d’une page :
1. Trois risques majeurs identifiés
2. Deux actions de prévention par risque
3. Un responsable nommé pour chaque action
4. Un indicateur de suivi (nombre de presqu’accidents signalés, taux de port des EPI)
5. Une date de revue mensuelle

**Livrable** : le plan affiché au poste de contrôle du site.`,
            35,
          ),
        ],
      },
    ],
    quiz: {
      title: 'Évaluation finale — Sécurité minière',
      description: 'Vérifiez vos réflexes de sécurité industrielle.',
      questions: [
        {
          prompt: 'Quelle mesure est la plus efficace contre un risque ?',
          choices: ['Le port d’un casque', 'La suppression du danger à la source', 'Une affiche de rappel', 'Une prime de risque'],
          correctIndex: 1,
          explanation: 'La hiérarchie des protections place la suppression du danger au premier rang.',
        },
        {
          prompt: 'À quoi s’accroche un harnais de sécurité ?',
          choices: ['À un tuyau', 'À une barre de fortune', 'À un point d’ancrage résistant vérifié', 'À la ceinture d’un collègue'],
          correctIndex: 2,
          explanation: 'Seul un point d’ancrage résistant et vérifié garantit la protection en cas de chute.',
        },
        {
          prompt: 'Que faire avant d’intervenir sur une installation électrique ?',
          choices: [
            'Travailler rapidement',
            'Consigner, verrouiller et vérifier l’absence de tension',
            'Porter des gants en tissu',
            'Appeler un collègue',
          ],
          correctIndex: 1,
          explanation: 'La consignation (séparation, verrouillage, vérification) est la seule méthode sûre.',
        },
        {
          prompt: 'Que ne faut-il jamais faire seul ?',
          choices: ['Conduire un camion', 'Entrer dans un espace confiné', 'Porte un casque', 'Prendre une pause'],
          correctIndex: 1,
          explanation: 'Un espace confiné exige une surveillance extérieure et un contrôle d’atmosphère.',
        },
        {
          prompt: 'Pourquoi déclarer un presqu’accident ?',
          choices: [
            'Pour sanctionner un collègue',
            'Pour corriger la cause avant qu’elle ne provoque un accident grave',
            'Pour remplir des statistiques',
            'Ce n’est pas utile',
          ],
          correctIndex: 1,
          explanation: 'Les presqu’accidents révèlent les failles à corriger avant l’accident réel.',
        },
      ],
    },
  },

  {
    title: 'Anglais professionnel pour l’emploi',
    summary: 'Communiquer en anglais au travail : e-mails, réunions, entretiens et appels.',
    description:
      'L’anglais est devenu un critère de recrutement dans les ONG internationales, les banques et les entreprises minières présentes en RDC. Cette formation vous entraîne sur des situations réelles : rédiger un e-mail, se présenter en entretien, participer à une réunion et négocier.',
    category: 'Langues & Communication',
    level: 'INTERMEDIAIRE',
    language: 'fr',
    durationHours: 30,
    priceUsd: 35,
    coverEmoji: '🗣️',
    coverColor: '#7c3aed',
    partnerSlug: 'unv-kinshasa',
    instructorEmail: 'esther.mukendi@smart-elimu.cd',
    rating: 4.6,
    learnersCount: 1580,
    modules: [
      {
        title: 'Module 1 — Se présenter et parler de son parcours',
        summary: 'Présentation professionnelle, verbes utiles, prononciation.',
        lessons: [
          l(
            'Construire sa présentation professionnelle',
            `Un « elevator pitch » professionnel tient en quatre phrases :

"I am **Esther Mukendi**, a **laboratory technician** from **Goma**."
"I have **three years of experience** in **water quality testing**."
"I am **looking for** a position where I can **improve community health**."
"I would be glad to **discuss** how I can contribute."

Structure : **nom + métier + expérience + objectif**. Entraînez-vous à voix haute, chronométrez-vous : trente secondes suffisent.`,
          ),
          l(
            'Les temps indispensables au travail',
            `- **Present simple** : habitudes et fonctions — "I **prepare** the samples every morning."
- **Present continuous** : action en cours — "I **am working** on the report now."
- **Past simple** : actions terminées — "We **delivered** the order last week."
- **Present perfect** : bilan sans date précise — "I **have completed** five certifications."
- **Will / going to** : futur — "We **will send** the invoice tomorrow."

Erreur fréquente : « I have 25 years » au lieu de « I **am** 25 years old ».`,
          ),
          atelier(
            'Atelier : votre présentation enregistrée',
            `1. Rédigez votre présentation en cinq phrases
2. Enregistrez-vous avec votre téléphone
3. Réécoutez et notez trois points à améliorer (prononciation, débit, hésitations)
4. Refaites l’enregistrement
5. Comparez la durée et la fluidité entre les deux versions

**Livrable** : un enregistrement de 45 secondes que vous pourrez réutiliser en entretien.`,
            30,
          ),
        ],
      },
      {
        title: 'Module 2 — Écrire des e-mails professionnels',
        summary: 'Structure, formules de politesse, demandes claires.',
        lessons: [
          l(
            'La structure d’un e-mail efficace',
            `\`\`\`
Subject: Request for internship - Esther Mukendi - March 2026

Dear Ms. Johnson,

I am writing to apply for the laboratory internship advertised on your website.

I have attached my CV and a reference letter from my supervisor.
Could you please tell me if any further documents are needed?

Thank you for your time and consideration.

Best regards,
Esther Mukendi
+243 000 000 000
\`\`\`

Trois règles : objet précis, une demande principale par e-mail, formules de politesse adaptées au degré de familiarité.`,
          ),
          l(
            'Formules utiles et pièges à éviter',
            `Formules d’ouverture : "Dear Sir/Madam", "Dear Ms. Johnson", "Hello Patrick" (collègues).
Formules de clôture : "Best regards", "Kind regards", "Sincerely".

À éviter :
- Les majuscules pour crier : "I NEED THIS NOW"
- Le ton trop familier : "Give me the file"
- Les abréviations de messagerie : "plz", "thx"
- Oublier la pièce jointe annoncée — vérifiez toujours **avant** d’envoyer`,
          ),
          atelier(
            'Atelier : trois e-mails professionnels',
            `Rédigez et faites relire :
1. Un e-mail de candidature avec CV jointe
2. Un e-mail de relance poli après deux semaines sans réponse
3. Un e-mail de réponse à une plainte client

**Grille d’évaluation** : objet clair, demande explicite, politesse, absence de fautes bloquantes, coordonnées en signature.`,
            35,
          ),
        ],
      },
      {
        title: 'Module 3 — Entretien et réunion',
        summary: 'Questions classiques, prise de parole, négociation.',
        lessons: [
          l(
            'Répondre aux questions d’entretien',
            `Méthode **STAR** pour raconter une expérience :
- **S**ituation : le contexte
- **T**ask : votre mission
- **A**ction : ce que vous avez fait concrètement
- **R**esult : le résultat chiffré

Exemple : « In my last job, **our stock losses were 15 %**. **I was asked to reorganize the warehouse**. **I set up a weekly inventory and trained two colleagues**. **After three months, losses dropped to 4 %**. »

Préparez cinq histoires STAR et vous pourrez répondre à la majorité des questions.`,
          ),
          l(
            'Participer à une réunion en anglais',
            `Expressions pour intervenir :
- Donner son avis : "In my opinion…", "I believe that…"
- Demander une clarification : "Could you clarify that point, please?"
- Être en désaccord poliment : "I see your point, however…"
- Résumer : "To sum up, we agreed on three actions."

Notez les décisions et les responsables avant la fin de la réunion, puis envoyez un compte rendu écrit : c’est le meilleur moyen d’être remarqué.`,
          ),
          atelier(
            'Atelier final : simulation d’entretien',
            `En binôme, jouez l’entretien en anglais :
1. L’intervieweur pose dix questions (parcours, compétences, faiblesse, prétentions)
2. Le candidat répond en utilisant au moins deux réponses STAR
3. L’observateur note la fluidité, le vocabulaire et la structure
4. Inversion des rôles

**Livrable** : une fiche de progrès avec cinq expressions à maîtriser avant l’entretien réel.`,
            45,
          ),
        ],
      },
    ],
    quiz: {
      title: 'Évaluation finale — Anglais professionnel',
      description: 'Vérifiez votre maîtrise des situations professionnelles.',
      questions: [
        {
          prompt: 'Quelle formule d’objet est la plus professionnelle ?',
          choices: ['Hello', 'Request for internship - Esther Mukendi - March 2026', 'URGENT!!!', 'Question'],
          correctIndex: 1,
          explanation: 'Un objet précise l’objet et identifie l’expéditeur, ce qui accélère le traitement.',
        },
        {
          prompt: 'Que signifie la méthode STAR ?',
          choices: [
            'Situation, Task, Action, Result',
            'Speak, Talk, Answer, Repeat',
            'Start, Try, Ask, Respond',
            'Simple, True, Accurate, Rapid',
          ],
          correctIndex: 0,
          explanation: 'STAR structure un exemple concret avec un résultat mesurable.',
        },
        {
          prompt: 'Quelle phrase est correcte ?',
          choices: ['I have 25 years', 'I am 25 years old', 'I have 25 years old', 'I am have 25 years'],
          correctIndex: 1,
          explanation: 'L’âge s’exprime avec le verbe to be : I am 25 years old.',
        },
        {
          prompt: 'Comment exprimer un désaccord poliment ?',
          choices: ['You are wrong', 'I see your point, however…', 'No way', 'That is false'],
          correctIndex: 1,
          explanation: 'Reconnaître l’argument de l’autre avant de nuancer maintient la relation professionnelle.',
        },
        {
          prompt: 'Quel temps pour un bilan sans date précise ?',
          choices: ['Past simple', 'Present perfect', 'Present continuous', 'Future'],
          correctIndex: 1,
          explanation: 'Present perfect ("I have completed five certifications") convient pour un bilan atemporel.',
        },
      ],
    },
  },

  {
    title: 'Cybersécurité & protection des données personnelles',
    summary: 'Protéger ses comptes, ses fichiers et les données de ses élèves ou clients.',
    description:
      'Les écoles, ONG et entreprises congolaises subissent de plus en plus de fraudes numériques. Cette formation couvre les mots de passe, la double authentification, la sauvegarde, la fraude au président et les obligations de protection des données personnelles.',
    category: 'Informatique & Numérique',
    level: 'INTERMEDIAIRE',
    language: 'fr',
    durationHours: 22,
    priceUsd: 45,
    coverEmoji: '🔐',
    coverColor: '#0d2a6b',
    partnerSlug: 'unikin-numerique',
    instructorEmail: 'patrick.ilunga@smart-elimu.cd',
    rating: 4.8,
    learnersCount: 1120,
    modules: [
      {
        title: 'Module 1 — Protéger ses comptes',
        summary: 'Mots de passe, double authentification, hameçonnage.',
        lessons: [
          l(
            'Des mots de passe réellement solides',
            `Un mot de passe de huit caractères se casse en quelques minutes. Une **phrase de passe** de quatre mots résiste des siècles.

Exemples :
- ❌ \`12345678\`, \`kinshasa\`, \`nom2026\`
- ✅ \`Mangue-Verte-Tshopo-42!\`

Règles :
1. Une phrase de passe différente par service important
2. Jamais la même pour la banque et les réseaux sociaux
3. Utilisez un gestionnaire de mots de passe pour les stocker
4. Changez immédiatement tout mot de passe qui a fuité`,
          ),
          l(
            'Reconnaître un message frauduleux',
            `Signes d’hameçonnage :
- Urgence artificielle : « votre compte sera fermé dans 24 heures »
- Adresse de l’expéditeur légèrement modifiée (un caractère changé)
- Lien qui ne correspond pas au site officiel
- Fautes de langue nombreuses
- Demande d’informations confidentielles ou de paiement inhabituel

**Réflexe** : ne cliquez jamais depuis le message. Ouvrez vous-même le site officiel et vérifiez l’information.`,
          ),
          atelier(
            'Atelier : sécuriser vos comptes en une heure',
            `1. Listez vos cinq comptes les plus critiques
2. Créez une phrase de passe unique pour chacun
3. Activez la double authentification (application d’authentification de préférence au SMS)
4. Vérifiez les sessions ouvertes et déconnectez les appareils inconnus
5. Activez les alertes de connexion par e-mail

**Livrable** : une liste de contrôle datée, à refaire dans six mois.`,
            30,
          ),
        ],
      },
      {
        title: 'Module 2 — Protéger les données d’une organisation',
        summary: 'Sauvegardes, droits d’accès, fraude au président.',
        lessons: [
          l(
            'La règle de sauvegarde 3-2-1',
            `**3** copies des données, sur **2** supports différents, dont **1** hors du site.

Application pour une école :
1. Copie de travail sur l’ordinateur du secrétariat
2. Copie quotidienne sur un disque externe conservé dans un autre bureau
3. Copie chiffrée en ligne une fois par semaine

Testez la **restauration** au moins une fois par trimestre : une sauvegarde jamais vérifiée n’est pas une sauvegarde.`,
          ),
          l(
            'La fraude au président et les virements détournés',
            `Un fraudeur se fait passer pour le directeur et demande un virement urgent, en insistant sur la confidentialité et l’urgence.

Procédure de protection, à écrire et à faire signer :
1. Toute demande de paiement hors circuit habituel est **suspecte**
2. Vérification obligatoire par **appel téléphonique au numéro connu**, jamais au numéro indiqué dans le message
3. Double signature au-delà d’un seuil défini
4. Journal des opérations consultable

Une seule personne ne doit jamais pouvoir déclencher un paiement importante seule.`,
          ),
          atelier(
            'Atelier : réglementer l’accès aux données scolaires',
            `Pour les données de vos élèves :
1. Listez qui accède à quoi (direction, enseignants, secrétariat, informatique)
2. Supprimez les accès inutiles
3. Créez des comptes nominatifs — jamais de compte partagé
4. Chiffrez les clés USB contenant des données personnelles
5. Rédigez une note interne de protection des données en dix lignes

**Livrable** : la matrice des accès et la note interne signée par la direction.`,
            35,
          ),
        ],
      },
      {
        title: 'Module 3 — Réagir à un incident',
        summary: 'Détection, confinement, notification, retour d’expérience.',
        lessons: [
          l(
            'Les quatre étapes de la réponse à incident',
            `1. **Détecter** : anomalie signalée par un utilisateur ou une alerte
2. **Confiner** : débrancher le réseau, geler le compte compromis, ne pas éteindre brutalement si un chiffrement est suspecté
3. **Traiter** : analyse, restauration depuis une sauvegarde saine, réinitialisation des identifiants
4. **Tirer les leçons** : comprendre la faille et corriger la procédure

Notez tout par écrit avec l’heure de chaque action : cela sert à expliquer l’incident et à éviter sa répétition.`,
          ),
          l(
            'Protection des données personnelles : vos obligations',
            `La RDC dispose d’une loi sur la protection des données à caractère personnel. Principes à respecter :
- **Finalité** : collecter uniquement ce qui est nécessaire
- **Consentement** : informer et obtenir l’accord pour l’usage des données
- **Sécurité** : protéger les données par des mesures techniques et organisationnelles
- **Droits des personnes** : accès, correction et suppression sur demande
- **Durée limitée** : ne pas conserver indéfiniment

Pour une école : dossiers d’élèves, photos et résultats doivent être protégés comme des données sensibles.`,
          ),
          atelier(
            'Atelier final : plan de continuité',
            `Rédigez un plan d’une page :
1. Liste des données critiques et de leur emplacement
2. Fréquence de sauvegarde et responsable
3. Procédure à suivre en cas de perte totale de l’ordinateur principal
4. Contacts utiles (technicien, hébergeur, autorité de protection des données)
5. Date du prochain test de restauration

**Livrable** : le plan validé par la direction et affiché au secrétariat.`,
            35,
          ),
        ],
      },
    ],
    quiz: {
      title: 'Évaluation finale — Cybersécurité',
      description: 'Vérifiez vos réflexes de protection numérique.',
      questions: [
        {
          prompt: 'Quel mot de passe est le plus solide ?',
          choices: ['12345678', 'kinshasa2026', 'Mangue-Verte-Tshopo-42!', 'motdepasse'],
          correctIndex: 2,
          explanation: 'Une phrase de passe longue et variée résiste bien mieux aux attaques.',
        },
        {
          prompt: 'Que signifie la règle 3-2-1 en sauvegarde ?',
          choices: [
            'Trois utilisateurs, deux mots de passe, un serveur',
            'Trois copies, deux supports, une copie hors site',
            'Trois sauvegardes le même jour',
            'Trois antivirus',
          ],
          correctIndex: 1,
          explanation: 'Elle garantit qu’un sinistre local ne détruit pas toutes les copies.',
        },
        {
          prompt: 'Un message du « directeur » demande un virement urgent et confidentiel. Que faites-vous ?',
          choices: [
            'Je paie immédiatement',
            'Je vérifie par un appel au numéro connu, hors du message',
            'Je réponds par e-mail',
            'Je transfère à un collègue',
          ],
          correctIndex: 1,
          explanation: 'Seule une vérification par un canal indépendant permet de déjouer la fraude au président.',
        },
        {
          prompt: 'Première action en cas de suspicion d’intrusion ?',
          choices: [
            'Publier sur les réseaux sociaux',
            'Confiner : isoler la machine ou le compte compromis',
            'Éteindre brutalement sans rien noter',
            'Attendre quelques jours',
          ],
          correctIndex: 1,
          explanation: 'Le confinement limite la propagation avant le traitement et la restauration.',
        },
        {
          prompt: 'Quel principe s’applique à la collecte de données personnelles ?',
          choices: [
            'Collecter le maximum de données',
            'Ne collecter que ce qui est nécessaire à une finalité précise',
            'Conserver indéfiniment',
            'Partager librement',
          ],
          correctIndex: 1,
          explanation: 'Le principe de minimisation impose de limiter la collecte à la finalité poursuivie.',
        },
      ],
    },
  },
];
