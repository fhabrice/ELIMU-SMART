/**
 * Moteur d'orientation scolaire & académique SMART-ELIMU.
 *
 * Inspiré du modèle RIASEC de John Holland, adapté au contexte de la RDC :
 * six familles de profils, un questionnaire de 20 situations concrètes et une
 * correspondance directe vers les filières proposées par les partenaires.
 */

export const DIMENSIONS = {
  R: { code: 'R', label: 'Réaliste', fr: 'Concret & technique', emoji: '🔧' },
  I: { code: 'I', label: 'Investigateur', fr: 'Analyse & recherche', emoji: '🔬' },
  A: { code: 'A', label: 'Artistique', fr: 'Création & expression', emoji: '🎨' },
  S: { code: 'S', label: 'Social', fr: 'Aide & accompagnement', emoji: '🤝' },
  E: { code: 'E', label: 'Entreprenant', fr: 'Leadership & commerce', emoji: '🚀' },
  C: { code: 'C', label: 'Méthodique', fr: 'Organisation & gestion', emoji: '📊' },
} as const;

export type DimensionCode = keyof typeof DIMENSIONS;

export type OrientationOption = {
  id: string;
  label: string;
  scores: Partial<Record<DimensionCode, number>>;
};

export type OrientationQuestion = {
  id: string;
  prompt: string;
  hint?: string;
  options: OrientationOption[];
};

