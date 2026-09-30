'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateCertificateCode, requireUser } from '../auth';
import { execute, insert, query, queryOne, update } from '../sqlite';
import { getCourseBySlug, getEnrollment, recomputeProgress, totalLessonsForCourse } from '../data/catalog';

/** Inscription à une formation (gratuite ou payante — le paiement est simulé). */
export async function enrollAction(formData: FormData) {
  const slug = String(formData.get('slug') ?? '');
  const course = getCourseBySlug(slug);
  if (!course) redirect('/formations');

  const user = await requireUser(`/formations/${slug}`);

  if (!getEnrollment(user.id, course.id)) {
    insert('enrollments', {
      userId: user.id,
      courseId: course.id,
      status: 'ACTIVE',
      progressPct: 0,
      finalScore: null,
      enrolledAt: new Date().toISOString(),
      completedAt: null,
    });
  }

  revalidatePath(`/formations/${slug}`);
  revalidatePath('/tableau-de-bord');
  redirect(`/formations/${slug}/apprendre`);
}

/** Marque une leçon comme terminée (ou annule la validation). */
export async function toggleLessonAction(formData: FormData) {
  const slug = String(formData.get('slug') ?? '');
  const lessonId = String(formData.get('lessonId') ?? '');
  const course = getCourseBySlug(slug);
  const user = await requireUser(`/formations/${slug}/apprendre`);
  if (!course) return;

  const enrollment = getEnrollment(user.id, course.id);
  if (!enrollment) return;

  const existing = queryOne<{ id: string }>(
    'SELECT id FROM lesson_progress WHERE enrollment_id = ? AND lesson_id = ?',
    [enrollment.id, lessonId],
  );

  if (existing) {
    execute('DELETE FROM lesson_progress WHERE id = ?', [existing.id]);
  } else {
    insert('lesson_progress', {
      enrollmentId: enrollment.id,
      lessonId,
      completedAt: new Date().toISOString(),
    });
  }

  recomputeProgress(user.id, course.id);
  revalidatePath(`/formations/${slug}/apprendre`);
  revalidatePath('/tableau-de-bord');
}

export type QuizState = {
  ok: boolean;
  score?: number;
  passed?: boolean;
  corrections?: { questionId: string; correctIndex: number; given: number | null; explanation: string | null }[];
  message?: string;
};

/** Corrige l'évaluation finale et délivre le certificat si tout est validé. */
export async function submitQuizAction(_prev: QuizState, formData: FormData): Promise<QuizState> {
  const slug = String(formData.get('slug') ?? '');
  const course = getCourseBySlug(slug);
  if (!course) return { ok: false, message: 'Formation introuvable.' };

  const user = await requireUser(`/formations/${slug}/apprendre`);
  const enrollment = getEnrollment(user.id, course.id);
  if (!enrollment) return { ok: false, message: 'Vous n’êtes pas inscrit à cette formation.' };

  const quiz = queryOne<{ id: string; title: string; passingScore: number }>(
    'SELECT * FROM quizzes WHERE course_id = ? ORDER BY position ASC LIMIT 1',
    [course.id],
  );
  if (!quiz) return { ok: false, message: 'Aucune évaluation disponible.' };

  const questions = query<
    { id: string; correctIndex: number; explanation: string | null; points: number }
  >('SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY position ASC', [quiz.id]);
  if (questions.length === 0) return { ok: false, message: 'Aucune question disponible.' };

  let earned = 0;
  let total = 0;
  const corrections: NonNullable<QuizState['corrections']> = [];
  const answers: Record<string, number | null> = {};

  for (const question of questions) {
    const raw = formData.get(`question_${question.id}`);
    const given = raw === null ? null : Number(raw);
    answers[question.id] = given;
    total += question.points;
    if (given === question.correctIndex) earned += question.points;
    corrections.push({
      questionId: question.id,
      correctIndex: question.correctIndex,
      given,
      explanation: question.explanation,
    });
  }

  const score = total === 0 ? 0 : Math.round((earned / total) * 100);
  const passed = score >= quiz.passingScore;

  insert('quiz_attempts', {
    userId: user.id,
    quizId: quiz.id,
    score,
    passed,
    answersJson: JSON.stringify(answers),
    createdAt: new Date().toISOString(),
  });

  update('enrollments', enrollment.id, {
    finalScore: Math.max(score, enrollment.finalScore ?? 0),
  });

  const progress = recomputeProgress(user.id, course.id);

  // Délivrance du certificat : toutes les leçons terminées + évaluation réussie.
  if (passed && progress.progressPct >= 100) {
    const existing = queryOne<{ id: string }>(
      'SELECT id FROM certificates WHERE user_id = ? AND course_id = ?',
      [user.id, course.id],
    );

    if (!existing) {
      insert('certificates', {
        code: generateCertificateCode(),
        userId: user.id,
        courseId: course.id,
        partnerId: course.partnerId ?? null,
        title: course.certificateTitle ?? `Certificat — ${course.title}`,
        holderName: user.name,
        grade: score >= 85 ? 'Excellent' : score >= 75 ? 'Très bien' : 'Bien',
        score,
        hours: course.durationHours,
        issuedAt: new Date().toISOString(),
        revoked: false,
      });
    }
  }

  revalidatePath(`/formations/${slug}`);
  revalidatePath(`/formations/${slug}/apprendre`);
  revalidatePath('/tableau-de-bord');

  return {
    ok: true,
    score,
    passed,
    corrections,
    message: passed
      ? 'Évaluation réussie !'
      : `Score insuffisant : il faut atteindre ${quiz.passingScore} % pour valider.`,
  };
}

/** Progression affichée dans le lecteur de formation. */
export async function courseProgress(userId: string, courseId: string) {
  const enrollment = getEnrollment(userId, courseId);
  return {
    enrollment,
    totalLessons: totalLessonsForCourse(courseId),
  };
}
