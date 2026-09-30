/**
 * Types du domaine SMART-ELIMU.
 * Les horodatages sont des chaînes ISO-8601 (stockage SQLite).
 */

export type Role = 'LEARNER' | 'TEACHER' | 'SCHOOL_ADMIN' | 'PARTNER' | 'ADMIN';

export type UserRow = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  phone: string | null;
  city: string | null;
  province: string | null;
  country: string;
  locale: string;
  headline: string | null;
  avatarColor: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Partner = {
  id: string;
  name: string;
  slug: string;
  type: 'UNIVERSITY' | 'TRAINING_CENTER' | 'INSTITUTE' | 'HIGH_SCHOOL';
  city: string;
  province: string;
  country: string;
  logoEmoji: string;
  coverColor: string;
  description: string;
  website: string | null;
  email: string | null;
  phone: string | null;
  accreditation: string | null;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  foundedYear: number | null;
  studentsCount: number | null;
  isFeatured: boolean;
  createdAt: string;
};

export type Program = {
  id: string;
  partnerId: string;
  name: string;
  field: string;
  degree: string;
  durationMonths: number;
  language: string;
  tuitionUsd: number | null;
  requirements: string;
  description: string;
  careers: string[];
  pathwayTags: string[];
  isFeatured: boolean;
  createdAt: string;
};

export type Scholarship = {
  id: string;
  partnerId: string | null;
  title: string;
  organization: string;
  level: string;
  amountUsd: number | null;
  deadline: string;
  description: string;
  eligibility: string;
  url: string | null;
  isActive: boolean;
  createdAt: string;
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  level: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';
  language: string;
  durationHours: number;
  priceUsd: number;
  priceCdf: number;
  isCertifying: boolean;
  certificateTitle: string | null;
  coverEmoji: string;
  coverColor: string;
  partnerId: string | null;
  instructorId: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  rating: number;
  learnersCount: number;
  createdAt: string;
};

export type CourseModule = {
  id: string;
  courseId: string;
  title: string;
  summary: string | null;
  position: number;
};

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  type: 'TEXTE' | 'VIDEO' | 'ATELIER' | 'QUIZ';
  durationMin: number;
  content: string;
  videoUrl: string | null;
  resourceUrl: string | null;
  position: number;
};

export type Quiz = {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  passingScore: number;
  position: number;
};

export type QuizQuestion = {
  id: string;
  quizId: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string | null;
  points: number;
  position: number;
};

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
  progressPct: number;
  finalScore: number | null;
  enrolledAt: string;
  completedAt: string | null;
};

export type Certificate = {
  id: string;
  code: string;
  userId: string;
  courseId: string;
  partnerId: string | null;
  title: string;
  holderName: string;
  grade: string;
  score: number;
  hours: number;
  issuedAt: string;
  expiresAt: string | null;
  revoked: boolean;
  revokeReason: string | null;
};

export type School = {
  id: string;
  name: string;
  code: string;
  type: 'PRIMAIRE' | 'SECONDAIRE' | 'MIXTE' | 'TECHNIQUE';
  city: string;
  province: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  directorName: string;
  motto: string | null;
  logoEmoji: string;
  coverColor: string;
  academicYear: string;
  capacity: number;
  ownerId: string | null;
  createdAt: string;
};

export type SchoolClass = {
  id: string;
  schoolId: string;
  name: string;
  level: string;
  section: string | null;
  academicYear: string;
  capacity: number;
  room: string | null;
  mainTeacherId: string | null;
};

export type Teacher = {
  id: string;
  schoolId: string;
  userId: string | null;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  email: string | null;
  phone: string | null;
  subject: string;
  qualification: string | null;
  contractType: 'PERMANENT' | 'VACATAIRE' | 'STAGIAIRE';
  hiredAt: string;
  isActive: boolean;
};

export type Student = {
  id: string;
  schoolId: string;
  classId: string | null;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  birthDate: string | null;
  placeOfBirth: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  guardianRelation: string | null;
  address: string | null;
  enrolledAt: string;
  status: 'ACTIF' | 'TRANSFERE' | 'ABANDON' | 'DIPLOME';
  photoEmoji: string;
};

export type Attendance = {
  id: string;
  schoolId: string;
  studentId: string;
  classId: string | null;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'RETARD' | 'EXCUSE';
  note: string | null;
  createdAt: string;
};

export type Grade = {
  id: string;
  schoolId: string;
  studentId: string;
  classId: string | null;
  subject: string;
  period: string;
  score: number;
  maxScore: number;
  coefficient: number;
  teacherName: string | null;
  comment: string | null;
  createdAt: string;
};

export type Invoice = {
  id: string;
  schoolId: string;
  studentId: string;
  label: string;
  period: string;
  amount: number;
  currency: 'CDF' | 'USD';
  dueDate: string;
  status: 'IMPAYE' | 'PARTIEL' | 'PAYE' | 'ANNULE';
  createdAt: string;
};

export type Payment = {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: string;
  reference: string | null;
  paidAt: string;
  recordedById: string | null;
};

export type OrientationResult = {
  id: string;
  userId: string | null;
  shareCode: string;
  respondentName: string;
  respondentEmail: string | null;
  educationLevel: string;
  scores: Record<string, number>;
  profileCode: string;
  profileLabel: string;
  topFields: string[];
  recommendedProgramIds: string[];
  answers: Record<string, string>;
  createdAt: string;
};

export type ProgramApplication = {
  id: string;
  programId: string;
  partnerId: string;
  userId: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  city: string | null;
  message: string | null;
  status: 'SUBMITTED' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED' | 'ENROLLED';
  createdAt: string;
};

export type PartnershipRequest = {
  id: string;
  organizationName: string;
  organizationType: string;
  contactName: string;
  email: string;
  phone: string | null;
  city: string | null;
  province: string | null;
  message: string | null;
  status: 'NEW' | 'CONTACTED' | 'APPROVED' | 'REJECTED';
  reviewedById: string | null;
  createdAt: string;
};

// ---------------------------------------------------------------------------
// Types composites (jointures)
// ---------------------------------------------------------------------------

export type CourseWithMeta = Course & {
  partnerName: string | null;
  partnerLogo: string | null;
  instructorName: string | null;
  moduleCount: number;
  lessonCount: number;
};

export type EnrollmentWithCourse = Enrollment & { course: Course };

export type CertificateWithCourse = Certificate & {
  courseTitle: string | null;
  partnerName: string | null;
  partnerLogo: string | null;
};

export type StudentWithClass = Student & { className: string | null; classLevel: string | null };

export type ProgramWithPartner = Program & {
  partnerName: string;
  partnerCity: string;
  partnerLogo: string;
  partnerType: string;
};
