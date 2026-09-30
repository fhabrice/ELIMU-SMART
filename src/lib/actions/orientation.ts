'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { insert, query } from '../sqlite';
import { getCurrentUser } from '../auth';
import { computeOrientationProfile, ORIENTATION_QUESTIONS } from '../orientation';

export type OrientationState = {
  ok: boolean;
  message?: string;
  missing?: string[];
};

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function newShareCode(): string {
  const block = (size: number) =>
    Array.from({ length: size }, () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]).join('');
  return `OR-${new Date().getFullYear()}-${block(4)}-${block(4)}`;
}

/** Enregistre le questionnaire d'orientation et redirige vers le rapport. */
export async function submitOrientationAction(
  _prev: OrientationState,
  formData: FormData,
): Promise<OrientationState> {
  const respondentName = String(formData.get('name') ?? '').trim();
  const respondentEmail = String(formData.get('email') ?? '').trim() || null;
  const educationLevel = String(formData.get('educationLevel') ?? 'DIPLOME_ETAT');

  if (respondentName.length < 3) {
    return { ok: false, message: 'Indiquez votre nom complet pour générer le rapport.' };
  }

  const answers: Record<string, string> = {};
  const missing: string[] = [];
  for (const question of ORIENTATION_QUESTIONS) {
    const value = String(formData.get(`q_${question.id}`) ?? '');
    if (!value) missing.push(question.id);
    else answers[question.id] = value;
  }

  if (missing.length > 0) {
    return {
      ok: false,
      message: `Il reste ${missing.length} question(s) sans réponse.`,
      missing,
    };
  }

  const outcome = computeOrientationProfile(answers);

  // Filières cohérentes avec le profil, classées par correspondance.
  const tags = outcome.ranked.slice(0, 3);
  const recommended = query<{ id: string }>(
    `SELECT pr.id FROM programs pr
       JOIN partners p ON p.id = pr.partner_id
      WHERE p.status = 'ACTIVE'
        AND (${tags.map(() => 'pr.pathway_tags LIKE ?').join(' OR ')})
      ORDER BY pr.is_featured DESC
      LIMIT 6`,
    tags.map((tag) => `%${tag}%`),
  );

  const user = await getCurrentUser();
  const shareCode = newShareCode();

  insert('orientation_results', {
    userId: user?.id ?? null,
    shareCode,
    respondentName,
    respondentEmail,
    educationLevel,
    scores: outcome.scores,
    profileCode: outcome.profileCode,
    profileLabel: outcome.profileLabel,
    topFields: outcome.topFields,
    recommendedProgramIds: recommended.map((row) => row.id),
    answers,
    createdAt: new Date().toISOString(),
  });

  revalidatePath('/tableau-de-bord');
  redirect(`/orientation/resultats/${shareCode}`);
}
