-- ===========================================================================
-- SMART-ELIMU — Schéma de base de données (SQLite)
-- ===========================================================================
-- Plateforme congolaise d'éducation :
--   1. Formation certifiante en ligne
--   2. Gestion d'établissement scolaire
--   3. Orientation scolaire & académique
--   4. Réseau de partenaires (universités & centres de formation agréés)
--
-- Conventions :
--   * identifiants : TEXT (cuid généré côté application)
--   * horodatages  : TEXT ISO-8601 (UTC)
--   * booléens     : INTEGER 0/1
--   * JSON         : TEXT (colonnes suffixées _json)
--   * listes "a|b" : TEXT (colonnes suffixées _pipe)
-- Une version PostgreSQL équivalente est fournie dans
-- docs/modele-de-donnees-reference.prisma.
-- ===========================================================================

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- 1. Utilisateurs & sessions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'LEARNER',
  phone         TEXT,
  city          TEXT,
  province      TEXT,
  country       TEXT NOT NULL DEFAULT 'RDC',
  locale        TEXT NOT NULL DEFAULT 'fr',
  headline      TEXT,
  avatar_color  TEXT NOT NULL DEFAULT '#1c60f0',
  is_active     INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  token      TEXT NOT NULL UNIQUE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_agent TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- ---------------------------------------------------------------------------
