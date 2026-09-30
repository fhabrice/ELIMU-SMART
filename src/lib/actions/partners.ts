'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { insert, update } from '../sqlite';
import { getCurrentUser, requireRole } from '../auth';
import { ROLES } from '../constants';

export type FormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

const requestSchema = z.object({
  organizationName: z.string().min(3, 'Nom de l’institution requis'),
  organizationType: z.string().min(2),
  contactName: z.string().min(3, 'Nom du contact requis'),
  email: z.string().email('Adresse e-mail invalide'),
  phone: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  message: z.string().max(1200).optional(),
});

/** Demande de partenariat déposée depuis le site public. */
export async function submitPartnershipRequestAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = requestSchema.safeParse({
    organizationName: String(formData.get('organizationName') ?? '').trim(),
    organizationType: String(formData.get('organizationType') ?? 'UNIVERSITY'),
    contactName: String(formData.get('contactName') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim().toLowerCase(),
    phone: String(formData.get('phone') ?? '').trim() || undefined,
    city: String(formData.get('city') ?? '').trim() || undefined,
    province: String(formData.get('province') ?? '').trim() || undefined,
    message: String(formData.get('message') ?? '').trim() || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0] ?? 'form')] = issue.message;
    }
    return { ok: false, message: 'Veuillez compléter les champs obligatoires.', fieldErrors };
  }

  insert('partnership_requests', {
    organizationName: parsed.data.organizationName,
    organizationType: parsed.data.organizationType,
    contactName: parsed.data.contactName,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    city: parsed.data.city ?? null,
    province: parsed.data.province ?? null,
    message: parsed.data.message ?? null,
    status: 'NEW',
    createdAt: new Date().toISOString(),
  });

  revalidatePath('/admin');
  return {
    ok: true,
    message:
      'Votre demande a bien été transmise. Notre équipe vous contactera sous 72 heures ouvrables.',
  };
}

const applicationSchema = z.object({
  programId: z.string().min(3),
  partnerId: z.string().min(3),
  fullName: z.string().min(3, 'Nom complet requis'),
  email: z.string().email('Adresse e-mail invalide'),
  phone: z.string().optional(),
  city: z.string().optional(),
  message: z.string().max(1200).optional(),
});

/** Candidature à une filière d'un partenaire. */
export async function submitProgramApplicationAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = applicationSchema.safeParse({
    programId: String(formData.get('programId') ?? ''),
    partnerId: String(formData.get('partnerId') ?? ''),
    fullName: String(formData.get('fullName') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim().toLowerCase(),
    phone: String(formData.get('phone') ?? '').trim() || undefined,
    city: String(formData.get('city') ?? '').trim() || undefined,
    message: String(formData.get('message') ?? '').trim() || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0] ?? 'form')] = issue.message;
    }
    return { ok: false, message: 'Veuillez compléter les champs obligatoires.', fieldErrors };
  }

  const user = await getCurrentUser();

  insert('program_applications', {
    programId: parsed.data.programId,
    partnerId: parsed.data.partnerId,
    userId: user?.id ?? null,
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    city: parsed.data.city ?? null,
    message: parsed.data.message ?? null,
    status: 'SUBMITTED',
    createdAt: new Date().toISOString(),
  });

  revalidatePath('/partenaires/espace');
  revalidatePath('/admin');
  return { ok: true, message: 'Votre candidature a été transmise au partenaire. Vous serez contacté(e) par e-mail.' };
}

/** Mise à jour du statut d'une candidature (partenaire ou administration). */
export async function updateApplicationStatusAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== ROLES.ADMIN && user.role !== ROLES.PARTNER)) return;

  const id = String(formData.get('applicationId') ?? '');
  const status = String(formData.get('status') ?? 'REVIEWING');
  if (!id) return;

  update('program_applications', id, { status });
  revalidatePath('/partenaires/espace');
  revalidatePath('/admin');
}
