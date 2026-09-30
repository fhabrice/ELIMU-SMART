'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '../auth';
import { insert, update } from '../sqlite';
import { ROLES } from '../constants';
import { generateCertificateCode, certificateFingerprint } from '../auth';

/** Met à jour le statut d'une demande de partenariat. */
export async function updatePartnershipRequestAction(formData: FormData) {
  await requireRole([ROLES.ADMIN]);
  const id = String(formData.get('requestId') ?? '');
  const status = String(formData.get('status') ?? 'CONTACTED');
  if (!id) return;

  const { getCurrentUser } = await import('../auth');
  const user = await getCurrentUser();

  update('partnership_requests', id, { status, reviewedById: user?.id ?? null });
  revalidatePath('/admin');
}

/** Publie ou dépublie une formation. */
export async function toggleCourseStatusAction(formData: FormData) {
  await requireRole([ROLES.ADMIN]);
  const courseId = String(formData.get('courseId') ?? '');
  const status = String(formData.get('status') ?? 'PUBLISHED');
  if (!courseId) return;
  update('courses', courseId, { status });
  revalidatePath('/admin');
  revalidatePath('/formations');
}

/** Révoque un certificat (fraude, erreur de délivrance). */
export async function revokeCertificateAction(formData: FormData) {
  await requireRole([ROLES.ADMIN]);
  const certificateId = String(formData.get('certificateId') ?? '');
  const reason = String(formData.get('reason') ?? 'Révoqué par l’administration').trim();
  if (!certificateId) return;
  update('certificates', certificateId, { revoked: true, revokeReason: reason });
  revalidatePath('/admin');
  revalidatePath('/certificats');
}

/** Crée un utilisateur interne (formateur, direction, partenaire). */
export async function createStaffUserAction(formData: FormData) {
  await requireRole([ROLES.ADMIN]);
  const { hashPassword } = await import('../auth');
  const { colorFromString } = await import('../utils');

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const role = String(formData.get('role') ?? ROLES.TEACHER);
  const city = String(formData.get('city') ?? '').trim();
  const password = String(formData.get('password') ?? 'elimu2026');

  if (name.length < 3 || !email.includes('@')) return;

  insert('users', {
    name,
    email,
    passwordHash: await hashPassword(password),
    role,
    phone: null,
    city: city || null,
    province: null,
    country: 'RDC',
    locale: 'fr',
    headline: null,
    avatarColor: colorFromString(email),
    isActive: true,
  });

  revalidatePath('/admin');
}

/** Génère le QR code de vérification d'un certificat (route /api). */
export async function buildCertificatePayload(code: string, holderName: string, issuedAt: string) {
  return {
    code,
    fingerprint: certificateFingerprint(code, holderName, new Date(issuedAt)),
    generated: generateCertificateCode(),
  };
}

void insert;
