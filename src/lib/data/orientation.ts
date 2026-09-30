import 'server-only';
import { query, queryOne } from '../sqlite';
import type { OrientationResult } from '../types';

export function getOrientationResult(shareCode: string): OrientationResult | null {
  return queryOne<OrientationResult>('SELECT * FROM orientation_results WHERE share_code = ?', [
    shareCode.trim().toUpperCase(),
  ]);
}

export function listOrientationResults(userId: string): OrientationResult[] {
  return query<OrientationResult>(
    'SELECT * FROM orientation_results WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
  );
}

export function listRecentOrientationResults(limit = 10) {
  return query<OrientationResult>(
    'SELECT * FROM orientation_results order BY created_at DESC LIMIT ?',
    [limit],
  );
}

/** Répartition des profils d'orientation (statistiques plateforme). */
export function orientationProfileDistribution(): { profileCode: string; profileLabel: string; total: number }[] {
  return query<{ profileCode: string; profileLabel: string; total: number }>(
    `SELECT profile_code, profile_label, COUNT(*) AS total
       FROM orientation_results
      GROUP BY profile_code, profile_label
      ORDER BY total DESC`,
  );
}

export function countOrientationResults(): number {
  return queryOne<{ total: number }>('SELECT COUNT(*) AS total FROM orientation_results')?.total ?? 0;
}
