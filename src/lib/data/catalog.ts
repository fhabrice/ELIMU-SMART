import 'server-only';
import { query, queryOne, update, execute } from '../sqlite';
import type {
  Course,
  CourseModule,
  CourseWithMeta,
  Enrollment,
  EnrollmentWithCourse,
  Lesson,
  Quiz,
  QuizQuestion,
  Certificate,
  CertificateWithCourse,
} from '../types';

export type CourseFilters = {
  q?: string;
  category?: string;
  level?: string;
  language?: string;
  partnerId?: string;
  certifyingOnly?: boolean;
  limit?: number;
};

const COURSE_SELECT = `
  SELECT c.*,
         p.name        AS partner_name,
         p.logo_emoji  AS partner_logo,
         u.name        AS instructor_name,
         (SELECT COUNT(*) FROM course_modules m WHERE m.course_id = c.id) AS module_count,
         (SELECT COUNT(*) FROM lessons l
            JOIN course_modules m2 ON m2.id = l.module_id
           WHERE m2.course_id = c.id) AS lesson_count
    FROM courses c
    LEFT JOIN partners p ON p.id = c.partner_id
    LEFT JOIN users u ON u.id = c.instructor_id
`;

/** Liste les formations publiées correspondant aux filtres. */
export function listCourses(filters: CourseFilters = {}): CourseWithMeta[] {
  const where: string[] = ["c.status = 'PUBLISHED'"];
  const params: unknown[] = [];

  if (filters.q) {
    where.push('(c.title LIKE ? OR c.summary LIKE ? OR c.category LIKE ?)');
    const like = `%${filters.q}%`;
    params.push(like, like, like);
  }
  if (filters.category) {
    where.push('c.category = ?');
    params.push(filters.category);
  }
  if (filters.level) {
    where.push('c.level = ?');
    params.push(filters.level);
  }
  if (filters.language) {
    where.push('c.language = ?');
    params.push(filters.language);
  }
  if (filters.partnerId) {
    where.push('c.partner_id = ?');
    params.push(filters.partnerId);
  }
  if (filters.certifyingOnly) {
    where.push('c.is_certifying = 1');
  }

  const limit = filters.limit ? `LIMIT ${Number(filters.limit)}` : '';
  return query<CourseWithMeta>(
    `${COURSE_SELECT} WHERE ${where.join(' AND ')} ORDER BY c.learners_count DESC, c.created_at DESC ${limit}`,
    params,
  );
}

export function getCourseBySlug(slug: string): CourseWithMeta | null {
  return queryOne<CourseWithMeta>(`${COURSE_SELECT} WHERE c.slug = ?`, [slug]);
}

export function getCourseById(id: string): CourseWithMeta | null {
  return queryOne<CourseWithMeta>(`${COURSE_SELECT} WHERE c.id = ?`, [id]);
}

export function getCourseCategories(): { category: string; total: number }[] {
  return query<{ category: string; total: number }>(
    `SELECT category, COUNT(*) AS total FROM courses WHERE status = 'PUBLISHED' GROUP BY category ORDER BY total DESC`,
  );
}

export type CourseContent = {
  modules: (CourseModule & { lessons: Lesson[] })[];
  quizzes: (Quiz & { questions: QuizQuestion[] })[];
};

/** Contenu pédagogique complet (modules, leçons, évaluations). */
export function getCourseContent(courseId: string): CourseContent {
  const modules = query<CourseModule>(
    'SELECT * FROM course_modules WHERE course_id = ? ORDER BY position ASC',
    [courseId],
  );
  const lessons = query<Lesson>(
    `SELECT l.* FROM lessons l
       JOIN course_modules m ON m.id = l.module_id
      WHERE m.course_id = ?
      ORDER BY m.position ASC, l.position ASC`,
    [courseId],
  );
  const quizzes = query<Quiz>(
    'SELECT * FROM quizzes WHERE course_id = ? ORDER BY position ASC',
    [courseId],
  );
  const questions = query<QuizQuestion>(
    `SELECT q.* FROM quiz_questions q
       JOIN quizzes z ON z.id = q.quiz_id
      WHERE z.course_id = ?
      ORDER BY q.position ASC`,
    [courseId],
  );

  return {
    modules: modules.map((module) => ({
      ...module,
      lessons: lessons.filter((lesson) => lesson.moduleId === module.id),
    })),
    quizzes: quizzes.map((quiz) => ({
      ...quiz,
      questions: questions.filter((question) => question.quizId === quiz.id),
    })),
  };
}

export function getQuizzesForCourse(courseId: string): (Quiz & { questions: QuizQuestion[] })[] {
  return getCourseContent(courseId).quizzes;
}

// ---------------------------------------------------------------------------
// Inscriptions & progression
// ---------------------------------------------------------------------------

export function getEnrollment(userId: string, courseId: string): Enrollment | null {
  return queryOne<Enrollment>('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?', [
    userId,
    courseId,
  ]);
}

