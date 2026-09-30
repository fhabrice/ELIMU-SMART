import 'server-only';
import { query, queryOne } from '../sqlite';
import { mentionFromAverage, decisionFromAverage } from '../constants';
import type {
  Attendance,
  Grade,
  Invoice,
  Payment,
  School,
  SchoolClass,
  Student,
  StudentWithClass,
  Teacher,
} from '../types';

// ---------------------------------------------------------------------------
// Établissements
// ---------------------------------------------------------------------------

export function listSchools(filters: { q?: string; province?: string } = {}): (School & {
  studentCount: number;
  classCount: number;
})[] {
  const where: string[] = [];
  const params: unknown[] = [];
  if (filters.q) {
    where.push('(s.name LIKE ? OR s.city LIKE ? OR s.code LIKE ?)');
    const like = `%${filters.q}%`;
    params.push(like, like, like);
  }
  if (filters.province) {
    where.push('s.province = ?');
    params.push(filters.province);
  }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return query(
    `SELECT s.*,
            (SELECT COUNT(*) FROM students st WHERE st.school_id = s.id AND st.status = 'ACTIF') AS student_count,
            (SELECT COUNT(*) FROM school_classes c WHERE c.school_id = s.id) AS class_count
       FROM schools s
       ${clause}
      ORDER BY s.name ASC`,
    params,
  );
}

export function getSchool(id: string): School | null {
  return queryOne<School>('SELECT * FROM schools WHERE id = ?', [id]);
}

export function getSchoolByOwner(userId: string): School | null {
  return queryOne<School>('SELECT * FROM schools WHERE owner_id = ? ORDER BY created_at ASC', [userId]);
}

export function listSchoolsByOwner(userId: string): School[] {
  return query<School>('SELECT * FROM schools WHERE owner_id = ? ORDER BY name ASC', [userId]);
}

export function countSchools(): number {
  return queryOne<{ total: number }>('SELECT COUNT(*) AS total FROM schools')?.total ?? 0;
}

// ---------------------------------------------------------------------------
// Classes, enseignants, élèves
// ---------------------------------------------------------------------------

export function listClasses(schoolId: string): (SchoolClass & {
  studentCount: number;
  mainTeacherName: string | null;
})[] {
  return query(
    `SELECT c.*,
            (SELECT COUNT(*) FROM students s WHERE s.class_id = c.id AND s.status = 'ACTIF') AS student_count,
            (t.first_name || ' ' || t.last_name) AS main_teacher_name
       FROM school_classes c
       LEFT JOIN teachers t ON t.id = c.main_teacher_id
      WHERE c.school_id = ?
      ORDER BY c.name ASC`,
    [schoolId],
  );
}

export function getClass(id: string): SchoolClass | null {
  return queryOne<SchoolClass>('SELECT * FROM school_classes WHERE id = ?', [id]);
}

export function listTeachers(schoolId: string): (Teacher & { classCount: number })[] {
  return query(
    `SELECT t.*,
            (SELECT COUNT(*) FROM school_classes c WHERE c.main_teacher_id = t.id) AS class_count
       FROM teachers t
      WHERE t.school_id = ?
      ORDER BY t.last_name ASC, t.first_name ASC`,
    [schoolId],
  );
}

export function listStudents(
  schoolId: string,
  filters: { classId?: string; q?: string; status?: string } = {},
): StudentWithClass[] {
  const where: string[] = ['s.school_id = ?'];
  const params: unknown[] = [schoolId];

  if (filters.classId) {
    where.push('s.class_id = ?');
    params.push(filters.classId);
  }
  if (filters.status) {
    where.push('s.status = ?');
    params.push(filters.status);
  }
  if (filters.q) {
    where.push('(s.first_name LIKE ? OR s.last_name LIKE ? OR s.matricule LIKE ?)');
    const like = `%${filters.q}%`;
    params.push(like, like, like);
  }

  return query<StudentWithClass>(
    `SELECT s.*, c.name AS class_name, c.level AS class_level
       FROM students s
       LEFT JOIN school_classes c ON c.id = s.class_id
      WHERE ${where.join(' AND ')}
      ORDER BY s.last_name ASC, s.first_name ASC`,
    params,
  );
}

