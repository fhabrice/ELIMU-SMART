import 'server-only';
import { query, queryOne } from '../sqlite';
import type {
  Partner,
  Program,
  ProgramWithPartner,
  Scholarship,
  PartnershipRequest,
  ProgramApplication,
} from '../types';

const PARTNER_SELECT = `
  SELECT p.*,
         (SELECT COUNT(*) FROM programs pr WHERE pr.partner_id = p.id) AS program_count,
         (SELECT COUNT(*) FROM courses c WHERE c.partner_id = p.id AND c.status = 'PUBLISHED') AS course_count
    FROM partners p
`;

export type PartnerWithCounts = Partner & { programCount: number; courseCount: number };

export function listPartners(filters: { q?: string; type?: string; province?: string; limit?: number } = {}) {
  const where: string[] = ["p.status = 'ACTIVE'"];
  const params: unknown[] = [];

  if (filters.q) {
    where.push('(p.name LIKE ? OR p.description LIKE ? OR p.city LIKE ?)');
    const like = `%${filters.q}%`;
    params.push(like, like, like);
  }
  if (filters.type) {
    where.push('p.type = ?');
    params.push(filters.type);
  }
  if (filters.province) {
    where.push('p.province = ?');
    params.push(filters.province);
  }

  const limit = filters.limit ? `LIMIT ${Number(filters.limit)}` : '';
  return query<PartnerWithCounts>(
    `${PARTNER_SELECT} WHERE ${where.join(' AND ')} ORDER BY p.is_featured DESC, p.name ASC ${limit}`,
    params,
  );
}

export function getPartnerBySlug(slug: string): PartnerWithCounts | null {
  return queryOne<PartnerWithCounts>(`${PARTNER_SELECT} WHERE p.slug = ?`, [slug]);
}

export function getPartnerById(id: string): PartnerWithCounts | null {
  return queryOne<PartnerWithCounts>(`${PARTNER_SELECT} WHERE p.id = ?`, [id]);
}

export function listProgramsByPartner(partnerId: string): Program[] {
  return query<Program>(
    'SELECT * FROM programs WHERE partner_id = ? ORDER BY is_featured DESC, name ASC',
    [partnerId],
  );
}

export function listPrograms(filters: { q?: string; field?: string; degree?: string; limit?: number } = {}) {
  const where: string[] = ["p.status = 'ACTIVE'"];
  const params: unknown[] = [];

  if (filters.q) {
    where.push('(pr.name LIKE ? OR pr.description LIKE ? OR pr.field LIKE ?)');
    const like = `%${filters.q}%`;
    params.push(like, like, like);
  }
  if (filters.field) {
    where.push('pr.field = ?');
    params.push(filters.field);
  }
  if (filters.degree) {
    where.push('pr.degree = ?');
    params.push(filters.degree);
  }

  const limit = filters.limit ? `LIMIT ${Number(filters.limit)}` : '';
  return query<ProgramWithPartner>(
    `SELECT pr.*, p.name AS partner_name, p.city AS partner_city,
            p.logo_emoji AS partner_logo, p.type AS partner_type
       FROM programs pr
       JOIN partners p ON p.id = pr.partner_id
      WHERE ${where.join(' AND ')}
      ORDER BY pr.is_featured DESC, pr.name ASC ${limit}`,
    params,
  );
}

export function getProgram(id: string): (Program & { partnerName: string; partnerSlug: string; partnerCity: string; partnerLogo: string }) | null {
  return queryOne(
    `SELECT pr.*, p.name AS partner_name, p.slug AS partner_slug,
            p.city AS partner_city, p.logo_emoji AS partner_logo
       FROM programs pr
       JOIN partners p ON p.id = pr.partner_id
      WHERE pr.id = ?`,
    [id],
  );
}

export function listProgramFields(): { field: string; total: number }[] {
  return query<{ field: string; total: number }>(
    'SELECT field, COUNT(*) AS total FROM programs GROUP BY field ORDER BY total DESC',
  );
}

/** Programmes dont les tags correspondent au profil d'orientation fourni. */
export function recommendProgramsForProfile(dimensions: string[], limit = 6): ProgramWithPartner[] {
  if (dimensions.length === 0) return [];
  const clauses = dimensions.map(() => "pr.pathway_tags LIKE ?");
  const params = dimensions.map((dimension) => `%${dimension}%`);
  return query<ProgramWithPartner>(
    `SELECT pr.*, p.name AS partner_name, p.city AS partner_city,
            p.logo_emoji AS partner_logo, p.type AS partner_type
       FROM programs pr
       JOIN partners p ON p.id = pr.partner_id
      WHERE p.status = 'ACTIVE' AND (${clauses.join(' OR ')})
      ORDER BY pr.is_featured DESC, pr.name ASC
      LIMIT ${Number(limit)}`,
    params,
  );
}

export function listScholarships(filters: { level?: string; activeOnly?: boolean } = {}): (Scholarship & {
  partnerName: string | null;
  partnerLogo: string | null;
  partnerSlug: string | null;
})[] {
  const where: string[] = [];
  const params: unknown[] = [];
  if (filters.activeOnly !== false) where.push('s.is_active = 1');
  if (filters.level) {
    where.push('s.level = ?');
    params.push(filters.level);
  }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return query(
    `SELECT s.*, p.name AS partner_name, p.logo_emoji AS partner_logo, p.slug AS partner_slug
       FROM scholarships s
       LEFT JOIN partners p ON p.id = s.partner_id
       ${clause}
      ORDER BY s.deadline ASC`,
    params,
  );
}

export function listPartnershipRequests(limit = 50): (PartnershipRequest & { reviewerName: string | null })[] {
  return query(
    `SELECT r.*, u.name AS reviewer_name
       FROM partnership_requests r
       LEFT JOIN users u ON u.id = r.reviewed_by_id
      ORDER BY r.created_at DESC LIMIT ?`,
    [limit],
  );
}

export function listProgramApplications(filters: { partnerId?: string; userId?: string; limit?: number } = {}) {
  const where: string[] = [];
  const params: unknown[] = [];
  if (filters.partnerId) {
    where.push('a.partner_id = ?');
    params.push(filters.partnerId);
  }
  if (filters.userId) {
    where.push('a.user_id = ?');
    params.push(filters.userId);
  }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return query<ProgramApplication & { programName: string; partnerName: string }>(
    `SELECT a.*, pr.name AS program_name, p.name AS partner_name
       FROM program_applications a
       JOIN programs pr ON pr.id = a.program_id
       JOIN partners p ON p.id = a.partner_id
       ${clause}
      ORDER BY a.created_at DESC LIMIT ${Number(filters.limit ?? 100)}`,
    params,
  );
}

export function countPartners(type?: string): number {
  return (
    queryOne<{ total: number }>(
      `SELECT COUNT(*) AS total FROM partners WHERE status = 'ACTIVE'${type ? ' AND type = ?' : ''}`,
      type ? [type] : [],
    )?.total ?? 0
  );
}

export function countPrograms(): number {
  return queryOne<{ total: number }>('SELECT COUNT(*) AS total FROM programs')?.total ?? 0;
}