-- 2. Réseau de partenaires
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS partners (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  type           TEXT NOT NULL DEFAULT 'UNIVERSITY',
  city           TEXT NOT NULL,
  province       TEXT NOT NULL,
  country        TEXT NOT NULL DEFAULT 'RDC',
  logo_emoji     TEXT NOT NULL DEFAULT '🎓',
  cover_color    TEXT NOT NULL DEFAULT '#1c60f0',
  description    TEXT NOT NULL,
  website        TEXT,
  email          TEXT,
  phone          TEXT,
  accreditation  TEXT,
  status         TEXT NOT NULL DEFAULT 'ACTIVE',
  founded_year   INTEGER,
  students_count INTEGER,
  is_featured    INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_partners_type ON partners(type);
CREATE INDEX IF NOT EXISTS idx_partners_province ON partners(province);

CREATE TABLE IF NOT EXISTS programs (
  id              TEXT PRIMARY KEY,
  partner_id      TEXT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  field           TEXT NOT NULL,
  degree          TEXT NOT NULL,
  duration_months INTEGER NOT NULL,
  language        TEXT NOT NULL DEFAULT 'fr',
  tuition_usd     INTEGER,
  requirements    TEXT NOT NULL DEFAULT '',
  description     TEXT NOT NULL,
  careers_pipe    TEXT NOT NULL DEFAULT '',
  pathway_tags    TEXT NOT NULL DEFAULT '',
  is_featured     INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_programs_partner ON programs(partner_id);
CREATE INDEX IF NOT EXISTS idx_programs_field ON programs(field);

CREATE TABLE IF NOT EXISTS scholarships (
  id          TEXT PRIMARY KEY,
  partner_id  TEXT REFERENCES partners(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  organization TEXT NOT NULL,
  level       TEXT NOT NULL,
  amount_usd  INTEGER,
  deadline    TEXT NOT NULL,
  description TEXT NOT NULL,
  eligibility TEXT NOT NULL DEFAULT '',
  url         TEXT,
  is_active   INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline);

CREATE TABLE IF NOT EXISTS program_applications (
  id         TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  partner_id TEXT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  user_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
  full_name  TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  city       TEXT,
  message    TEXT,
  status     TEXT NOT NULL DEFAULT 'SUBMITTED',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_applications_status ON program_applications(status);

CREATE TABLE IF NOT EXISTS partnership_requests (
  id                TEXT PRIMARY KEY,
  organization_name TEXT NOT NULL,
  organization_type TEXT NOT NULL,
  contact_name      TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT,
  city              TEXT,
  province          TEXT,
  message           TEXT,
  status            TEXT NOT NULL DEFAULT 'NEW',
  reviewed_by_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at        TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_partnership_status ON partnership_requests(status);

-- ---------------------------------------------------------------------------
-- 3. Formation certifiante en ligne
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
  id                TEXT PRIMARY KEY,
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  summary           TEXT NOT NULL,
  description       TEXT NOT NULL,
  category          TEXT NOT NULL,
  level             TEXT NOT NULL DEFAULT 'DEBUTANT',
  language          TEXT NOT NULL DEFAULT 'fr',
  duration_hours    INTEGER NOT NULL DEFAULT 20,
  price_usd         INTEGER NOT NULL DEFAULT 0,
  price_cdf         INTEGER NOT NULL DEFAULT 0,
  is_certifying     INTEGER NOT NULL DEFAULT 1,
  certificate_title TEXT,
  cover_emoji       TEXT NOT NULL DEFAULT '📘',
  cover_color       TEXT NOT NULL DEFAULT '#1c60f0',
  partner_id        TEXT REFERENCES partners(id) ON DELETE SET NULL,
  instructor_id     TEXT REFERENCES users(id) ON DELETE SET NULL,
  status            TEXT NOT NULL DEFAULT 'PUBLISHED',
  rating            REAL NOT NULL DEFAULT 4.7,
  learners_count    INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);

CREATE TABLE IF NOT EXISTS course_modules (
  id         TEXT PRIMARY KEY,
  course_id  TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  summary    TEXT,
  position   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_modules_course ON course_modules(course_id);

CREATE TABLE IF NOT EXISTS lessons (
  id           TEXT PRIMARY KEY,
  module_id    TEXT NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  type         TEXT NOT NULL DEFAULT 'TEXTE',
  duration_min INTEGER NOT NULL DEFAULT 12,
  content      TEXT NOT NULL DEFAULT '',
  video_url    TEXT,
  resource_url TEXT,
  position     INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);

CREATE TABLE IF NOT EXISTS quizzes (
  id            TEXT PRIMARY KEY,
  course_id     TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  passing_score INTEGER NOT NULL DEFAULT 70,
  position      INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_quizzes_course ON quizzes(course_id);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id            TEXT PRIMARY KEY,
  quiz_id       TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  prompt        TEXT NOT NULL,
  choices_json  TEXT NOT NULL DEFAULT '[]',
  correct_index INTEGER NOT NULL DEFAULT 0,
  explanation   TEXT,
  points        INTEGER NOT NULL DEFAULT 1,
  position      INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_questions_quiz ON quiz_questions(quiz_id);

CREATE TABLE IF NOT EXISTS enrollments (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id    TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'ACTIVE',
  progress_pct INTEGER NOT NULL DEFAULT 0,
  final_score  INTEGER,
  enrolled_at  TEXT NOT NULL,
  completed_at TEXT,
  UNIQUE (user_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id            TEXT PRIMARY KEY,
  enrollment_id TEXT NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  lesson_id     TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at  TEXT NOT NULL,
  UNIQUE (enrollment_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id      TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score        INTEGER NOT NULL,
  passed       INTEGER NOT NULL DEFAULT 0,
  answers_json TEXT NOT NULL DEFAULT '[]',
  created_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON quiz_attempts(user_id);

CREATE TABLE IF NOT EXISTS certificates (
  id            TEXT PRIMARY KEY,
  code          TEXT NOT NULL UNIQUE,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id     TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  partner_id    TEXT REFERENCES partners(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  holder_name   TEXT NOT NULL,
  grade         TEXT NOT NULL DEFAULT 'Satisfaisant',
  score         INTEGER NOT NULL DEFAULT 0,
  hours         INTEGER NOT NULL DEFAULT 0,
  issued_at     TEXT NOT NULL,
  expires_at    TEXT,
  revoked       INTEGER NOT NULL DEFAULT 0,
  revoke_reason TEXT
);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);

-- ---------------------------------------------------------------------------
-- 4. Orientation scolaire & académique
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orientation_results (
  id                          TEXT PRIMARY KEY,
  user_id                     TEXT REFERENCES users(id) ON DELETE SET NULL,
  share_code                  TEXT NOT NULL UNIQUE,
  respondent_name             TEXT NOT NULL,
  respondent_email            TEXT,
  education_level             TEXT NOT NULL,
  scores_json                 TEXT NOT NULL DEFAULT '{}',
  profile_code                TEXT NOT NULL,
  profile_label               TEXT NOT NULL,
  top_fields_json             TEXT NOT NULL DEFAULT '[]',
  recommended_program_ids_json TEXT NOT NULL DEFAULT '[]',
  answers_json                TEXT NOT NULL DEFAULT '{}',
  created_at                  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orientation_profile ON orientation_results(profile_code);

-- ---------------------------------------------------------------------------
-- 5. Gestion d'établissement scolaire
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schools (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  code          TEXT NOT NULL UNIQUE,
  type          TEXT NOT NULL DEFAULT 'MIXTE',
  city          TEXT NOT NULL,
  province      TEXT NOT NULL,
  address       TEXT,
  phone         TEXT,
  email         TEXT,
  director_name TEXT NOT NULL,
  motto         TEXT,
  logo_emoji    TEXT NOT NULL DEFAULT '🏫',
  cover_color   TEXT NOT NULL DEFAULT '#0d2a6b',
  academic_year TEXT NOT NULL DEFAULT '2025-2026',
  capacity      INTEGER NOT NULL DEFAULT 600,
  owner_id      TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_schools_province ON schools(province);

CREATE TABLE IF NOT EXISTS teachers (
  id            TEXT PRIMARY KEY,
  school_id     TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id       TEXT UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  gender        TEXT NOT NULL DEFAULT 'M',
  email         TEXT,
  phone         TEXT,
  subject       TEXT NOT NULL,
  qualification TEXT,
  contract_type TEXT NOT NULL DEFAULT 'PERMANENT',
  hired_at      TEXT NOT NULL,
  is_active     INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_teachers_school ON teachers(school_id);

CREATE TABLE IF NOT EXISTS school_classes (
  id              TEXT PRIMARY KEY,
  school_id       TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  level           TEXT NOT NULL,
  section         TEXT,
  academic_year   TEXT NOT NULL DEFAULT '2025-2026',
  capacity        INTEGER NOT NULL DEFAULT 45,
  room            TEXT,
  main_teacher_id TEXT REFERENCES teachers(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_classes_school ON school_classes(school_id);

CREATE TABLE IF NOT EXISTS students (
  id                TEXT PRIMARY KEY,
  school_id         TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id          TEXT REFERENCES school_classes(id) ON DELETE SET NULL,
  matricule         TEXT NOT NULL,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  gender            TEXT NOT NULL DEFAULT 'M',
  birth_date        TEXT,
  place_of_birth    TEXT,
  guardian_name     TEXT,
  guardian_phone    TEXT,
  guardian_relation TEXT,
  address           TEXT,
  enrolled_at       TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'ACTIF',
  photo_emoji       TEXT NOT NULL DEFAULT '🧑🏾‍🎓',
  UNIQUE (school_id, matricule)
);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);

CREATE TABLE IF NOT EXISTS attendances (
  id         TEXT PRIMARY KEY,
  school_id  TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id   TEXT REFERENCES school_classes(id) ON DELETE SET NULL,
  date       TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'PRESENT',
  note       TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (student_id, date)
);
CREATE INDEX IF NOT EXISTS idx_attendances_school_date ON attendances(school_id, date);

CREATE TABLE IF NOT EXISTS grades (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id   TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id     TEXT REFERENCES school_classes(id) ON DELETE SET NULL,
  subject      TEXT NOT NULL,
  period       TEXT NOT NULL,
  score        REAL NOT NULL,
  max_score    REAL NOT NULL DEFAULT 100,
  coefficient  INTEGER NOT NULL DEFAULT 1,
  teacher_name TEXT,
  comment      TEXT,
  created_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_grades_student_period ON grades(student_id, period);
CREATE INDEX IF NOT EXISTS idx_grades_school_period ON grades(school_id, period);

CREATE TABLE IF NOT EXISTS invoices (
  id         TEXT PRIMARY KEY,
  school_id  TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,
  period     TEXT NOT NULL DEFAULT 'T1',
  amount     REAL NOT NULL,
  currency   TEXT NOT NULL DEFAULT 'CDF',
  due_date   TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'IMPAYE',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_invoices_school ON invoices(school_id);
CREATE INDEX IF NOT EXISTS idx_invoices_student ON invoices(student_id);

CREATE TABLE IF NOT EXISTS payments (
  id             TEXT PRIMARY KEY,
  invoice_id     TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount         REAL NOT NULL,
  currency       TEXT NOT NULL DEFAULT 'CDF',
  method         TEXT NOT NULL DEFAULT 'MOBILE_MONEY',
  reference      TEXT,
  paid_at        TEXT NOT NULL,
  recorded_by_id TEXT REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