export function getStudent(id: string): StudentWithClass | null {
  return queryOne<StudentWithClass>(
    `SELECT s.*, c.name AS class_name, c.level AS class_level
       FROM students s
       LEFT JOIN school_classes c ON c.id = s.class_id
      WHERE s.id = ?`,
    [id],
  );
}

export function nextMatricule(schoolId: string, academicYear: string): string {
  const school = getSchool(schoolId);
  const row = queryOne<{ total: number }>('SELECT COUNT(*) AS total FROM students WHERE school_id = ?', [
    schoolId,
  ]);
  const year = academicYear.slice(0, 4);
  const prefix = school?.code?.split('-').slice(-1)[0] ?? 'ELV';
  return `${year}/${prefix}/${String((row?.total ?? 0) + 1).padStart(3, '0')}`;
}

// ---------------------------------------------------------------------------
// Notes, bulletins et classements
// ---------------------------------------------------------------------------

export type SubjectAverage = {
  subject: string;
  average: number;
  coefficient: number;
  evaluations: number;
  teacherName: string | null;
  comment: string | null;
};

export function listGrades(studentId: string, period?: string): Grade[] {
  if (period) {
    return query<Grade>(
      'SELECT * FROM grades WHERE student_id = ? AND period = ? ORDER BY subject ASC, created_at ASC',
      [studentId, period],
    );
  }
  return query<Grade>('SELECT * FROM grades WHERE student_id = ? ORDER BY period ASC, subject ASC', [
    studentId,
  ]);
}

export function subjectAverages(studentId: string, period: string): SubjectAverage[] {
  return query<SubjectAverage>(
    `SELECT subject,
            SUM(score * coefficient) / SUM(coefficient) AS average,
            SUM(coefficient) AS coefficient,
            COUNT(*) AS evaluations,
            MAX(teacher_name) AS teacher_name,
            MAX(comment) AS comment
       FROM grades
      WHERE student_id = ? AND period = ?
      GROUP BY subject
      ORDER BY subject ASC`,
    [studentId, period],
  );
}

export function weightedAverage(rows: SubjectAverage[]): number {
  const totalCoefficient = rows.reduce((sum, row) => sum + row.coefficient, 0);
  if (totalCoefficient === 0) return 0;
  const total = rows.reduce((sum, row) => sum + row.average * row.coefficient, 0);
  return Math.round((total / totalCoefficient) * 100) / 100;
}

export type ClassRankingEntry = {
  studentId: string;
  matricule: string;
  fullName: string;
  average: number;
  rank: number;
};

export function classRanking(classId: string, period: string): ClassRankingEntry[] {
  const rows = query<{ studentId: string; matricule: string; fullName: string; average: number }>(
    `SELECT g.student_id,
            s.matricule,
            (s.first_name || ' ' || s.last_name) AS full_name,
            SUM(g.score * g.coefficient) / SUM(g.coefficient) AS average
       FROM grades g
       JOIN students s ON s.id = g.student_id
      WHERE g.class_id = ? AND g.period = ?
      GROUP BY g.student_id
      ORDER BY average DESC`,
    [classId, period],
  );

  return rows.map((row, index) => ({ ...row, rank: index + 1 }));
}

export type ReportCard = {
  student: StudentWithClass;
  class: SchoolClass | null;
  period: string;
  rows: SubjectAverage[];
  average: number;
  mention: string;
  decision: string;
  rank: number | null;
  classSize: number;
  hoursAbsent: number;
  school: School | null;
};

export function buildReportCard(studentId: string, period: string): ReportCard | null {
  const student = getStudent(studentId);
  if (!student) return null;

  const rows = subjectAverages(studentId, period);
  const average = weightedAverage(rows);
  const klass = student.classId ? getClass(student.classId) : null;

  let rank: number | null = null;
  let classSize = 0;
  if (student.classId) {
    const ranking = classRanking(student.classId, period);
    classSize = ranking.length;
    rank = ranking.find((entry) => entry.studentId === studentId)?.rank ?? null;
  }

  const absences =
    queryOne<{ total: number }>(
      `SELECT COUNT(*) AS total FROM attendances WHERE student_id = ? AND status = 'ABSENT'`,
      [studentId],
    )?.total ?? 0;

  return {
    student,
    class: klass,
    period,
    rows,
    average,
    mention: mentionFromAverage(average),
    decision: decisionFromAverage(average),
    rank,
    classSize,
    hoursAbsent: absences,
    school: getSchool(student.schoolId),
  };
}

