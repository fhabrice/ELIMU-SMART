/**
 * Données de démonstration pour SMART-ELIMU School.
 *
 * Les établissements ci-dessous sont fictifs mais respectent la structure réelle
 * du système éducatif congolais (codes d'identification, sections, provinces).
 */

export type SeedClass = {
  name: string;
  level: string;
  section: string | null;
  room: string;
  capacity: number;
};

export type SeedSchool = {
  name: string;
  code: string;
  type: 'PRIMAIRE' | 'SECONDAIRE' | 'MIXTE' | 'PROFESSIONNEL' | 'SUPERIEUR';
  city: string;
  province: string;
  address: string;
  phone: string;
  email: string;
  directorName: string;
  motto: string;
  logoEmoji: string;
  coverColor: string;
  capacity: number;
  /** Frais scolaires annuels de référence, en francs congolais. */
  annualFeeCdf: number;
  ownerEmail: string;
  classCount: number;
  teacherCount: number;
  studentCount: number;
  subjects: string[];
  classes: SeedClass[];
};

const SUBJECTS_PRIMARY = [
  'Français',
  'Mathématiques',
  'Sciences',
  'Étude du milieu',
  'Éducation civique et morale',
  'Dessin',
  'Éducation physique',
];

const SUBJECTS_SECONDARY = [
  'Mathématiques',
  'Français',
  'Anglais',
  'Physique',
  'Chimie',
  'Biologie',
  'Histoire',
  'Géographie',
  'Informatique',
  'Éducation civique et morale',
];

export const TEACHER_QUALIFICATIONS = [
  'Licence en pédagogie appliquée',
  'Graduat en pédagogie générale',
  'Licence en sciences',
  'Licence en lettres',
  'Licence en gestion',
  'Master en didactique',
];

export const FIRST_NAMES_M = [
  'Joseph', 'Patrick', 'Merveil', 'Christian', 'Éric', 'Dieumerci', 'Blaise', 'Junior', 'Emmanuel',
  'Gédéon', 'Fiston', 'Trésor', 'Yannick', 'Pascal', 'Serge', 'Cédric', 'Héritier', 'Nathan',
  'Moïse', 'Bénédict', 'Aristote', 'Jonathan', 'Prince', 'Sage',
];

export const FIRST_NAMES_F = [
  'Grâce', 'Esther', 'Divine', 'Ruth', 'Rachel', 'Naomi', 'Bénédicte', 'Sarah', 'Esperance',
  'Jeanine', 'Clarisse', 'Gloria', 'Rosalie', 'Prisca', 'Merveille', 'Chantal', 'Nadine',
  'Fifi', 'Léonie', 'Sifa', 'Rebecca', 'Hortense', 'Cynthia', 'Deborah',
];

export const LAST_NAMES = [
  'Mutyebele', 'Nsimba', 'Bahati', 'Ilunga', 'Kabongo', 'Tshibanda', 'Mbuyi', 'Bakala', 'Mbala',
  'Kanyinda', 'Lukusa', 'Mabika', 'Nyembo', 'Tshimanga', 'Kambale', 'Muhindo', 'Ngoy', 'Kasongo',
  'Mukendi', 'Bofasa', 'Landu', 'Wemba', 'Sefu', 'Nkulu', 'Kilumba', 'Kayembe', 'Muzungu',
  'Rukundo', 'Ndour', 'Hakizimana',
];

export const GUARDIAN_RELATIONS = ['Père', 'Mère', 'Oncle', 'Tante', 'Tuteur', 'Grand-frère'];

export const PLACES_OF_BIRTH = [
  'Kinshasa', 'Goma', 'Bukavu', 'Lubumbashi', 'Kisangani', 'Mbuji-Mayi', 'Kananga', 'Matadi',
  'Kolwezi', 'Bunia', 'Beni', 'Uvira', 'Kikwit', 'Tshikapa', 'Butembo',
];

