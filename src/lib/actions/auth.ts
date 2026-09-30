'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createSession, destroySession, hashPassword, verifyPassword } from '../auth';
import { getUserByEmail } from '../data/users';
import { insert, update } from '../sqlite';
import { colorFromString } from '../utils';
import { ROLES } from '../constants';

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

const registerSchema = z.object({
  name: z.string().min(3, 'Indiquez votre nom complet'),
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['LEARNER', 'TEACHER', 'SCHOOL_ADMIN', 'PARTNER']).default('LEARNER'),
  city: z.string().optional(),
  province: z.string().optional(),
  phone: z.string().optional(),
});

export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: String(formData.get('name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim().toLowerCase(),
    password: String(formData.get('password') ?? ''),
    role: String(formData.get('role') ?? 'LEARNER'),
    city: String(formData.get('city') ?? '').trim() || undefined,
    province: String(formData.get('province') ?? '').trim() || undefined,
    phone: String(formData.get('phone') ?? '').trim() || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? 'form');
      fieldErrors[field] = issue.message;
    }
    return { ok: false, message: 'Veuillez corriger les champs signalés.', fieldErrors };
  }

  const data = parsed.data;
  if (getUserByEmail(data.email)) {
    return { ok: false, message: 'Cette adresse e-mail est déjà utilisée.', fieldErrors: { email: 'E-mail déjà utilisé' } };
  }

  const passwordHash = await hashPassword(data.password);
  const userId = insert('users', {
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role,
    phone: data.phone ?? null,
    city: data.city ?? null,
    province: data.province ?? null,
    country: 'RDC',
    locale: 'fr',
    headline: null,
    avatarColor: colorFromString(data.email),
    isActive: true,
  });

  await createSession(userId, null);
  redirect(redirectTargetFor(data.role));
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get('email') ?? '').trim().toLowerCase(),
    password: String(formData.get('password') ?? ''),
  });

  if (!parsed.success) {
    return { ok: false, message: 'Adresse e-mail ou mot de passe invalide.' };
  }

  const user = getUserByEmail(parsed.data.email);
  if (!user || !user.isActive) {
    return { ok: false, message: 'Adresse e-mail ou mot de passe incorrect.' };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { ok: false, message: 'Adresse e-mail ou mot de passe incorrect.' };
  }

  await createSession(user.id, null);
  redirect(redirectTargetFor(user.role));
}

export async function logoutAction() {
  await destroySession();
  redirect('/');
}

function redirectTargetFor(role: string): string {
  switch (role) {
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.SCHOOL_ADMIN:
      return '/ecoles/tableau-de-bord';
    case ROLES.PARTNER:
      return '/partenaires/espace';
    case ROLES.TEACHER:
      return '/formateur';
    default:
      return '/tableau-de-bord';
  }
}

export async function updateProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { requireUser } = await import('../auth');
  const user = await requireUser();

  const name = String(formData.get('name') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const headline = String(formData.get('headline') ?? '').trim();
  const locale = String(formData.get('locale') ?? 'fr');

  if (name.length < 3) {
    return { ok: false, message: 'Le nom doit contenir au moins 3 caractères.' };
  }

  update('users', user.id, {
    name,
    city: city || null,
    phone: phone || null,
    headline: headline || null,
    locale,
  });

  return { ok: true, message: 'Profil mis à jour.' };
}
