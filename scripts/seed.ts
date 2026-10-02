/**
 * Peuplement de la base SMART-ELIMU avec un jeu de données de démonstration
 * complet : partenaires, filières, bourses, catalogue de formations certifiantes,
 * établissements scolaires (élèves, notes, présences, frais) et rapports
 * d'orientation.
 *
 *   npm run db:setup   → réinitialise et peuple la base
 *   npm run db:reset   → supprime les fichiers puis reconstruit tout
 */
import './load-env';
import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { getDb, insert, transaction, dbInfo } from '../src/lib/sqlite';
import { slugify } from '../src/lib/utils';
import { PARTNERS, SCHOLARSHIPS } from './data/partners';
import { COURSES_PART_1 } from './data/courses-1';
import { COURSES_PART_2 } from './data/courses-2';
import type { SeedCourse } from './data/types';
import {
  SCHOOLS,
  FIRST_NAMES_M,
  FIRST_NAMES_F,
  LAST_NAMES,
  PLACES_OF_BIRTH,
  GUARDIAN_RELATIONS,
  TEACHER_QUALIFICATIONS,
} from './data/schools';
import { ORIENTATION_QUESTIONS, computeOrientationProfile } from '../src/lib/orientation';

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------

/** Générateur pseudo-aléatoire déterministe (mêmes données à chaque exécution). */
function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(20260930);
const pick = <T,>(items: readonly T[]): T => items[Math.floor(random() * items.length)];
const between = (min: number, max: number) => Math.floor(random() * (max - min + 1)) + min;

const now = new Date();
const iso = (date: Date) => date.toISOString();
const daysAgo = (days: number, hour = 8) => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  date.setHours(hour, between(0, 59), 0, 0);
  return date;
};
const daysFromNow = (days: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date;
};
const dateOnly = (date: Date) => date.toISOString().slice(0, 10);

/** Année scolaire courante (bascule en août, comme en RDC). */
function currentAcademicYear(): string {
  const year = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  return `${year}-${year + 1}`;
}

const ACADEMIC_YEAR = currentAcademicYear();
const PASSWORD = 'elimu2026';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function certificateCode(year: number): string {
  const block = (size: number) =>
    Array.from({ length: size }, () => CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)]).join('');
  return `SE-${year}-${block(4)}-${block(4)}`;
}

let shareCounter = 0;
function shareCode(): string {
  shareCounter += 1;
  const block = (size: number) =>
    Array.from({ length: size }, () => CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)]).join('');
  return `OR-${now.getFullYear()}-${block(4)}-${String(shareCounter).padStart(2, '0')}${block(2)}`;
}

const AVATAR_COLORS = ['#1c60f0', '#0d2a6b', '#db7b02', '#0f766e', '#7c3aed', '#be123c', '#15803d'];

// ---------------------------------------------------------------------------
// Point d'entrée
// ---------------------------------------------------------------------------

async function main() {
  const keep = process.argv.includes('--keep');

  if (!keep) {
    for (const suffix of ['', '-wal', '-shm']) {
      const file = `${dbInfo.file}${suffix}`;
      if (fs.existsSync(file)) fs.rmSync(file);
    }
    console.log('• Base précédente supprimée');
  }

  // La création des tables est déclenchée par getDb().
  getDb();
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  transaction(() => {
    const users = seedUsers(passwordHash);
    const partners = seedPartners();
    seedScholarships(partners);
    const courses = seedCourses(users, partners);
    seedLearningActivity(users, courses, passwordHash);
    seedOrientationResults(users);
    seedSchools(users);
    seedRequestsAndApplications(users, partners);
  });

  const db = getDb();
  const counts = {
    utilisateurs: db.prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number },
    partenaires: db.prepare('SELECT COUNT(*) AS n FROM partners').get() as { n: number },
    filières: db.prepare('SELECT COUNT(*) AS n FROM programs').get() as { n: number },
    formations: db.prepare('SELECT COUNT(*) AS n FROM courses').get() as { n: number },
    leçons: db.prepare('SELECT COUNT(*) AS n FROM lessons').get() as { n: number },
    questions: db.prepare('SELECT COUNT(*) AS n FROM quiz_questions').get() as { n: number },
    écoles: db.prepare('SELECT COUNT(*) AS n FROM schools').get() as { n: number },
    élèves: db.prepare('SELECT COUNT(*) AS n FROM students').get() as { n: number },
    notes: db.prepare('SELECT COUNT(*) AS n FROM grades').get() as { n: number },
    présences: db.prepare('SELECT COUNT(*) AS n FROM attendances').get() as { n: number },
    factures: db.prepare('SELECT COUNT(*) AS n FROM invoices').get() as { n: number },
    certificats: db.prepare('SELECT COUNT(*) AS n FROM certificates').get() as { n: number },
  };

  console.log('\n✅ Base SMART-ELIMU peuplée :', dbInfo.file);
  for (const [label, value] of Object.entries(counts)) {
    console.log(`   ${label.padEnd(14)} ${value.n}`);
  }
  console.log(`\n   Année scolaire : ${ACADEMIC_YEAR}`);
  console.log('   Comptes de démonstration (mot de passe : ' + PASSWORD + ')');
  console.log('   • admin@smart-elimu.cd        administration de la plateforme');
  console.log('   • apprenant@smart-elimu.cd    apprenant (formations + certificats)');
  console.log('   • direction@cs-espoir.cd      direction d’établissement scolaire');
  console.log('   • formateur@smart-elimu.cd    formateur / enseignant');
  console.log('   • partenaire@unv-kinshasa.cd  partenaire académique\n');
}