/** Statistiques globales d'un établissement (tableau de bord). */
export type SchoolOverview = {
  students: number;
  girls: number;
  boys: number;
  classes: number;
  teachers: number;
  attendanceRate: number;
  attendanceWindow: number;
  invoicedCdf: number;
  collectedCdf: number;
  outstandingCdf: number;
  collectionRate: number;
  defaulters: number;
  averageScore: number;
  byClass: { id: string; name: string; level: string; students: number; capacity: number; average: number | null }[];
};

export function getSchoolOverview(schoolId: string, period = 'T1'): SchoolOverview {
  const students = listStudents(schoolId, { status: 'ACTIF' });
  const classes = listClasses(schoolId);
  const teachers = listTeachers(schoolId);

  const attendance = queryOne<{ present: number; total: number }>(
    `SELECT SUM(CASE WHEN status IN ('PRESENT','RETARD') THEN 1 ELSE 0 END) AS present,
            COUNT(*) AS total
       FROM attendances
      WHERE school_id = ? AND date >= date('now', '-30 days')`,
    [schoolId],
  );

  const finance = queryOne<{ invoiced: number; collected: number }>(
    `SELECT COALESCE(SUM(i.amount), 0) AS invoiced,
            COALESCE((SELECT SUM(p.amount) FROM payments p
                        JOIN invoices i2 ON i2.id = p.invoice_id
                       WHERE i2.school_id = ?), 0) AS collected
       FROM invoices i
      WHERE i.school_id = ? AND i.status != 'ANNULE'`,
    [schoolId, schoolId],
  );

  const defaulters =
    queryOne<{ total: number }>(
      `SELECT COUNT(DISTINCT i.student_id) AS total
         FROM invoices i
        WHERE i.school_id = ?
          AND i.status != 'ANNULE'
          AND (SELECT COALESCE(SUM(p.amount), 0) FROM payments p WHERE p.invoice_id = i.id) < i.amount`,
      [schoolId],
    )?.total ?? 0;

  const scoreRow = queryOne<{ average: number | null }>(
    `SELECT AVG(score) AS average FROM grades WHERE school_id = ? AND period = ?`,
    [schoolId, period],
  );

  const invoiced = finance?.invoiced ?? 0;
  const collected = finance?.collected ?? 0;

  const ranking = classes.map((klass) => {
    const row = queryOne<{ average: number | null }>(
      `SELECT AVG(score) AS average FROM grades WHERE class_id = ? AND period = ?`,
      [klass.id, period],
    );
    return {
      id: klass.id,
      name: klass.name,
      level: klass.level,
      students: klass.studentCount,
      capacity: klass.capacity,
      average: row?.average ? Math.round(row.average * 100) / 100 : null,
    };
  });

  return {
    students: students.length,
    girls: students.filter((student) => student.gender === 'F').length,
    boys: students.filter((student) => student.gender === 'M').length,
    classes: classes.length,
    teachers: teachers.length,
    attendanceRate: attendance && attendance.total > 0 ? Math.round((attendance.present / attendance.total) * 100) : 0,
    attendanceWindow: attendance?.total ?? 0,
    invoicedCdf: invoiced,
    collectedCdf: collected,
    outstandingCdf: Math.max(invoiced - collected, 0),
    collectionRate: invoiced > 0 ? Math.round((collected / invoiced) * 100) : 0,
    defaulters,
    averageScore: scoreRow?.average ? Math.round(scoreRow.average * 100) / 100 : 0,
    byClass: ranking,
  };
}

// ---------------------------------------------------------------------------
// Présences
// ---------------------------------------------------------------------------

export function listAttendanceForDate(schoolId: string, date: string, classId?: string) {
  const where = ['a.school_id = ?', 'date(a.date) = date(?)'];
  const params: unknown[] = [schoolId, date];
  if (classId) {
    where.push('a.class_id = ?');
    params.push(classId);
  }
  return query<Attendance & { firstName: string; lastName: string; matricule: string }>(
    `SELECT a.*, s.first_name, s.last_name, s.matricule
       FROM attendances a
       JOIN students s ON s.id = a.student_id
      WHERE ${where.join(' AND ')}
      ORDER BY s.last_name, s.first_name`,
    params,
  );
}

