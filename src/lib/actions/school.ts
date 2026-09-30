'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { canManageSchool, requireRole, requireUser } from '../auth';
import { execute, insert, query, queryOne, update } from '../sqlite';
import { ROLES } from '../constants';
import { getSchool, nextMatricule } from '../data/school';
import type { ActionState } from './auth';

export type SchoolState = ActionState;

// ---------------------------------------------------------------------------
// Garde-fou commun
// ---------------------------------------------------------------------------

async function ensureSchoolAccess(schoolId: string) {
  const user = await requireUser();
  const allowed = await canManageSchool(user, schoolId);
  if (!allowed) redirect('/ecoles/tableau-de-bord');
  return user;
}

function revalidateSchool(extra: string[] = []) {
  const paths = [
    '/ecoles/tableau-de-bord',
    '/ecoles/tableau-de-bord/eleves',
    '/ecoles/tableau-de-bord/classes',
    '/ecoles/tableau-de-bord/finances',
    '/ecoles/tableau-de-bord/presences',
    '/ecoles/tableau-de-bord/notes',
    ...extra,
  ];
  for (const path of paths) revalidatePath(path);
}

// ---------------------------------------------------------------------------
// Inscription d'un établissement
// ---------------------------------------------------------------------------

const schoolSchema = z.object({
  name: z.string().min(3, 'Nom de l’établissement requis'),
  type: z.enum(['PRIMAIRE', 'SECONDAIRE', 'MIXTE', 'TECHNIQUE']).default('MIXTE'),
  city: z.string().min(2, 'Ville requise'),
  province: z.string().min(2, 'Province requise'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Adresse e-mail invalide').optional().or(z.literal('')),
  directorName: z.string().min(3, 'Nom du directeur requis'),
  motto: z.string().optional(),
  capacity: z.coerce.number().min(20).max(20000).default(400),
});

export async function createSchoolAction(_prev: SchoolState, formData: FormData): Promise<SchoolState> {
  const user = await requireUser('/ecoles/inscription');

  const parsed = schoolSchema.safeParse({
    name: String(formData.get('name') ?? '').trim(),
    type: String(formData.get('type') ?? 'MIXTE'),
    city: String(formData.get('city') ?? '').trim(),
    province: String(formData.get('province') ?? '').trim(),
    address: String(formData.get('address') ?? '').trim() || undefined,
    phone: String(formData.get('phone') ?? '').trim() || undefined,
    email: String(formData.get('email') ?? '').trim(),
    directorName: String(formData.get('directorName') ?? '').trim(),
    motto: String(formData.get('motto') ?? '').trim() || undefined,
    capacity: Number(formData.get('capacity') ?? 400),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0] ?? 'form')] = issue.message;
    }
    return { ok: false, message: 'Veuillez corriger les champs signalés.', fieldErrors };
  }

  const data = parsed.data;
  const code = `${data.type.slice(0, 2)}-${data.province.slice(0, 3).toUpperCase()}-${String(
    Math.floor(Math.random() * 9000 + 1000),
  )}`;

  const schoolId = insert('schools', {
    name: data.name,
    code,
    type: data.type,
    city: data.city,
    province: data.province,
    address: data.address ?? null,
    phone: data.phone ?? null,
    email: data.email || null,
    directorName: data.directorName,
    motto: data.motto ?? null,
    logoEmoji: '🏫',
    coverColor: '#0d2a6b',
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    capacity: data.capacity,
    ownerId: user.id,
  });

  if (user.role === ROLES.LEARNER) {
    update('users', user.id, { role: ROLES.SCHOOL_ADMIN });
  }

  revalidatePath('/ecoles');
  redirect(`/ecoles/tableau-de-bord?school=${schoolId}`);
}

// ---------------------------------------------------------------------------
// Élèves
// ---------------------------------------------------------------------------

const studentSchema = z.object({
  schoolId: z.string().min(3),
  classId: z.string().optional(),
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  gender: z.enum(['M', 'F']).default('M'),
  birthDate: z.string().optional(),
  placeOfBirth: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianRelation: z.string().optional(),
  address: z.string().optional(),
});