// ---------------------------------------------------------------------------
// 1. Utilisateurs
// ---------------------------------------------------------------------------

type UserMap = Record<string, string>;

function seedUsers(passwordHash: string): UserMap {
  const people: {
    key: string;
    name: string;
    email: string;
    role: string;
    headline: string;
    city: string;
    province: string;
    phone: string;
  }[] = [
    {
      key: 'admin',
      name: 'Direction SMART-ELIMU',
      email: 'admin@smart-elimu.cd',
      role: 'ADMIN',
      headline: 'Équipe nationale de la plateforme',
      city: 'Kinshasa',
      province: 'Kinshasa',
      phone: '+243 800 000 001',
    },
    {
      key: 'learner',
      name: 'Grâce Nsimba',
      email: 'apprenant@smart-elimu.cd',
      role: 'LEARNER',
      headline: 'Étudiante en gestion, passionnée de bureautique et de comptabilité',
      city: 'Kinshasa',
      province: 'Kinshasa',
      phone: '+243 820 000 002',
    },
    {
      key: 'schoolEspoir',
      name: 'Béatrice Mulumba',
      email: 'direction@cs-espoir.cd',
      role: 'SCHOOL_ADMIN',
      headline: 'Directrice du Complexe Scolaire Espoir de Kinshasa',
      city: 'Kinshasa',
      province: 'Kinshasa',
      phone: '+243 812 100 200',
    },
    {
      key: 'schoolGoma',
      name: 'Pascal Kambale',
      email: 'direction@isj-goma.cd',
      role: 'SCHOOL_ADMIN',
      headline: 'Préfet des études à l’Institut Saint-Joseph de Goma',
      city: 'Goma',
      province: 'Nord-Kivu',
      phone: '+243 992 100 201',
    },
    {
      key: 'schoolUmoja',
      name: 'Adolphine Kabeya',
      email: 'direction@ep-umoja.cd',
      role: 'SCHOOL_ADMIN',
      headline: 'Directrice de l’École Primaire Umoja de Lubumbashi',
      city: 'Lubumbashi',
      province: 'Haut-Katanga',
      phone: '+243 971 100 202',
    },
    {
      key: 'schoolBukavu',
      name: 'Innocent Muteba',
      email: 'direction@cs-lareussite.cd',
      role: 'SCHOOL_ADMIN',
      headline: 'Directeur du Complexe Scolaire La Réussite de Bukavu',
      city: 'Bukavu',
      province: 'Sud-Kivu',
      phone: '+243 993 100 203',
    },
    {
      key: 'formateur',
      name: 'Joseph Kabongo',
      email: 'formateur@smart-elimu.cd',
      role: 'TEACHER',
      headline: 'Formateur en agriculture durable et sécurité au travail',
      city: 'Bukavu',
      province: 'Sud-Kivu',
      phone: '+243 993 200 300',
    },
    {
      key: 'patrick',
      name: 'Patrick Ilunga',
      email: 'patrick.ilunga@smart-elimu.cd',
      role: 'TEACHER',
      headline: 'Ingénieur logiciel, formateur en informatique et cybersécurité',
      city: 'Kinshasa',
      province: 'Kinshasa',
      phone: '+243 815 300 400',
    },
    {
      key: 'grace',
      name: 'Grâce Mbuyi',
      email: 'grace.mbuyi@smart-elimu.cd',
      role: 'TEACHER',
      headline: 'Experte-comptable et formatrice en gestion d’entreprise',
      city: 'Lubumbashi',
      province: 'Haut-Katanga',
      phone: '+243 971 400 500',
    },
    {
      key: 'esther',
      name: 'Esther Mukendi',
      email: 'esther.mukendi@smart-elimu.cd',
      role: 'TEACHER',
      headline: 'Infirmière diplômée et formatrice en santé communautaire',
      city: 'Kinshasa',
      province: 'Kinshasa',
      phone: '+243 818 500 600',
    },
    {
      key: 'partner',
      name: 'Serge Lubaki',
      email: 'partenaire@unv-kinshasa.cd',
      role: 'PARTNER',
      headline: 'Directeur des partenariats — Université Nouvelle Vision',
      city: 'Kinshasa',
      province: 'Kinshasa',
      phone: '+243 812 000 101',
    },
  ];

  const map: UserMap = {};
  people.forEach((person, index) => {
    map[person.key] = insert('users', {
      name: person.name,
      email: person.email,
      passwordHash,
      role: person.role,
      phone: person.phone,
      city: person.city,
      province: person.province,
      country: 'RDC',
      locale: 'fr',
      headline: person.headline,
      avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
      isActive: true,
      createdAt: iso(daysAgo(320 - index * 18)),
    });
  });

  return map;
}