export function recentAttendanceDays(schoolId: string, limit = 10): { date: string; present: number; total: number }[] {
  return query(
    `SELECT date(a.date) AS date,
            SUM(CASE WHEN a.status IN ('PRESENT','RETARD') THEN 1 ELSE 0 END) AS present,
            COUNT(*) AS total
       FROM attendances a
      WHERE a.school_id = ?
      GROUP BY date(a.date)
      ORDER BY date DESC
      LIMIT ?`,
    [schoolId, limit],
  );
}

export function attendanceByStudent(studentId: string, limit = 30) {
  return query<Attendance>(
    'SELECT * FROM attendances WHERE student_id = ? ORDER BY date DESC LIMIT ?',
    [studentId, limit],
  );
}

// ---------------------------------------------------------------------------
// Frais scolaires
// ---------------------------------------------------------------------------

export type InvoiceWithBalance = Invoice & {
  paid: number;
  balance: number;
  firstName: string;
  lastName: string;
  matricule: string;
  className: string | null;
};

export function listInvoices(
  schoolId: string,
  filters: { status?: string; q?: string; limit?: number } = {},
): InvoiceWithBalance[] {
  const where: string[] = ['i.school_id = ?'];
  const params: unknown[] = [schoolId];

  if (filters.status) {
    where.push('i.status = ?');
    params.push(filters.status);
  }
  if (filters.q) {
    where.push('(s.first_name LIKE ? OR s.last_name LIKE ? OR s.matricule LIKE ?)');
    const like = `%${filters.q}%`;
    params.push(like, like, like);
  }

  return query<InvoiceWithBalance>(
    `${INVOICE_SELECT}
      WHERE ${where.join(' AND ')}
      ORDER BY i.due_date ASC, s.last_name ASC
      LIMIT ${Number(filters.limit ?? 200)}`,
    params,
  );
}

const INVOICE_SELECT = `SELECT i.*, s.first_name, s.last_name, s.matricule, c.name AS class_name,
        COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.invoice_id = i.id), 0) AS paid,
        i.amount - COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.invoice_id = i.id), 0) AS balance
   FROM invoices i
   JOIN students s ON s.id = i.student_id
   LEFT JOIN school_classes c ON c.id = s.class_id`;

/** Facture individuelle avec son solde — utile pour le formulaire de paiement. */
export function getInvoice(invoiceId: string): InvoiceWithBalance | null {
  return queryOne<InvoiceWithBalance>(`${INVOICE_SELECT} WHERE i.id = ?`, [invoiceId]);
}

export function listPaymentsForInvoice(invoiceId: string): Payment[] {
  return query<Payment>('SELECT * FROM payments WHERE invoice_id = ? ORDER BY paid_at DESC', [invoiceId]);
}

export function financeTotals(schoolId: string) {
  const row = queryOne<{ invoiced: number; collected: number; count: number }>(
    `SELECT COALESCE(SUM(i.amount), 0) AS invoiced,
            COALESCE((SELECT SUM(p.amount) FROM payments p JOIN invoices i2 ON i2.id = p.invoice_id
                       WHERE i2.school_id = ?), 0) AS collected,
            COUNT(*) AS count
       FROM invoices i WHERE i.school_id = ? AND i.status != 'ANNULE'`,
    [schoolId, schoolId],
  );
  const invoiced = row?.invoiced ?? 0;
  const collected = row?.collected ?? 0;
  return {
    invoiced,
    collected,
    outstanding: Math.max(invoiced - collected, 0),
    count: row?.count ?? 0,
    collectionRate: invoiced > 0 ? Math.round((collected / invoiced) * 100) : 0,
  };
}

export function studentInvoices(studentId: string): InvoiceWithBalance[] {
  return query<InvoiceWithBalance>(
    `SELECT i.*, s.first_name, s.last_name, s.matricule,
            COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.invoice_id = i.id), 0) AS paid,
            i.amount - COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.invoice_id = i.id), 0) AS balance
       FROM invoices i
       JOIN students s ON s.id = i.student_id
      WHERE i.student_id = ?
      ORDER BY i.due_date ASC`,
    [studentId],
  );
}