export function listEnrollments(userId: string): EnrollmentWithCourse[] {
  const rows = query<Enrollment & { course_title: string }>(
    `SELECT e.*, c.title AS course_title
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC`,
    [userId],
  );
  const courses = query<Course>(
    `SELECT c.* FROM courses c
       JOIN enrollments e ON e.course_id = c.id
      WHERE e.user_id = ?`,
    [userId],
  );
  return rows.map((row) => ({
    ...row,
    course: courses.find((course) => course.id === row.courseId)!,
  }));
}

export function listCompletedLessonIds(enrollmentId: string): string[] {
  return query<{ lessonId: string }>(
    'SELECT lesson_id FROM lesson_progress WHERE enrollment_id = ?',
    [enrollmentId],
  ).map((row) => row.lessonId);
}

export function totalLessonsForCourse(courseId: string): number {
  const row = queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM lessons l
       JOIN course_modules m ON m.id = l.module_id
      WHERE m.course_id = ?`,
    [courseId],
  );
  return row?.total ?? 0;
}

/** Recalcule la progression d'une inscription et la renvoie. */
export function recomputeProgress(userId: string, courseId: string): { progressPct: number; completed: number; total: number } {
  const enrollment = getEnrollment(userId, courseId);
  const total = totalLessonsForCourse(courseId);
  if (!enrollment) return { progressPct: 0, completed: 0, total };

  const completed = listCompletedLessonIds(enrollment.id).length;
  const progressPct = total === 0 ? 0 : Math.round((completed / total) * 100);

  update('enrollments', enrollment.id, {
    progressPct,
    status: progressPct >= 100 ? 'COMPLETED' : 'ACTIVE',
  });
  return { progressPct, completed, total };
}

/** Enregistre la meilleure note d'évaluation finale pour une inscription. */
export function saveFinalScore(userId: string, courseId: string, score: number) {
  const enrollment = getEnrollment(userId, courseId);
  if (!enrollment) return;
  update('enrollments', enrollment.id, {
    finalScore: Math.max(score, enrollment.finalScore ?? 0),
  });
}

export function countCourseEnrollments(courseId: string): number {
  const row = queryOne<{ total: number }>(
    'SELECT COUNT(*) AS total FROM enrollments WHERE course_id = ?',
    [courseId],
  );
  return row?.total ?? 0;
}

// ---------------------------------------------------------------------------
// Certificats
// ---------------------------------------------------------------------------

export function getCertificateByCode(code: string): CertificateWithCourse | null {
  return queryOne<CertificateWithCourse>(
    `SELECT ce.*, c.title AS course_title, p.name AS partner_name, p.logo_emoji AS partner_logo
       FROM certificates ce
       LEFT JOIN courses c ON c.id = ce.course_id
       LEFT JOIN partners p ON p.id = ce.partner_id
      WHERE UPPER(ce.code) = UPPER(?)`,
    [code.trim()],
  );
}

export function getCertificateForCourse(userId: string, courseId: string): Certificate | null {
  return queryOne<Certificate>(
    'SELECT * FROM certificates WHERE user_id = ? AND course_id = ? ORDER BY issued_at DESC LIMIT 1',
    [userId, courseId],
  );
}

export function listCertificates(userId: string): CertificateWithCourse[] {
  return query<CertificateWithCourse>(
    `SELECT ce.*, c.title AS course_title, p.name AS partner_name, p.logo_emoji AS partner_logo
       FROM certificates ce
       LEFT JOIN courses c ON c.id = ce.course_id
       LEFT JOIN partners p ON p.id = ce.partner_id
      WHERE ce.user_id = ?
      ORDER BY ce.issued_at DESC`,
    [userId],
  );
}

export function listRecentCertificates(limit = 6): CertificateWithCourse[] {
  return query<CertificateWithCourse>(
    `SELECT ce.*, c.title AS course_title, p.name AS partner_name, p.logo_emoji AS partner_logo
       FROM certificates ce
       LEFT JOIN courses c ON c.id = ce.course_id
       LEFT JOIN partners p ON p.id = ce.partner_id
      WHERE ce.revoked = 0
      ORDER BY ce.issued_at DESC LIMIT ?`,
    [limit],
  );
}

export function countCertificates(): number {
  return queryOne<{ total: number }>('SELECT COUNT(*) AS total FROM certificates')?.total ?? 0;
}

/** Derniers résultats d'évaluation d'un utilisateur (historique pédagogique). */
export function listQuizAttempts(userId: string, limit = 20) {
  return query<{
    id: string;
    quizId: string;
    score: number;
    passed: boolean;
    createdAt: string;
    quizTitle: string;
    courseTitle: string;
  }>(
    `SELECT a.id, a.quiz_id, a.score, a.passed, a.created_at,
            z.title AS quiz_title, c.title AS course_title
       FROM quiz_attempts a
       JOIN quizzes z ON z.id = a.quiz_id
       JOIN courses c ON c.id = z.course_id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC LIMIT ?`,
    [userId, limit],
  );
}

export function deleteEnrollment(userId: string, courseId: string) {
  execute('DELETE FROM enrollments WHERE user_id = ? AND course_id = ?', [userId, courseId]);
}