// ---------------------------------------------------------------------------
// 2. Partenaires, filières et bourses
// ---------------------------------------------------------------------------

type PartnerMap = Record<string, string>;

function seedPartners(): PartnerMap {
  const map: PartnerMap = {};
  PARTNERS.forEach((partner, index) => {
    const partnerId = insert('partners', {
      name: partner.name,
      slug: partner.slug,
      type: partner.type,
      city: partner.city,
      province: partner.province,
      country: 'RDC',
      logoEmoji: partner.logoEmoji,
      coverColor: partner.coverColor,
      description: partner.description,
      website: partner.website ?? null,
      email: partner.email,
      phone: partner.phone,
      accreditation: partner.accreditation,
      status: partner.status ?? 'ACTIVE',
      foundedYear: partner.foundedYear,
      studentsCount: partner.studentsCount,
      isFeatured: Boolean(partner.isFeatured),
      createdAt: iso(daysAgo(300 - index * 12)),
    });
    map[partner.slug] = partnerId;

    partner.programs.forEach((program, programIndex) => {
      insert('programs', {
        partnerId,
        name: program.name,
        field: program.field,
        degree: program.degree,
        durationMonths: program.durationMonths,
        language: program.language ?? 'fr',
        tuitionUsd: program.tuitionUsd,
        requirements: program.requirements,
        description: program.description,
        careers: program.careers,
        pathwayTags: program.pathwayTags,
        isFeatured: Boolean(program.isFeatured),
        createdAt: iso(daysAgo(280 - index * 10 - programIndex)),
      });
    });
  });
  return map;
}

function seedScholarships(partners: PartnerMap) {
  SCHOLARSHIPS.forEach((scholarship, index) => {
    insert('scholarships', {
      partnerId: scholarship.partnerSlug ? partners[scholarship.partnerSlug] : null,
      title: scholarship.title,
      organization: scholarship.organization,
      level: scholarship.level,
      amountUsd: scholarship.amountUsd,
      deadline: iso(daysFromNow(scholarship.daysFromNow)),
      description: scholarship.description,
      eligibility: scholarship.eligibility,
      url: scholarship.url ?? null,
      isActive: true,
      createdAt: iso(daysAgo(60 - index * 3)),
    });
  });
}

// ---------------------------------------------------------------------------
// 3. Formations certifiantes
// ---------------------------------------------------------------------------

type CourseMap = Record<string, { id: string; title: string; priceUsd: number; lessonIds: string[]; quizId: string }>;

function seedCourses(users: UserMap, partners: PartnerMap): CourseMap {
  const catalogue: SeedCourse[] = [...COURSES_PART_1, ...COURSES_PART_2];
  const map: CourseMap = {};

  catalogue.forEach((course, courseIndex) => {
    const courseId = insert('courses', {
      title: course.title,
      slug: slugify(course.title),
      summary: course.summary,
      description: course.description,
      category: course.category,
      level: course.level,
      language: course.language,
      durationHours: course.durationHours,
      priceUsd: course.priceUsd,
      priceCdf: Math.round((course.priceUsd * 2800) / 500) * 500,
      isCertifying: true,
      certificateTitle: `Certificat professionnel — ${course.title}`,
      coverEmoji: course.coverEmoji,
      coverColor: course.coverColor,
      partnerId: course.partnerSlug ? partners[course.partnerSlug] ?? null : null,
      instructorId: instructorIdFor(course.instructorEmail, users),
      status: 'PUBLISHED',
      rating: course.rating,
      learnersCount: course.learnersCount,
      createdAt: iso(daysAgo(260 - courseIndex * 8)),
    });

    const lessonIds: string[] = [];

    course.modules.forEach((module, moduleIndex) => {
      const moduleId = insert('course_modules', {
        courseId,
        title: module.title,
        summary: module.summary ?? null,
        position: moduleIndex,
      });

      module.lessons.forEach((lesson, lessonIndex) => {
        const lessonId = insert('lessons', {
          moduleId,
          title: lesson.title,
          type: lesson.type ?? 'TEXTE',
          durationMin: lesson.durationMin ?? 12,
          content: lesson.content,
          videoUrl: null,
          resourceUrl: null,
          position: lessonIndex,
        });
        lessonIds.push(lessonId);
      });
    });

    const quizId = insert('quizzes', {
      courseId,
      title: course.quiz.title,
      description: course.quiz.description,
      passingScore: 70,
      position: 0,
    });

    course.quiz.questions.forEach((question, questionIndex) => {
      insert('quiz_questions', {
        quizId,
        prompt: question.prompt,
        choices: question.choices,
        correctIndex: question.correctIndex,
        explanation: question.explanation,
        points: 1,
        position: questionIndex,
      });
    });

    map[course.title] = { id: courseId, title: course.title, priceUsd: course.priceUsd, lessonIds, quizId };
  });

  return map;
}