export async function addStudentAction(_prev: SchoolState, formData: FormData): Promise<SchoolState> {
  const parsed = studentSchema.safeParse({
    schoolId: String(formData.get('schoolId') ?? ''),
    classId: String(formData.get('classId') ?? '') || undefined,
    firstName: String(formData.get('firstName') ?? '').trim(),
    lastName: String(formData.get('lastName') ?? '').trim(),
    gender: String(formData.get('gender') ?? 'M'),
    birthDate: String(formData.get('birthDate') ?? '') || undefined,
    placeOfBirth: String(formData.get('placeOfBirth') ?? '').trim() || undefined,
    guardianName: String(formData.get('guardianName') ?? '').trim() || undefined,
    guardianPhone: String(formData.get('guardianPhone') ?? '').trim() || undefined,
    guardianRelation: String(formData.get('guardianRelation') ?? '').trim() || undefined,
    address: String(formData.get('address') ?? '').trim() || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0] ?? 'form')] = issue.message;
    }
    return { ok: false, message: 'Veuillez compléter les informations de l’élève.', fieldErrors };
  }

  const data = parsed.data;
  await ensureSchoolAccess(data.schoolId);
  const school = getSchool(data.schoolId);

  insert('students', {
    schoolId: data.schoolId,
    classId: data.classId ?? null,
    matricule: nextMatricule(data.schoolId, school?.academicYear ?? '2026-2027'),
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : null,
    placeOfBirth: data.placeOfBirth ?? null,
    guardianName: data.guardianName ?? null,
    guardianPhone: data.guardianPhone ?? null,
    guardianRelation: data.guardianRelation ?? null,
    address: data.address ?? null,
    enrolledAt: new Date().toISOString(),
    status: 'ACTIF',
    photoEmoji: data.gender === 'F' ? '👩🏾‍🎓' : '🧑🏾‍🎓',
  });

  revalidateSchool();
  return { ok: true, message: `${data.firstName} ${data.lastName} a été inscrit(e) avec succès.` };
}

export async function updateStudentStatusAction(formData: FormData) {
  const schoolId = String(formData.get('schoolId') ?? '');
  const studentId = String(formData.get('studentId') ?? '');
  const status = String(formData.get('status') ?? 'ACTIF');
  await ensureSchoolAccess(schoolId);
  update('students', studentId, { status });
  revalidateSchool([`/ecoles/tableau-de-bord/eleves/${studentId}`]);
}

// ---------------------------------------------------------------------------
// Classes et enseignants
// ---------------------------------------------------------------------------

export async function addClassAction(_prev: SchoolState, formData: FormData): Promise<SchoolState> {
  const schoolId = String(formData.get('schoolId') ?? '');
  await ensureSchoolAccess(schoolId);

  const name = String(formData.get('name') ?? '').trim();
  const level = String(formData.get('level') ?? '').trim();
  const section = String(formData.get('section') ?? '').trim() || null;
  const room = String(formData.get('room') ?? '').trim() || null;
  const capacity = Number(formData.get('capacity') ?? 40);
  const mainTeacherId = String(formData.get('mainTeacherId') ?? '') || null;

  if (name.length < 2 || level.length < 2) {
    return { ok: false, message: 'Le nom et le niveau de la classe sont obligatoires.' };
  }

  const school = getSchool(schoolId);
  insert('school_classes', {
    schoolId,
    name,
    level,
    section,
    academicYear: school?.academicYear ?? '2026-2027',
    capacity,
    room,
    mainTeacherId,
  });

  revalidateSchool();
  return { ok: true, message: `Classe « ${name} » créée.` };
}

export async function addTeacherAction(_prev: SchoolState, formData: FormData): Promise<SchoolState> {
  const schoolId = String(formData.get('schoolId') ?? '');
  await ensureSchoolAccess(schoolId);

  const firstName = String(formData.get('firstName') ?? '').trim();
  const lastName = String(formData.get('lastName') ?? '').trim();
  const subject = String(formData.get('subject') ?? '').trim();

  if (firstName.length < 2 || lastName.length < 2 || subject.length < 2) {
    return { ok: false, message: 'Nom, prénom et matière enseignée sont obligatoires.' };
  }

  insert('teachers', {
    schoolId,
    userId: null,
    firstName,
    lastName,
    gender: String(formData.get('gender') ?? 'M'),
    email: String(formData.get('email') ?? '').trim() || null,
    phone: String(formData.get('phone') ?? '').trim() || null,
    subject,
    qualification: String(formData.get('qualification') ?? '').trim() || null,
    contractType: String(formData.get('contractType') ?? 'PERMANENT'),
    hiredAt: new Date().toISOString(),
    isActive: true,
  });

  revalidateSchool();
  return { ok: true, message: `${firstName} ${lastName} a été ajouté(e) à l’équipe enseignante.` };
}

// ---------------------------------------------------------------------------
// Présences
// ---------------------------------------------------------------------------

export async function saveAttendanceAction(formData: FormData) {
  const schoolId = String(formData.get('schoolId') ?? '');
  const classId = String(formData.get('classId') ?? '') || null;
  const date = String(formData.get('date') ?? new Date().toISOString().slice(0, 10));
  await ensureSchoolAccess(schoolId);

  const students = classId
    ? query<{ id: string }>(
        "SELECT id FROM students WHERE school_id = ? AND class_id = ? AND status = 'ACTIF' ORDER BY last_name",
        [schoolId, classId],
      )
    : query<{ id: string }>(
        "SELECT id FROM students WHERE school_id = ? AND status = 'ACTIF' ORDER BY last_name",
        [schoolId],
      );

  for (const student of students) {
    const status = String(formData.get(`status_${student.id}`) ?? 'PRESENT');
    const existing = queryOne<{ id: string }>(
      'SELECT id FROM attendances WHERE student_id = ? AND date = ?',
      [student.id, date],
    );
    if (existing) {
      update('attendances', existing.id, { status, classId });
    } else {
      insert('attendances', {
        schoolId,
        studentId: student.id,
        classId,
        date,
        status,
        note: null,
      });
    }
  }

  revalidateSchool();
  redirect(`/ecoles/tableau-de-bord/presences?classe=${classId ?? ''}&date=${date}&enregistre=1`);
}

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------