/** 20 situations concrètes, chacune avec 3 réponses possibles. */
export const ORIENTATION_QUESTIONS: OrientationQuestion[] = [
  {
    id: 'q1',
    prompt: 'Un village de ton territoire n’a pas accès à l’eau potable. Qu’est-ce que tu fais en premier ?',
    options: [
      { id: 'q1a', label: 'Je fabrique et installe une pompe avec une équipe locale', scores: { R: 3, I: 1 } },
      { id: 'q1b', label: 'J’étudie la qualité de l’eau et je propose une solution technique', scores: { I: 3, R: 1 } },
      { id: 'q1c', label: 'Je sensibilise la communauté et je cherche des financements', scores: { S: 2, E: 2 } },
    ],
  },
  {
    id: 'q2',
    prompt: 'Dans un projet d’équipe à l’école, quel rôle prends-tu naturellement ?',
    options: [
      { id: 'q2a', label: 'Celui qui organise le planning et vérifie le budget', scores: { C: 3, E: 1 } },
      { id: 'q2b', label: 'Celui qui présente le travail devant tout le monde', scores: { E: 3, S: 1 } },
      { id: 'q2c', label: 'Celui qui dessine, filme ou met en forme le résultat', scores: { A: 3, C: 1 } },
    ],
  },
  {
    id: 'q3',
    prompt: 'Quel contenu regardes-tu le plus volontiers sur ton téléphone ?',
    options: [
      { id: 'q3a', label: 'Des tutoriels pour réparer, construire ou cultiver', scores: { R: 3, I: 1 } },
      { id: 'q3b', label: 'Des débats, des documentaires et des analyses', scores: { I: 3, S: 1 } },
      { id: 'q3c', label: 'De la musique, du design, de la création', scores: { A: 3, S: 1 } },
    ],
  },
  {
    id: 'q4',
    prompt: 'En classe, une matière te passionne parce que…',
    options: [
      { id: 'q4a', label: 'on calcule, on mesure, on résout des problèmes chiffrés', scores: { C: 2, I: 2 } },
      { id: 'q4b', label: 'on démonte des mécanismes et on travaille de ses mains', scores: { R: 3, A: 1 } },
      { id: 'q4c', label: 'on raconte, on argumente, on explique aux autres', scores: { S: 3, E: 1 } },
    ],
  },
  {
    id: 'q5',
    prompt: 'On te confie la caisse d’une coopérative scolaire. Tu te sens…',
    options: [
      { id: 'q5a', label: 'Très à l’aise : j’aime tenir des comptes précis', scores: { C: 3, E: 1 } },
      { id: 'q5b', label: 'Motivé(e) : j’aime faire grandir et fructifier l’argent', scores: { E: 3, C: 1 } },
      { id: 'q5c', label: 'Gêné(e) : je préfère aider les personnes plutôt que l’argent', scores: { S: 3, A: 1 } },
    ],
  },
  {
    id: 'q6',
    prompt: 'Quel métier imagines-tu le plus facilement pour toi ?',
    options: [
      { id: 'q6a', label: 'Médecin, infirmier(ère) ou enseignant(e)', scores: { S: 3, I: 1 } },
      { id: 'q6b', label: 'Ingénieur(e), technicien(ne) ou mécanicien(ne)', scores: { R: 3, I: 2 } },
      { id: 'q6c', label: 'Entrepreneur(e), commerçant(e) ou responsable d’équipe', scores: { E: 3, C: 1 } },
    ],
  },
  {
    id: 'q7',
    prompt: 'Tu as une journée libre. Tu choisis…',
    options: [
      { id: 'q7a', label: 'Construire ou réparer quelque chose d’utile', scores: { R: 3, C: 1 } },
      { id: 'q7b', label: 'Lire, chercher, comprendre un phénomène nouveau', scores: { I: 3, A: 1 } },
      { id: 'q7c', label: 'Animer une activité avec les jeunes du quartier', scores: { S: 3, E: 1 } },
    ],
  },
  {
    id: 'q8',
    prompt: 'Face à un problème nouveau, ta première réaction est…',
    options: [
      { id: 'q8a', label: 'D’essayer concrètement jusqu’à ce que ça marche', scores: { R: 3, E: 1 } },
      { id: 'q8b', label: 'De chercher des informations et faire des hypothèses', scores: { I: 3, C: 1 } },
      { id: 'q8c', label: 'D’en parler autour de moi pour trouver une solution collective', scores: { S: 3, E: 1 } },
    ],
  },
  {
    id: 'q9',
    prompt: 'Dans un marché très concurrentiel, tu te démarques par…',
    options: [
      { id: 'q9a', label: 'La qualité technique de ton produit', scores: { R: 3, C: 1 } },
      { id: 'q9b', label: 'Ton sens de la négociation et du réseau', scores: { E: 3, S: 1 } },
      { id: 'q9c', label: 'L’originalité de l’emballage et du message', scores: { A: 3, E: 1 } },
    ],
  },
  {
    id: 'q10',
    prompt: 'Quelle réalisation te rendrait le plus fier(e) ?',
    options: [
      { id: 'q10a', label: 'Un pont, une route ou un système d’eau construit de mes mains', scores: { R: 3, C: 1 } },
      { id: 'q10b', label: 'Une découverte ou une publication scientifique', scores: { I: 3, C: 2 } },
      { id: 'q10c', label: 'Une œuvre, un film ou une chanson qui touche les gens', scores: { A: 3, S: 1 } },
    ],
  },
  {
    id: 'q11',
    prompt: 'Un élève a décroché depuis trois mois. Tu préfères…',
    options: [
      { id: 'q11a', label: 'L’écouter, comprendre sa situation et le raccompagner', scores: { S: 3, I: 1 } },
      { id: 'q11b', label: 'Analyser les statistiques d’abandon de l’école', scores: { I: 3, C: 2 } },
      { id: 'q11c', label: 'Mettre en place un règlement et un suivi rigoureux', scores: { C: 3, E: 1 } },
    ],
  },
  {
    id: 'q12',
    prompt: 'Quelle activité professionnelle correspond le mieux à ton tempérament ?',
    options: [
      { id: 'q12a', label: 'Rédiger, dessiner, photographier, mettre en scène', scores: { A: 3, C: 1 } },
      { id: 'q12b', label: 'Vendre, convaincre, ouvrir de nouveaux marchés', scores: { E: 3, S: 1 } },
      { id: 'q12c', label: 'Vérifier, classer, contrôler la conformité', scores: { C: 3, R: 1 } },
    ],
  },
  {
    id: 'q13',
    prompt: 'Ta manière d’apprendre la plus efficace :',
    options: [
      { id: 'q13a', label: 'Manipuler, fabriquer, faire un essai réel', scores: { R: 3, S: 1 } },
      { id: 'q13b', label: 'Lire des documents et prendre des notes structurées', scores: { C: 2, I: 2 } },
      { id: 'q13c', label: 'Expliquer la matière à un camarade', scores: { S: 3, A: 1 } },
    ],
  },
  {
    id: 'q14',
    prompt: 'Une ONG recrute dans ton quartier. Quel poste vises-tu ?',
    options: [
      { id: 'q14a', label: 'Chargé(e) de terrain avec les communautés', scores: { S: 3, E: 1 } },
      { id: 'q14b', label: 'Chargé(e) du suivi-évaluation et des données', scores: { C: 3, I: 2 } },
      { id: 'q14c', label: 'Responsable logistique et technique', scores: { R: 3, C: 2 } },
    ],
  },
  {
    id: 'q15',
    prompt: 'Créer ta propre activité à Kinshasa ou Goma, cela signifie pour toi :',
    options: [
      { id: 'q15a', label: 'Un défi excitant, je fonce et j’apprends vite', scores: { E: 3, S: 1 } },
      { id: 'q15b', label: 'Il faut d’abord un solide plan financier', scores: { C: 3, E: 1 } },
      { id: 'q15c', label: 'Je préfère concevoir un produit utile avant tout', scores: { R: 3, I: 1 } },
    ],
  },
  {
    id: 'q16',
    prompt: 'Ce qui te dérange le plus dans un travail :',
    options: [
      { id: 'q16a', label: 'La routine et le manque de créativité', scores: { A: 3, E: 1 } },
      { id: 'q16b', label: 'Le désordre et l’absence de méthode', scores: { C: 3, R: 1 } },
      { id: 'q16c', label: 'La solitude et l’absence de contact humain', scores: { S: 3, A: 1 } },
    ],
  },
  {
    id: 'q17',
    prompt: 'Pour aider ta communauté à se développer, tu proposes :',
    options: [
      { id: 'q17a', label: 'Une coopérative agricole avec des semences améliorées', scores: { R: 2, E: 2 } },
      { id: 'q17b', label: 'Un centre de santé et de prévention', scores: { S: 3, I: 2 } },
      { id: 'q17c', label: 'Une école numérique accessible à tous', scores: { I: 2, S: 2 } },
    ],
  },
  {
    id: 'q18',
    prompt: 'Quand tu écris un texte, on te complimente surtout sur…',
    options: [
      { id: 'q18a', label: 'Le style, l’image, la beauté des mots', scores: { A: 3, S: 1 } },
      { id: 'q18b', label: 'La rigueur du raisonnement et les sources', scores: { I: 3, C: 1 } },
      { id: 'q18c', label: 'La clarté du plan et des consignes', scores: { C: 3, E: 1 } },
    ],
  },
  {
    id: 'q19',
    prompt: 'Un poste de direction se libère dans une entreprise minière. Tu penses :',
    options: [
      { id: 'q19a', label: 'Je gérerais les équipes et les objectifs', scores: { E: 3, C: 2 } },
      { id: 'q19b', label: 'Je superviserais les opérations techniques sur le site', scores: { R: 3, C: 1 } },
      { id: 'q19c', label: 'Je négocierais la sécurité et les droits des travailleurs', scores: { S: 3, E: 1 } },
    ],
  },
  {
    id: 'q20',
    prompt: 'Dans dix ans, tu te vois plutôt…',
    options: [
      { id: 'q20a', label: 'À la tête de mon entreprise ou de mon cabinet', scores: { E: 3, C: 1 } },
      { id: 'q20b', label: 'Expert(e) reconnu(e) dans ma spécialité technique', scores: { I: 3, R: 2 } },
      { id: 'q20c', label: 'À former et accompagner la nouvelle génération', scores: { S: 3, A: 1 } },
    ],
  },
];