function instructorIdFor(email: string | undefined, users: UserMap): string | null {
  if (!email) return null;
  const byEmail: Record<string, string> = {
    'patrick.ilunga@smart-elimu.cd': users.patrick,
    'grace.mbuyi@smart-elimu.cd': users.grace,
    'esther.mukendi@smart-elimu.cd': users.esther,
    'joseph.kabongo@smart-elimu.cd': users.formateur,
  };
  return byEmail[email] ?? null;
}

// ---------------------------------------------------------------------------
// 4. Apprenants, inscriptions, progression et certificats
// ---------------------------------------------------------------------------

const EXTRA_LEARNERS = [
  { name: 'Divine Bahati', email: 'divine.bahati@example.cd', city: 'Goma', province: 'Nord-Kivu' },
  { name: 'Merveil Tshibanda', email: 'merveil.tshibanda@example.cd', city: 'Lubumbashi', province: 'Haut-Katanga' },
  { name: 'Furaha Mwamba', email: 'furaha.mwamba@example.cd', city: 'Bukavu', province: 'Sud-Kivu' },
  { name: 'Trésor Ngoyi', email: 'tresor.ngoyi@example.cd', city: 'Kananga', province: 'Kasaï-Central' },
  { name: 'Neema Kambale', email: 'neema.kambale@example.cd', city: 'Butembo', province: 'Nord-Kivu' },
  { name: 'Rodrigue Lukusa', email: 'rodrigue.lukusa@example.cd', city: 'Matadi', province: 'Kongo-Central' },
  { name: 'Ornella Mujinga', email: 'ornella.mujinga@example.cd', city: 'Mbuji-Mayi', province: 'Kasaï-Oriental' },
  { name: 'Méchack Sefu', email: 'mechack.sefu@example.cd', city: 'Kisangani', province: 'Tshopo' },
];

function seedLearningActivity(users: UserMap, courses: CourseMap, passwordHash: string) {
  const learnerIds = [users.learner];

  EXTRA_LEARNERS.forEach((learner, index) => {
    learnerIds.push(
      insert('users', {
        name: learner.name,
        email: learner.email,
        passwordHash,
        role: 'LEARNER',
        phone: `+243 8${between(10, 99)} ${between(100, 999)} ${between(100, 999)}`,
        city: learner.city,
        province: learner.province,
        country: 'RDC',
        locale: index % 3 === 0 ? 'en' : 'fr',
        headline: null,
        avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
        isActive: true,
        createdAt: iso(daysAgo(200 - index * 15)),
      }),
    );
  });

  const catalogue = Object.values(courses);

  // Parcours du compte de démonstration principal : une formation terminée,
  // une en cours, une débutée.
  const mainJourney = [
    { course: catalogue[0], progress: 1, score: 92, complete: true }, // Bureautique — terminée + certificat
    { course: catalogue[5], progress: 0.66, score: 0, complete: false }, // Éducation financière — en cours
    { course: catalogue[2], progress: 0.22, score: 0, complete: false }, // Marketing digital — débutée
  ];

  mainJourney.forEach((entry, index) => {
    if (!entry.course) return;
    const enrollmentId = insert('enrollments', {
      userId: users.learner,
      courseId: entry.course.id,
      status: entry.complete ? 'COMPLETED' : 'ACTIVE',
      progressPct: Math.round(entry.progress * 100),
      finalScore: entry.score || null,
      enrolledAt: iso(daysAgo(120 - index * 20)),
      completedAt: entry.complete ? iso(daysAgo(30)) : null,
    });

    const done = Math.round(entry.course.lessonIds.length * entry.progress);
    entry.course.lessonIds.slice(0, done).forEach((lessonId, lessonIndex) => {
      insert('lesson_progress', {
        enrollmentId,
        lessonId,
        completedAt: iso(daysAgo(100 - lessonIndex * 2)),
      });
    });

    if (entry.score > 0) {
      insert('quiz_attempts', {
        userId: users.learner,
        quizId: entry.course.quizId,
        score: entry.score,
        passed: entry.score >= 70,
        answersJson: JSON.stringify({ attempts: 1 }),
        createdAt: iso(daysAgo(28)),
      });

      insert('certificates', {
        code: certificateCode(now.getFullYear()),
        userId: users.learner,
        courseId: entry.course.id,
        partnerId: null,
        title: `Certificat professionnel — ${entry.course.title}`,
        holderName: 'Grâce Nsimba',
        grade: entry.score >= 85 ? 'Excellent' : entry.score >= 75 ? 'Très bien' : 'Bien',
        score: entry.score,
        hours: 24,
        issuedAt: iso(daysAgo(26)),
        revoked: false,
      });
    }
  });

  // Autres apprenants : quelques inscriptions terminées avec certificat.
  learnerIds.slice(1).forEach((userId, index) => {
    const course = catalogue[(index * 2) % catalogue.length];
    if (!course) return;
    const enrollmentId = insert('enrollments', {
      userId,
      courseId: course.id,
      status: 'COMPLETED',
      progressPct: 100,
      finalScore: between(72, 98),
      enrolledAt: iso(daysAgo(150 - index * 8)),
      completedAt: iso(daysAgo(40 - index * 3)),
    });

    course.lessonIds.forEach((lessonId, lessonIndex) => {
      insert('lesson_progress', {
        enrollmentId,
        lessonId,
        completedAt: iso(daysAgo(140 - lessonIndex * 2 - index)),
      });
    });

    const score = between(72, 98);
    insert('quiz_attempts', {
      userId,
      quizId: course.quizId,
      score,
      passed: true,
      answersJson: JSON.stringify({ attempts: between(1, 2) }),
      createdAt: iso(daysAgo(38 - index * 3)),
    });

    insert('certificates', {
      code: certificateCode(now.getFullYear()),
      userId,
      courseId: course.id,
      partnerId: null,
      title: `Certificat professionnel — ${course.title}`,
      holderName: EXTRA_LEARNERS[index].name,
      grade: score >= 85 ? 'Excellent' : score >= 75 ? 'Très bien' : 'Bien',
      score,
      hours: 20,
      issuedAt: iso(daysAgo(36 - index * 3)),
      revoked: false,
    });

    // Une seconde inscription en cours pour varier les statistiques.
    const second = catalogue[(index * 2 + 1) % catalogue.length];
    if (second) {
      const progress = between(15, 85);
      const enrollmentId2 = insert('enrollments', {
        userId,
        courseId: second.id,
        status: progress >= 100 ? 'COMPLETED' : 'ACTIVE',
        progressPct: progress,
        finalScore: null,
        enrolledAt: iso(daysAgo(60 - index * 2)),
        completedAt: null,
      });
      const done = Math.round((second.lessonIds.length * progress) / 100);
      second.lessonIds.slice(0, done).forEach((lessonId, lessonIndex) => {
        insert('lesson_progress', {
          enrollmentId: enrollmentId2,
          lessonId,
          completedAt: iso(daysAgo(50 - lessonIndex)),
        });
      });
    }
  });
}

