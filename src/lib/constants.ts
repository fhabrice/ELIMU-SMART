/**
 * Constantes métier SMART-ELIMU.
 * SQLite ne supportant pas les enums Prisma, toutes les valeurs catégorielles
 * sont centralisées ici et validées côté application.
 */

export const ROLES = {
  LEARNER: 'LEARNER',
  TEACHER: 'TEACHER',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  PARTNER: 'PARTNER',
  ADMIN: 'ADMIN',
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<string, { fr: string; en: string; color: string }> = {
  LEARNER: { fr: 'Apprenant', en: 'Learner', color: 'bg-elimu-100 text-elimu-800' },
  TEACHER: { fr: 'Enseignant / Formateur', en: 'Teacher / Trainer', color: 'bg-emerald-100 text-emerald-800' },
  SCHOOL_ADMIN: { fr: 'Direction d’établissement', en: 'School administrator', color: 'bg-gold-100 text-gold-800' },
  PARTNER: { fr: 'Partenaire académique', en: 'Academic partner', color: 'bg-purple-100 text-purple-800' },
  ADMIN: { fr: 'Administrateur SMART-ELIMU', en: 'SMART-ELIMU administrator', color: 'bg-slate-200 text-slate-800' },
};

export const PARTNER_TYPES = {
  UNIVERSITY: 'UNIVERSITY',
  TRAINING_CENTER: 'TRAINING_CENTER',
  INSTITUTE: 'INSTITUTE',
  HIGH_SCHOOL: 'HIGH_SCHOOL',
} as const;

export const PARTNER_TYPE_LABELS: Record<string, { fr: string; en: string; emoji: string }> = {
  UNIVERSITY: { fr: 'Université', en: 'University', emoji: '🎓' },
  TRAINING_CENTER: { fr: 'Centre de formation', en: 'Training centre', emoji: '🛠️' },
  INSTITUTE: { fr: 'Institut supérieur', en: 'Higher institute', emoji: '🏛️' },
  HIGH_SCHOOL: { fr: 'École secondaire partenaire', en: 'Partner high school', emoji: '🏫' },
};

export const COURSE_CATEGORIES = [
  'Informatique & Numérique',
  'Gestion & Entrepreneuriat',
  'Santé & Bien-être',
  'Langues & Communication',
  'Éducation & Pédagogie',
  'Agriculture & Environnement',
  'Mines & Industrie',
  'Métiers techniques',
  'Leadership & Citoyenneté',
  'Finance & Comptabilité',
] as const;

export const COURSE_LEVELS = {
  DEBUTANT: 'DEBUTANT',
  INTERMEDIAIRE: 'INTERMEDIAIRE',
  AVANCE: 'AVANCE',
} as const;

export const COURSE_LEVEL_LABELS: Record<string, { fr: string; en: string; short: string }> = {
  DEBUTANT: { fr: 'Débutant', en: 'Beginner', short: 'Débutant' },
  INTERMEDIAIRE: { fr: 'Intermédiaire', en: 'Intermediate', short: 'Interm.' },
  AVANCE: { fr: 'Avancé', en: 'Advanced', short: 'Avancé' },
};

export const LESSON_TYPES = {
  TEXTE: { fr: 'Lecture', icon: '📄' },
  VIDEO: { fr: 'Vidéo', icon: '🎬' },
  ATELIER: { fr: 'Atelier pratique', icon: '🧪' },
  QUIZ: { fr: 'Évaluation', icon: '✅' },
} as const;

export const PROVINCES_RDC = [
  'Kinshasa',
  'Kongo-Central',
  'Kwango',
  'Kwilu',
  'Mai-Ndombe',
  'Équateur',
  'Mongala',
  'Nord-Ubangi',
  'Sud-Ubangi',
  'Tshuapa',
  'Tshopo',
  'Bas-Uélé',
  'Haut-Uélé',
  'Ituri',
  'Nord-Kivu',
  'Sud-Kivu',
  'Maniema',
  'Tanganyika',
  'Haut-Katanga',
  'Lualaba',
  'Haut-Lomami',
  'Kasaï',
  'Kasaï-Central',
  'Kasaï-Oriental',
  'Lomami',
  'Sankuru',
] as const;

export const SCHOOL_TYPES = {
  PRIMAIRE: { fr: 'École primaire', en: 'Primary school' },
  SECONDAIRE: { fr: 'École secondaire', en: 'Secondary school' },
  MIXTE: { fr: 'Primaire & secondaire', en: 'Primary & secondary' },
  TECHNIQUE: { fr: 'École technique & professionnelle', en: 'Technical & vocational school' },
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: { fr: 'Présent', en: 'Present', color: 'bg-emerald-100 text-emerald-800' },
  ABSENT: { fr: 'Absent', en: 'Absent', color: 'bg-rose-100 text-rose-800' },
  RETARD: { fr: 'Retard', en: 'Late', color: 'bg-gold-100 text-gold-800' },
  EXCUSE: { fr: 'Excusé', en: 'Excused', color: 'bg-slate-100 text-slate-700' },
} as const;

export const PERIODS = ['T1', 'T2', 'T3'] as const;

export const PAYMENT_METHODS = {
  MOBILE_MONEY: { fr: 'Mobile Money (M-Pesa / Orange / Airtel)', en: 'Mobile money' },
  ESPECES: { fr: 'Espèces', en: 'Cash' },
  VIREMENT: { fr: 'Virement bancaire', en: 'Bank transfer' },
  BANQUE: { fr: 'Dépôt bancaire', en: 'Bank deposit' },
} as const;

export const INVOICE_STATUS = {
  IMPAYE: { fr: 'Impayé', en: 'Unpaid', color: 'bg-rose-100 text-rose-800' },
  PARTIEL: { fr: 'Partiel', en: 'Partial', color: 'bg-gold-100 text-gold-800' },
  PAYE: { fr: 'Payé', en: 'Paid', color: 'bg-emerald-100 text-emerald-800' },
  ANNULE: { fr: 'Annulé', en: 'Cancelled', color: 'bg-slate-100 text-slate-600' },
} as const;

/** Taux indicatif utilisé pour afficher des équivalences CDF ↔ USD. */
export const USD_TO_CDF = 2800;

/** Matières du cursus secondaire congolais (utilisées dans la saisie de notes). */
export const SECONDARY_SUBJECTS = [
  'Mathématiques',
  'Français',
  'Anglais',
  'Physique',
  'Chimie',
  'Biologie',
  'Histoire',
  'Géographie',
  'Éducation civique et morale',
  'Informatique',
  'Éducation physique',
  'Religion',
  'Technologie',
  'Comptabilité',
] as const;

/** Libellés d'appréciation selon la moyenne congolaise (sur 100, seuil de réussite 50 %). */
export function mentionFromAverage(average: number): string {
  if (average >= 85) return 'Excellent';
  if (average >= 75) return 'Très bien';
  if (average >= 65) return 'Bien';
  if (average >= 55) return 'Satisfaisant';
  if (average >= 50) return 'Suffisant';
  return 'Insuffisant';
}

export function decisionFromAverage(average: number): string {
  return average >= 50 ? 'Réussi(e)' : 'Échec — à reprendre';
}
