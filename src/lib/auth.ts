import 'server-only';
import { cookies } from 'next/headers';
import { randomBytes, createHmac, timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { execute, insert, queryOne } from './sqlite';
import { ROLES, type Role } from './constants';

export const SESSION_COOKIE = 'elimu_session';
export const LOCALE_COOKIE = 'elimu_locale';
const SESSION_DAYS = 30;
const AUTH_SECRET = process.env.AUTH_SECRET ?? 'smart-elimu-dev-secret';

// ---------------------------------------------------------------------------
// Mots de passe
// ---------------------------------------------------------------------------

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export async function createSession(userId: string, userAgent?: string | null) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  insert('sessions', {
    token,
    userId,
    userAgent: userAgent ?? null,
    expiresAt: expiresAt.toISOString(),
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });
  return token;
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) execute('DELETE FROM sessions WHERE token = ?', [token]);
  store.delete(SESSION_COOKIE);
}

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  locale: string;
  avatarColor: string;
  city: string | null;
  province: string | null;
  headline: string | null;
  phone: string | null;
};

type SessionRow = {
  sessionId: string;
  expiresAt: string;
  userActive: boolean;
  id: string;
  name: string;
  email: string;
  role: Role;
  locale: string;
  avatarColor: string;
  city: string | null;
  province: string | null;
  headline: string | null;
  phone: string | null;
};

/** Utilisateur courant ou null (aucune redirection). */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const row = queryOne<SessionRow>(
      `SELECT s.id AS session_id, s.expires_at, u.id, u.name, u.email, u.role, u.locale,
              u.avatar_color, u.city, u.province, u.headline, u.phone,
              u.is_active AS user_active
         FROM sessions s
         JOIN users u ON u.id = s.user_id
        WHERE s.token = ?`,
      [token],
    );

    if (!row) return null;

    if (new Date(row.expiresAt).getTime() < Date.now()) {
      execute('DELETE FROM sessions WHERE id = ?', [row.sessionId]);
      return null;
    }
    if (!row.userActive) return null;

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      locale: row.locale,
      avatarColor: row.avatarColor,
      city: row.city,
      province: row.province,
      headline: row.headline,
      phone: row.phone,
    };
  } catch {
    return null;
  }
}

/** Utilisateur courant ou redirection vers la page de connexion. */
export async function requireUser(redirectTo = '/connexion'): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/connexion?suivant=${encodeURIComponent(redirectTo)}`);
  return user;
}

/** Utilisateur courant avec rôle exigé, sinon redirection. */
export async function requireRole(roles: Role[], redirectTo = '/tableau-de-bord'): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect(redirectTo);
  return user;
}

/** Vrai si l'utilisateur peut administrer l'établissement donné. */
export async function canManageSchool(user: SessionUser, schoolId: string): Promise<boolean> {
  if (user.role === ROLES.ADMIN) return true;
  if (user.role !== ROLES.SCHOOL_ADMIN) return false;
  const school = queryOne<{ id: string }>('SELECT id FROM schools WHERE id = ? AND owner_id = ?', [
    schoolId,
    user.id,
  ]);
  return Boolean(school);
}

// ---------------------------------------------------------------------------
// Codes de certificat + empreinte publique
// ---------------------------------------------------------------------------

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateCertificateCode(year = new Date().getFullYear()): string {
  const block = (size: number) =>
    Array.from({ length: size }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');
  return `SE-${year}-${block(4)}-${block(4)}`;
}

/**
 * Empreinte affichée sur le certificat : elle permet de vérifier l'intégrité
 * du document sans exposer la clé serveur.
 */
export function certificateFingerprint(code: string, holderName: string, issuedAt: Date | string): string {
  const date = typeof issuedAt === 'string' ? new Date(issuedAt) : issuedAt;
  const payload = `${code}|${holderName.toUpperCase()}|${date.toISOString().slice(0, 10)}`;
  return createHmac('sha256', AUTH_SECRET).update(payload).digest('hex').slice(0, 32).toUpperCase();
}

export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