// ---------------------------------------------------------------------------
// 5. Résultats d'orientation
// ---------------------------------------------------------------------------

function seedOrientationResults(users: UserMap) {
  const profiles = [
    { name: 'Grâce Nsimba', email: 'apprenant@smart-elimu.cd', level: 'DIPLOME_ETAT', bias: 0, userId: users.learner },
    { name: 'Divine Bahati', email: 'divine.bahati@example.cd', level: 'SECONDAIRE', bias: 1, userId: null },
    { name: 'Joseph Kambale', email: 'joseph.kambale@example.cd', level: 'DIPLOME_ETAT', bias: 2, userId: null },
    { name: 'Rebecca Ilunga', email: 'rebecca.ilunga@example.cd', level: 'LICENCE', bias: 3, userId: null },
    { name: 'Espoir Ndala', email: 'espoir.ndala@example.cd', level: 'SECONDAIRE', bias: 5, userId: null },
    { name: 'Merveille Mumbere', email: 'merveille.mumbere@example.cd', level: 'DIPLOME_ETAT', bias: 4, userId: null },
  ];

  profiles.forEach((profile, index) => {
    const answers: Record<string, string> = {};
    ORIENTATION_QUESTIONS.forEach((question, questionIndex) => {
      // Le décalage progresse avec les questions : chaque profil simulé
      // obtient ainsi une combinaison de réponses différente.
      const option = question.options[(index + questionIndex * (1 + profile.bias % 2)) % question.options.length];
      answers[question.id] = option.id;
    });

    const outcome = computeOrientationProfile(answers);
    const recommended = recommendationIdsFor(outcome.profileCode);

    insert('orientation_results', {
      userId: profile.userId,
      shareCode: shareCode(),
      respondentName: profile.name,
      respondentEmail: profile.email,
      educationLevel: profile.level,
      scores: outcome.scores,
      profileCode: outcome.profileCode,
      profileLabel: outcome.profileLabel,
      topFields: outcome.topFields,
      recommendedProgramIds: recommended,
      answers,
      createdAt: iso(daysAgo(90 - index * 12)),
    });
  });
}

/** Récupère quelques identifiants de filières cohérentes avec un profil. */
function recommendationIdsFor(profileCode: string): string[] {
  const letters = profileCode.split('');
  const rows = getDb()
    .prepare(
      `SELECT pr.id FROM programs pr
         JOIN partners p ON p.id = pr.partner_id
        WHERE p.status = 'ACTIVE'
          AND (${letters.map(() => 'pr.pathway_tags LIKE ?').join(' OR ')})
        LIMIT 5`,
    )
    .all(...letters.map((letter) => `%${letter}%`)) as { id: string }[];
  return rows.map((row) => row.id);
}

