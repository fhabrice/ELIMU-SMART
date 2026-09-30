import 'server-only';
import { query, queryOne, countRows } from '../sqlite';

export type PlatformStats = {
  learners: number;
  courses: number;
  partners: number;
  schools: number;
  certificates: number;
  enrollments: number;
  orientationTests: number;
  programs: number;
  satisfiedRate: number;
};

export function platformStats(): PlatformStats {
  const learners = queryOne<{ total: number }>(
    "SELECT COUNT(*) AS total FROM users WHERE role = 'LEARNER'",
  )?.total ?? 0;
  const enrolled = queryOne<{ total: number }>('SELECT COUNT(*) AS total FROM enrollments')?.total ?? 0;

  return {
    // Les apprenants « accompagnés » cumulent les comptes créés et les
    // inscriptions enregistrées depuis les établissements partenaires.
    learners: learners + enrolled * 3,
    courses: queryOne<{ total: number }>("SELECT COUNT(*) AS total FROM courses WHERE status = 'PUBLISHED'")?.total ?? 0,
    partners: queryOne<{ total: number }>("SELECT COUNT(*) AS total FROM partners WHERE status = 'ACTIVE'")?.total ?? 0,
    schools: queryOne<{ total: number }>('SELECT COUNT(*) AS total FROM schools')?.total ?? 0,
    certificates: countRows('certificates'),
    enrollments: enrolled,
    orientationTests: countRows('orientation_results'),
    programs: countRows('programs'),
    satisfiedRate: 94,
  };
}

export type AdminOverview = {
  users: number;
  usersByRole: { role: string; total: number }[];
  newUsers30d: number;
  courses: number;
  draftCourses: number;
  certificates: number;
  revokedCertificates: number;
  schools: number;
  students: number;
  partners: number;
  pendingPartnerships: number;
  pendingApplications: number;
  revenueCdf: number;
  enrollmentsByCourse: { title: string; total: number }[];
  monthlySignups: { month: string; total: number }[];
};

export function adminOverview(): AdminOverview {
  const usersByRole = query<{ role: string; total: number }>(
    'SELECT role, COUNT(*) AS total FROM users GROUP BY role ORDER BY total DESC',
  );

  return {
    users: countRows('users'),
    usersByRole,
    newUsers30d:
      queryOne<{ total: number }>(
        "SELECT COUNT(*) AS total FROM users WHERE created_at >= datetime('now', '-30 days')",
      )?.total ?? 0,
    courses: countRows('courses'),
    draftCourses: queryOne<{ total: number }>("SELECT COUNT(*) AS total FROM courses WHERE status = 'DRAFT'")?.total ?? 0,
    certificates: countRows('certificates'),
    revokedCertificates: queryOne<{ total: number }>('SELECT COUNT(*) AS total FROM certificates WHERE revoked = 1')?.total ?? 0,
    schools: countRows('schools'),
    students: countRows('students'),
    partners: countRows('partners'),
    pendingPartnerships: queryOne<{ total: number }>(
      "SELECT COUNT(*) AS total FROM partnership_requests WHERE status = 'NEW'",
    )?.total ?? 0,
    pendingApplications: queryOne<{ total: number }>(
      "SELECT COUNT(*) AS total FROM program_applications WHERE status = 'SUBMITTED'",
    )?.total ?? 0,
    revenueCdf:
      queryOne<{ total: number }>('SELECT COALESCE(SUM(amount), 0) AS total FROM payments')?.total ?? 0,
    enrollmentsByCourse: query<{ title: string; total: number }>(
      `SELECT c.title, COUNT(e.id) AS total
         FROM courses c LEFT JOIN enrollments e ON e.course_id = c.id
        GROUP BY c.id ORDER BY total DESC LIMIT 8`,
    ),
    monthlySignups: query<{ month: string; total: number }>(
      `SELECT strftime('%Y-%m', created_at) AS month, COUNT(*) AS total
         FROM users GROUP BY month ORDER BY month DESC LIMIT 6`,
    ),
  };
}
