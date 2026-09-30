import 'server-only';
import { query, queryOne, countRows } from '../sqlite';
import type { Role, UserRow } from '../types';

export function getUserById(id: string): UserRow | null {
  return queryOne<UserRow>('SELECT * FROM users WHERE id = ?', [id]);
}

export function getUserByEmail(email: string): UserRow | null {
  return queryOne<UserRow>('SELECT * FROM users WHERE lower(email) = lower(?)', [email.trim()]);
}

export function listUsers(filters: { role?: string; q?: string; limit?: number } = {}) {
  const where: string[] = [];
  const params: unknown[] = [];
  if (filters.role) {
    where.push('role = ?');
    params.push(filters.role);
  }
  if (filters.q) {
    where.push('(name LIKE ? OR email LIKE ? OR city LIKE ?)');
    const like = `%${filters.q}%`;
    params.push(like, like, like);
  }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return query<UserRow>(
    `SELECT * FROM users ${clause} ORDER BY created_at DESC LIMIT ${Number(filters.limit ?? 100)}`,
    params,
  );
}

export function countUsers(role?: Role): number {
  return role ? countRows('users', { role }) : countRows('users');
}

/** Répartition mensuelle des inscriptions (page d'accueil / admin). */
export function signupsPerMonth(): { month: string; total: number }[] {
  return query<{ month: string; total: number }>(
    `SELECT strftime('%Y-%m', created_at) AS month, COUNT(*) AS total
       FROM users GROUP BY month ORDER BY month ASC`,
  );
}