// ---------------------------------------------------------------------------
// 6. Établissements scolaires
// ---------------------------------------------------------------------------

function seedSchools(users: UserMap) {
  const owners: Record<string, string> = {
    'direction@cs-espoir.cd': users.schoolEspoir,
    'direction@isj-goma.cd': users.schoolGoma,
    'direction@ep-umoja.cd': users.schoolUmoja,
    'direction@cs-lareussite.cd': users.schoolBukavu,
  };

  SCHOOLS.forEach((school, schoolIndex) => {
    const schoolId = insert('schools', {
      name: school.name,
      code: school.code,
      type: school.type,
      city: school.city,
      province: school.province,
      address: school.address,
      phone: school.phone,
      email: school.email,
      directorName: school.directorName,
      motto: school.motto,
      logoEmoji: school.logoEmoji,
      coverColor: school.coverColor,
      academicYear: ACADEMIC_YEAR,
      capacity: school.capacity,
      ownerId: owners[school.ownerEmail] ?? null,
      createdAt: iso(daysAgo(400 - schoolIndex * 20)),
    });

    // --- Enseignants --------------------------------------------------------
    const teacherIds: string[] = [];
    for (let i = 0; i < school.teacherCount; i += 1) {
      const gender = random() > 0.45 ? 'F' : 'M';
      const firstName = pick(gender === 'F' ? FIRST_NAMES_F : FIRST_NAMES_M);
      const lastName = pick(LAST_NAMES);
      teacherIds.push(
        insert('teachers', {
          schoolId,
          userId: null,
          firstName,
          lastName,
          gender,
          email: `${slugify(firstName)}.${slugify(lastName)}@${slugify(school.code)}.cd`,
          phone: `+243 8${between(10, 99)} ${between(100, 999)} ${between(100, 999)}`,
          subject: school.subjects[i % school.subjects.length],
          qualification: pick(TEACHER_QUALIFICATIONS),
          contractType: random() > 0.75 ? 'VACATAIRE' : 'PERMANENT',
          hiredAt: iso(daysAgo(between(200, 2000))),
          isActive: true,
        }),
      );
    }

    // --- Classes ------------------------------------------------------------
    const classIds: string[] = [];
    school.classes.forEach((klass, classIndex) => {
      classIds.push(
        insert('school_classes', {
          schoolId,
          name: klass.name,
          level: klass.level,
          section: klass.section ?? null,
          academicYear: ACADEMIC_YEAR,
          capacity: klass.capacity,
          room: klass.room,
          mainTeacherId: teacherIds[classIndex % teacherIds.length] ?? null,
        }),
      );
    });

    // --- Élèves -------------------------------------------------------------
    const studentIds: string[] = [];
    const studentClassMap = new Map<string, string | null>();
    const perClass = Math.ceil(school.studentCount / school.classes.length);
    let counter = 0;

    classIds.forEach((classId, classIndex) => {
      const klass = school.classes[classIndex];
      for (let i = 0; i < perClass && counter < school.studentCount; i += 1) {
        counter += 1;
        const gender = random() > 0.5 ? 'F' : 'M';
        const firstName = pick(gender === 'F' ? FIRST_NAMES_F : FIRST_NAMES_M);
        const lastName = pick(LAST_NAMES);
        const birthYear = now.getFullYear() - (6 + classIndex * 2 + between(0, 2));
        const guardianGender = random() > 0.5 ? 'F' : 'M';
        const guardianName = `${pick(guardianGender === 'F' ? FIRST_NAMES_F : FIRST_NAMES_M)} ${lastName}`;

        const studentId = insert('students', {
            schoolId,
            classId,
            matricule: `${ACADEMIC_YEAR.slice(2, 4)}/${school.code.split('-').pop()}/${String(counter).padStart(3, '0')}`,
            firstName,
            lastName,
            gender,
            birthDate: iso(new Date(birthYear, between(0, 11), between(1, 28))),
            placeOfBirth: pick(PLACES_OF_BIRTH),
            guardianName,
            guardianPhone: `+243 8${between(10, 99)} ${between(100, 999)} ${between(100, 999)}`,
            guardianRelation: pick(GUARDIAN_RELATIONS),
            address: `${between(1, 120)}, avenue ${pick(['de la Paix', 'Lumumba', 'des Écoles', 'du Marché', 'Mobutu', 'Kasa-Vubu', 'de l’Université'])}, ${school.city}`,
            enrolledAt: iso(daysAgo(between(30, 300))),
            status: random() > 0.97 ? 'TRANSFERE' : 'ACTIF',
            photoEmoji: gender === 'F' ? '👩🏾‍🎓' : '🧑🏾‍🎓',
          });
        studentIds.push(studentId);
        studentClassMap.set(studentId, classId);
      }
    });

    // --- Notes (T1 et T2) --------------------------------------------------
    const periods = ['T1', 'T2'];
    studentIds.forEach((studentId) => {
      const studentClassId = studentClassMap.get(studentId) ?? null;
      const ability = between(-10, 10);
      periods.forEach((period) => {
        school.subjects.slice(0, 6).forEach((subject) => {
          const base = 62 + ability + between(-12, 14);
          const score = Math.max(24, Math.min(98, base));
          insert('grades', {
            schoolId,
            studentId,
            classId: studentClassId,
            subject,
            period,
            score,
            maxScore: 100,
            coefficient: ['Mathématiques', 'Français'].includes(subject) ? 3 : between(1, 2),
            teacherName: pick(LAST_NAMES),
            comment: score >= 75 ? 'Bon travail' : score >= 50 ? 'Peut mieux faire' : 'Doit se reprendre',
            createdAt: iso(daysAgo(period === 'T1' ? between(150, 170) : between(40, 60))),
          });
        });
      });
    });

    // --- Présences (30 derniers jours ouvrés) ------------------------------
    for (let day = 0; day < 30; day += 1) {
      const date = daysAgo(day, 7);
      if (date.getDay() === 0) continue;
      studentIds.forEach((studentId) => {
        const roll = random();
        const status = roll > 0.94 ? 'ABSENT' : roll > 0.9 ? 'RETARD' : roll > 0.88 ? 'EXCUSE' : 'PRESENT';
        insert('attendances', {
          schoolId,
          studentId,
          classId: studentClassMap.get(studentId) ?? null,
          date: dateOnly(date),
          status,
          note: status === 'ABSENT' && random() > 0.7 ? 'Non justifié' : null,
          createdAt: iso(date),
        });
      });
    }

    // --- Frais scolaires ---------------------------------------------------
    studentIds.forEach((studentId, studentIndex) => {
      const amount = school.annualFeeCdf / 3;
      const firstPaymentRatio = random() > 0.3 ? 1 : random() > 0.5 ? 0.5 : 0;

      const invoice1 = insert('invoices', {
        schoolId,
        studentId,
        label: 'Frais scolaires — Trimestre 1',
        period: 'T1',
        amount: Math.round(amount),
        currency: 'CDF',
        dueDate: iso(daysAgo(60)),
        status: 'IMPAYE',
        createdAt: iso(daysAgo(120 + (studentIndex % 10))),
      });

      if (firstPaymentRatio > 0) {
        insert('payments', {
          invoiceId: invoice1,
          amount: Math.round(amount * firstPaymentRatio),
          currency: 'CDF',
          method: pick(['MOBILE_MONEY', 'ESPECES', 'VIREMENT', 'BANQUE']),
          reference: `MP-${ACADEMIC_YEAR.slice(0, 4)}-${between(10000, 99999)}`,
          paidAt: iso(daysAgo(between(20, 110))),
          recordedById: owners[school.ownerEmail] ?? null,
        });
        getDb()
          .prepare('UPDATE invoices SET status = ? WHERE id = ?')
          .run(firstPaymentRatio === 1 ? 'PAYE' : 'PARTIEL', invoice1);
      }

      const invoice2 = insert('invoices', {
        schoolId,
        studentId,
        label: 'Frais scolaires — Trimestre 2',
        period: 'T2',
        amount: Math.round(amount),
        currency: 'CDF',
        dueDate: iso(daysFromNow(between(5, 40))),
        status: 'IMPAYE',
        createdAt: iso(daysAgo(30)),
      });

      if (random() > 0.65) {
        insert('payments', {
          invoiceId: invoice2,
          amount: Math.round(amount * (random() > 0.5 ? 1 : 0.4)),
          currency: 'CDF',
          method: pick(['MOBILE_MONEY', 'ESPECES', 'BANQUE']),
          reference: `MP-${ACADEMIC_YEAR.slice(0, 4)}-${between(10000, 99999)}`,
          paidAt: iso(daysAgo(between(1, 25))),
          recordedById: owners[school.ownerEmail] ?? null,
        });
        const paid =
          (getDb()
            .prepare('SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE invoice_id = ?')
            .get(invoice2) as { total: number }).total ?? 0;
        getDb()
          .prepare('UPDATE invoices SET status = ? WHERE id = ?')
          .run(paid >= amount ? 'PAYE' : 'PARTIEL', invoice2);
      }
    });
  });
}