/** Familles de métiers et filières associées à chaque dimension. */
export const DIMENSION_FIELDS: Record<DimensionCode, { fields: string[]; careers: string[] }> = {
  R: {
    fields: ['Génie civil', 'Mécanique & Électromécanique', 'Électricité', 'Agriculture & Agronomie', 'Mines & Géologie'],
    careers: ['Ingénieur civil', 'Technicien électricien', 'Agronome', 'Géologue minier', 'Mécanicien industriel'],
  },
  I: {
    fields: ['Médecine & Santé', 'Informatique & Data', 'Sciences fondamentales', 'Pharmacie', 'Sciences environnementales'],
    careers: ['Médecin', 'Analyste de données', 'Développeur', 'Chercheur', 'Pharmacien'],
  },
  A: {
    fields: ['Arts visuels & Design', 'Communication & Médias', 'Architecture', 'Musique & Spectacle', 'Mode & Textile'],
    careers: ['Designer graphique', 'Journaliste', 'Architecte', 'Réalisateur', 'Directeur artistique'],
  },
  S: {
    fields: ['Sciences de l’éducation', 'Travail social', 'Santé communautaire', 'Droit & Justice', 'Psychologie'],
    careers: ['Enseignant', 'Assistant social', 'Infirmier', 'Juriste', 'Psychologue'],
  },
  E: {
    fields: ['Sciences commerciales', 'Entrepreneuriat', 'Marketing & Vente', 'Tourisme & Hôtellerie', 'Gestion des entreprises'],
    careers: ['Entrepreneur', 'Directeur commercial', 'Chef de projet', 'Gestionnaire hôtelier', 'Consultant'],
  },
  C: {
    fields: ['Comptabilité & Finances', 'Administration publique', 'Statistiques', 'Logistique & Transport', 'Audit & Contrôle'],
    careers: ['Comptable', 'Auditeur', 'Administrateur public', 'Gestionnaire logistique', 'Analyste financier'],
  },
};

