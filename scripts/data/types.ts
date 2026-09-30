export type SeedLesson = {
  title: string;
  content: string;
  type?: 'TEXTE' | 'VIDEO' | 'ATELIER' | 'QUIZ';
  durationMin?: number;
};

export type SeedModule = {
  title: string;
  summary?: string;
  lessons: SeedLesson[];
};

export type SeedQuestion = {
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

export type SeedCourse = {
  title: string;
  summary: string;
  description: string;
  category: string;
  level: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';
  language: string;
  durationHours: number;
  priceUsd: number;
  coverEmoji: string;
  coverColor: string;
  partnerSlug?: string;
  instructorEmail?: string;
  rating: number;
  learnersCount: number;
  modules: SeedModule[];
  quiz: { title: string; description: string; questions: SeedQuestion[] };
};

/** Raccourci de rédaction : une leçon texte. */
export function l(title: string, content: string, durationMin = 12): SeedLesson {
  return { title, content: content.trim(), type: 'TEXTE', durationMin };
}

/** Raccourci de rédaction : un atelier pratique. */
export function atelier(title: string, content: string, durationMin = 25): SeedLesson {
  return { title, content: content.trim(), type: 'ATELIER', durationMin };
}

/** Raccourci de rédaction : une capsule vidéo. */
export function video(title: string, content: string, durationMin = 10): SeedLesson {
  return { title, content: content.trim(), type: 'VIDEO', durationMin };
}