// ---------------------------------------------------------------------------
// 7. Demandes de partenariat et candidatures
// ---------------------------------------------------------------------------

function seedRequestsAndApplications(users: UserMap, partners: PartnerMap) {
  const requests = [
    {
      organizationName: 'Institut Médical Sainte-Croix de Kisangani',
      organizationType: 'INSTITUTE',
      contactName: 'Dr Sylvie Bofasa',
      email: 'secretariat@imsc-kisangani.cd',
      phone: '+243 995 000 115',
      city: 'Kisangani',
      province: 'Tshopo',
      message:
        'Nous souhaitons faire certifier nos modules de soins infirmiers par SMART-ELIMU et intégrer nos 420 étudiants dans la plateforme.',
      status: 'NEW',
      days: 3,
    },
    {
      organizationName: 'Centre de Formation aux Métiers du Port de Matadi',
      organizationType: 'TRAINING_CENTER',
      contactName: 'Jean-Claude Mbala',
      email: 'contact@cfmp-matadi.cd',
      phone: '+243 993 222 333',
      city: 'Matadi',
      province: 'Kongo-Central',
      message: 'Nous formons des manutentionnaires portuaires et cherchons un partenaire numérique pour délivrer des certificats vérifiables.',
      status: 'CONTACTED',
      days: 9,
    },
    {
      organizationName: 'Université Libre du Maniema',
      organizationType: 'UNIVERSITY',
      contactName: 'Professeur Albert Kalonji',
      email: 'recteur@ulm-kindu.cd',
      phone: '+243 817 555 444',
      city: 'Kindu',
      province: 'Maniema',
      message: 'Proposition de co-diplomation pour nos filières agronomie et sciences économiques.',
      status: 'APPROVED',
      days: 24,
    },
    {
      organizationName: 'Complexe Scolaire Les Étoiles de Tshikapa',
      organizationType: 'HIGH_SCHOOL',
      contactName: 'Mme Chantal Tshite',
      email: 'direction@etoiles-tshikapa.cd',
      phone: '+243 995 777 888',
      city: 'Tshikapa',
      province: 'Kasaï',
      message: 'Nous comptons 1 100 élèves et souhaitons digitaliser la gestion des bulletins et des frais scolaires.',
      status: 'NEW',
      days: 1,
    },
    {
      organizationName: 'Académie de Couture Kin Mode',
      organizationType: 'TRAINING_CENTER',
      contactName: 'Merveille Bakala',
      email: 'info@kinmode.cd',
      phone: '+243 818 909 121',
      city: 'Kinshasa',
      province: 'Kinshasa',
      message: 'Nous voulons proposer nos formations en coupe et couture en ligne avec certification.',
      status: 'NEW',
      days: 6,
    },
  ];

  requests.forEach((request) => {
    insert('partnership_requests', {
      organizationName: request.organizationName,
      organizationType: request.organizationType,
      contactName: request.contactName,
      email: request.email,
      phone: request.phone,
      city: request.city,
      province: request.province,
      message: request.message,
      status: request.status,
      reviewedById: request.status === 'NEW' ? null : users.admin,
      createdAt: iso(daysAgo(request.days)),
    });
  });

  const programRows = getDb()
    .prepare(
      `SELECT pr.id, pr.partner_id, pr.name FROM programs pr
         JOIN partners p ON p.id = pr.partner_id
        WHERE p.status = 'ACTIVE' ORDER BY pr.is_featured DESC LIMIT 12`,
    )
    .all() as { id: string; partner_id: string; name: string }[];

  const applicants = [
    { fullName: 'Divine Bahati', email: 'divine.bahati@example.cd', city: 'Goma', status: 'SUBMITTED', days: 2 },
    { fullName: 'Merveil Tshibanda', email: 'merveil.tshibanda@example.cd', city: 'Lubumbashi', status: 'REVIEWING', days: 8 },
    { fullName: 'Furaha Mwamba', email: 'furaha.mwamba@example.cd', city: 'Bukavu', status: 'ACCEPTED', days: 15 },
    { fullName: 'Trésor Ngoyi', email: 'tresor.ngoyi@example.cd', city: 'Kananga', status: 'SUBMITTED', days: 4 },
    { fullName: 'Rodrigue Lukusa', email: 'rodrigue.lukusa@example.cd', city: 'Matadi', status: 'ENROLLED', days: 30 },
    { fullName: 'Ornella Mujinga', email: 'ornella.mujinga@example.cd', city: 'Mbuji-Mayi', status: 'REJECTED', days: 22 },
  ];

  applicants.forEach((applicant, index) => {
    const program = programRows[index % programRows.length];
    if (!program) return;
    insert('program_applications', {
      programId: program.id,
      partnerId: program.partner_id,
      userId: null,
      fullName: applicant.fullName,
      email: applicant.email,
      phone: `+243 8${between(10, 99)} ${between(100, 999)} ${between(100, 999)}`,
      city: applicant.city,
      message: `Candidature au programme « ${program.name} ». Dossier complet transmis avec relevé de notes et lettre de motivation.`,
      status: applicant.status,
      createdAt: iso(daysAgo(applicant.days)),
    });
  });
}

main()
  .then(() => {
    // Fusionne le journal WAL dans le fichier principal : la base peut ainsi être
    // copiée/embarquée telle quelle (déploiement Netlify).
    const db = getDb();
    db.pragma('wal_checkpoint(TRUNCATE)');
    db.close();
  })
  .catch((error) => {
  console.error('❌ Échec du peuplement :', error);
  process.exit(1);
});