export async function saveGradesAction(formData: FormData) {
  const schoolId = String(formData.get('schoolId') ?? '');
  const classId = String(formData.get('classId') ?? '');
  const subject = String(formData.get('subject') ?? '');
  const period = String(formData.get('period') ?? 'T1');
  const maxScore = Number(formData.get('maxScore') ?? 100);
  const coefficient = Number(formData.get('coefficient') ?? 1);
  const teacherName = String(formData.get('teacherName') ?? '').trim() || null;

  await ensureSchoolAccess(schoolId);
  if (!classId || !subject) throw new Error('Classe et matière obligatoires');

  const students = query<{ id: string }>(
    "SELECT id FROM students WHERE school_id = ? AND class_id = ? AND status = 'ACTIF'",
    [schoolId, classId],
  );

  let saved = 0;
  for (const student of students) {
    const raw = formData.get(`score_${student.id}`);
    if (raw === null || String(raw).trim() === '') continue;
    const score = Number(raw);
    if (Number.isNaN(score)) continue;

    execute('DELETE FROM grades WHERE student_id = ? AND subject = ? AND period = ?', [
      student.id,
      subject,
      period,
    ]);
    insert('grades', {
      schoolId,
      studentId: student.id,
      classId,
      subject,
      period,
      score,
      maxScore,
      coefficient,
      teacherName,
      comment: null,
    });
    saved += 1;
  }

  revalidateSchool(['/ecoles/tableau-de-bord/bulletins']);
  redirect(
    `/ecoles/tableau-de-bord/notes?classe=${classId}&periode=${period}&matiere=${encodeURIComponent(subject)}&enregistre=${saved}`,
  );
}

// ---------------------------------------------------------------------------
// Frais scolaires
// ---------------------------------------------------------------------------

export async function addInvoiceAction(_prev: SchoolState, formData: FormData): Promise<SchoolState> {
  const schoolId = String(formData.get('schoolId') ?? '');
  await ensureSchoolAccess(schoolId);

  const classId = String(formData.get('classId') ?? '');
  const label = String(formData.get('label') ?? '').trim();
  const period = String(formData.get('period') ?? 'T1');
  const amount = Number(formData.get('amount') ?? 0);
  const currency = String(formData.get('currency') ?? 'CDF');
  const dueDate = String(formData.get('dueDate') ?? '');

  if (!label || amount <= 0 || !dueDate) {
    return { ok: false, message: 'Libellé, montant et échéance sont obligatoires.' };
  }

  const students = classId
    ? query<{ id: string }>(
        "SELECT id FROM students WHERE school_id = ? AND class_id = ? AND status = 'ACTIF'",
        [schoolId, classId],
      )
    : query<{ id: string }>("SELECT id FROM students WHERE school_id = ? AND status = 'ACTIF'", [schoolId]);

  for (const student of students) {
    insert('invoices', {
      schoolId,
      studentId: student.id,
      label,
      period,
      amount,
      currency,
      dueDate: new Date(dueDate).toISOString(),
      status: 'IMPAYE',
    });
  }

  revalidateSchool();
  return { ok: true, message: `${students.length} facture(s) créée(s).` };
}

export async function recordPaymentAction(_prev: SchoolState, formData: FormData): Promise<SchoolState> {
  const schoolId = String(formData.get('schoolId') ?? '');
  const invoiceId = String(formData.get('invoiceId') ?? '');
  const amount = Number(formData.get('amount') ?? 0);
  const method = String(formData.get('method') ?? 'MOBILE_MONEY');
  const reference = String(formData.get('reference') ?? '').trim() || null;

  const user = await ensureSchoolAccess(schoolId);
  if (!invoiceId || amount <= 0) {
    return { ok: false, message: 'Montant invalide.' };
  }

  const invoice = queryOne<{ id: string; amount: number }>('SELECT * FROM invoices WHERE id = ?', [invoiceId]);
  if (!invoice) return { ok: false, message: 'Facture introuvable.' };

  insert('payments', {
    invoiceId,
    amount,
    currency: 'CDF',
    method,
    reference,
    paidAt: new Date().toISOString(),
    recordedById: user.id,
  });

  const paid = queryOne<{ total: number }>(
    'SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE invoice_id = ?',
    [invoiceId],
  );
  const total = paid?.total ?? 0;
  update('invoices', invoiceId, {
    status: total >= invoice.amount ? 'PAYE' : total > 0 ? 'PARTIEL' : 'IMPAYE',
  });

  revalidateSchool();
  return { ok: true, message: 'Paiement enregistré et facture mise à jour.' };
}

/** Point d'entrée utilisé par la page des enseignants pour vérifier les droits. */
export async function ensureTeacherAccess() {
  return requireRole([ROLES.TEACHER, ROLES.SCHOOL_ADMIN, ROLES.ADMIN]);
}