export type OrientationOutcome = {
  scores: Record<DimensionCode, number>;
  ranked: DimensionCode[];
  profileCode: string;
  profileLabel: string;
  profileSummary: string;
  topFields: string[];
  topCareers: string[];
};

/** Agrège les réponses au questionnaire et produit le profil d'orientation. */
export function computeOrientationProfile(answers: Record<string, string>): OrientationOutcome {
  const scores: Record<DimensionCode, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  for (const question of ORIENTATION_QUESTIONS) {
    const chosenId = answers[question.id];
    if (!chosenId) continue;
    const option = question.options.find((item) => item.id === chosenId);
    if (!option) continue;
    for (const [dimension, value] of Object.entries(option.scores)) {
      scores[dimension as DimensionCode] += value ?? 0;
    }
  }

  const ranked = (Object.keys(scores) as DimensionCode[]).sort((a, b) => scores[b] - scores[a]);
  const [first, second, third] = ranked;

  const profileCode = `${first}${second}${third}`;
  const profileLabel = `${DIMENSIONS[first].label} · ${DIMENSIONS[second].label}`;
  const profileSummary =
    `Ton profil dominant est « ${DIMENSIONS[first].label} » (${DIMENSIONS[first].fr}), ` +
    `suivi de « ${DIMENSIONS[second].label} » (${DIMENSIONS[second].fr}) et de « ${DIMENSIONS[third].label} » ` +
    `(${DIMENSIONS[third].fr}). Tu t’épanouis dans les activités où tu peux ${DIMENSIONS[first].fr.toLowerCase()} ` +
    `tout en t’appuyant sur ${DIMENSIONS[second].fr.toLowerCase()}.`;

  const fieldSet = new Set<string>([
    ...DIMENSION_FIELDS[first].fields,
    ...DIMENSION_FIELDS[second].fields,
    ...DIMENSION_FIELDS[third].fields.slice(0, 3),
  ]);
  const careerSet = new Set<string>([
    ...DIMENSION_FIELDS[first].careers,
    ...DIMENSION_FIELDS[second].careers,
  ]);

  return {
    scores,
    ranked,
    profileCode,
    profileLabel,
    profileSummary,
    topFields: [...fieldSet].slice(0, 8),
    topCareers: [...careerSet].slice(0, 8),
  };
}

/**
 * Score maximal atteignable pour chaque dimension (utilisé pour les barres
 * de progression du rapport d'orientation).
 */
export function maxScoresByDimension(): Record<DimensionCode, number> {
  const totals: Record<DimensionCode, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const question of ORIENTATION_QUESTIONS) {
    for (const code of Object.keys(totals) as DimensionCode[]) {
      const best = Math.max(...question.options.map((option) => option.scores[code] ?? 0));
      totals[code] += best;
    }
  }
  return totals;
}