export const SCHOOLS: SeedSchool[] = [
  {
    name: 'Complexe Scolaire Espoir de Kinshasa',
    code: 'EP-KIN-0147',
    type: 'MIXTE',
    city: 'Kinshasa',
    province: 'Kinshasa',
    address: '12, avenue de la Justice, commune de Gombe',
    phone: '+243 812 345 678',
    email: 'direction@cs-espoir.cd',
    directorName: 'Madame Rachel Ilunga',
    motto: 'Discipline — Travail — Excellence',
    logoEmoji: '🏛️',
    coverColor: '#0d2a6b',
    capacity: 840,
    annualFeeCdf: 450000,
    ownerEmail: 'direction@cs-espoir.cd',
    classCount: 7,
    teacherCount: 14,
    studentCount: 168,
    subjects: SUBJECTS_SECONDARY,
    classes: [
      { name: '1ère Commerciale A', level: '1ère année secondaire', section: 'Commerciale', room: 'B1', capacity: 45 },
      { name: '1ère Scientifique A', level: '1ère année secondaire', section: 'Scientifique', room: 'B2', capacity: 45 },
      { name: '2ème Scientifique A', level: '2ème année secondaire', section: 'Scientifique', room: 'B3', capacity: 45 },
      { name: '3ème Sciences Comptables', level: '3ème année secondaire', section: 'Sciences commerciales', room: 'C1', capacity: 45 },
      { name: '4ème Électricité', level: '4ème année secondaire', section: 'Technique de qualification', room: 'C2', capacity: 40 },
      { name: '5ème Commerciale', level: '5ème année secondaire', section: 'Commerciale', room: 'A1', capacity: 45 },
      { name: '6ème Biologie-Chimie', level: '6ème année secondaire', section: 'Scientifique', room: 'A2', capacity: 45 },
    ],
  },
  {
    name: 'Institut Saint-Joseph de Goma',
    code: 'IS-NK-0231',
    type: 'SECONDAIRE',
    city: 'Goma',
    province: 'Nord-Kivu',
    address: '45, avenue du Volcan, quartier Les Volcans',
    phone: '+243 994 112 233',
    email: 'direction@isj-goma.cd',
    directorName: 'Monsieur Patrick Kambale',
    motto: 'Science, foi et service',
    logoEmoji: '🌋',
    coverColor: '#1e5f8a',
    capacity: 660,
    annualFeeCdf: 380000,
    ownerEmail: 'direction@isj-goma.cd',
    classCount: 6,
    teacherCount: 12,
    studentCount: 132,
    subjects: SUBJECTS_SECONDARY,
    classes: [
      { name: '1ère Pédagogie Générale', level: '1ère année secondaire', section: 'Pédagogie générale', room: 'P1', capacity: 40 },
      { name: '2ème Latin-Philosophie', level: '2ème année secondaire', section: 'Latin-Philosophie', room: 'P2', capacity: 40 },
      { name: '3ème Pédagogie', level: '3ème année secondaire', section: 'Pédagogie générale', room: 'P3', capacity: 40 },
      { name: '4ème Commerciale', level: '4ème année secondaire', section: 'Commerciale', room: 'C1', capacity: 45 },
      { name: '5ème Scientifique', level: '5ème année secondaire', section: 'Scientifique', room: 'S1', capacity: 45 },
      { name: '6ème Pédagogie Générale', level: '6ème année secondaire', section: 'Pédagogie générale', room: 'S2', capacity: 40 },
    ],
  },
  {
    name: 'École Primaire Umoja de Lubumbashi',
    code: 'EP-HK-0058',
    type: 'PRIMAIRE',
    city: 'Lubumbashi',
    province: 'Haut-Katanga',
    address: '8, avenue Kamalondo, quartier Bel-Air',
    phone: '+243 822 556 677',
    email: 'direction@ep-umoja.cd',
    directorName: 'Madame Esther Mukendi',
    motto: 'Apprendre ensemble, réussir ensemble',
    logoEmoji: '📗',
    coverColor: '#0f6b4f',
    capacity: 600,
    annualFeeCdf: 180000,
    ownerEmail: 'direction@ep-umoja.cd',
    classCount: 5,
    teacherCount: 9,
    studentCount: 120,
    subjects: SUBJECTS_PRIMARY,
    classes: [
      { name: '1ère Année Primaire A', level: '1ère année primaire', section: null, room: 'A1', capacity: 60 },
      { name: '2ème Année Primaire A', level: '2ème année primaire', section: null, room: 'A2', capacity: 60 },
      { name: '3ème Année Primaire A', level: '3ème année primaire', section: null, room: 'A3', capacity: 60 },
      { name: '5ème Année Primaire A', level: '5ème année primaire', section: null, room: 'B1', capacity: 60 },
      { name: '6ème Année Primaire A', level: '6ème année primaire', section: null, room: 'B2', capacity: 60 },
    ],
  },
  {
    name: 'Complexe Scolaire La Réussite de Bukavu',
    code: 'CS-SK-0112',
    type: 'MIXTE',
    city: 'Bukavu',
    province: 'Sud-Kivu',
    address: '23, avenue Patrice-Emery Lumumba, commune d’Ibanda',
    phone: '+243 970 334 455',
    email: 'direction@cs-lareussite.cd',
    directorName: 'Monsieur Serge Bahati',
    motto: 'Le travail libère',
    logoEmoji: '🏔️',
    coverColor: '#6b3f0d',
    capacity: 540,
    annualFeeCdf: 300000,
    ownerEmail: 'direction@cs-lareussite.cd',
    classCount: 5,
    teacherCount: 10,
    studentCount: 120,
    subjects: SUBJECTS_SECONDARY,
    classes: [
      { name: '1ère Scientifique', level: '1ère année secondaire', section: 'Scientifique', room: 'S1', capacity: 40 },
      { name: '3ème Informatique', level: '3ème année secondaire', section: 'Sciences informatiques', room: 'I1', capacity: 40 },
      { name: '4ème Commerciale', level: '4ème année secondaire', section: 'Commerciale', room: 'C1', capacity: 40 },
      { name: '5ème Construction', level: '5ème année secondaire', section: 'Technique de qualification', room: 'T1', capacity: 40 },
      { name: '6ème Sciences Comptables', level: '6ème année secondaire', section: 'Sciences commerciales', room: 'C2', capacity: 40 },
    ],
  },
];
