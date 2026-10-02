/**
 * Couche d'accès aux données SMART-ELIMU (SQLite via better-sqlite3).
 *
 * Elle offre :
 *   • une connexion unique (singleton, compatible rechargement à chaud Next.js) ;
 *   • l'application automatique du schéma `db/schema.sql` + une migration
 *     légère des colonnes manquantes ;
 *   • une correspondance camelCase ↔ snake_case, avec conversion automatique
 *     des booléens (INTEGER 0/1), des colonnes `_json` (JSON) et `_pipe`
 *     (listes « a|b »).
 *
 * Exemple :
 *   insert('courses', { title: 'Bureautique', priceUsd: 25, isCertifying: true });
 *   query('SELECT * FROM courses WHERE status = ?', ['PUBLISHED']);
 */
import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { randomBytes } from 'node:crypto';

// ---------------------------------------------------------------------------
// Connexion
// ---------------------------------------------------------------------------

// Sur Netlify / AWS Lambda, seul /tmp est inscriptible : la base de démonstration
// embarquée au build (data/smart-elimu.db) y est copiée au premier appel.
const IS_SERVERLESS = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
const BUNDLED_DB = path.join(process.cwd(), 'data', 'smart-elimu.db');
const DATA_DIR =
  process.env.ELIMU_DATA_DIR ?? (IS_SERVERLESS ? '/tmp/elimu' : path.join(process.cwd(), 'data'));
const DB_FILE = process.env.DATABASE_FILE ?? path.join(DATA_DIR, 'smart-elimu.db');
const SCHEMA_FILE = path.join(process.cwd(), 'db', 'schema.sql');

export type ColumnKind = 'json' | 'pipe' | 'bool' | 'plain';
type SchemaMap = Map<string, { column: string; kind: ColumnKind }>;

function columnKind(column: string): ColumnKind {
  if (column.endsWith('_json')) return 'json';
  if (column.endsWith('_pipe')) return 'pipe';
  if (column.startsWith('is_') || column === 'revoked' || column === 'passed') return 'bool';
  return 'plain';
}

/** `scores_json` → `scores`, `is_active` → `isActive`, `careers_pipe` → `careers`. */
export function logicalKey(column: string): string {
  const kind = columnKind(column);
  const base =
    kind === 'json' || kind === 'pipe' ? column.replace(/_(json|pipe)$/, '') : column;
  const camel = base.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
  return camel;
}

/** `priceUsd` → `price_usd`. */
export function physicalColumn(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

// ---------------------------------------------------------------------------
// Client singleton
// ---------------------------------------------------------------------------

const globalForDb = globalThis as unknown as {
  __elimuDb?: Database.Database;
  __elimuSchema?: Map<string, { forward: SchemaMap; reverse: Map<string, { key: string; kind: ColumnKind }> }>;
};

function bootstrap(db: Database.Database) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

  // 1. Création des tables (idempotent).
  const schema = fs.readFileSync(SCHEMA_FILE, 'utf8');
  db.exec(schema);

  // 2. Migration légère : ajout des colonnes apparues depuis la création.
  const definitions = new Map<string, string[]>();
  const tableRegex = /CREATE TABLE IF NOT EXISTS\s+(\w+)\s*\(([\s\S]*?)\n\);/g;
  let match: RegExpExecArray | null;
  while ((match = tableRegex.exec(schema))) {
    definitions.set(match[1], match[2].split('\n'));
  }

  for (const [table, lines] of definitions) {
    const existing = new Set(
      (db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]).map((c) => c.name),
    );
    for (const rawLine of lines) {
      const line = rawLine.trim().replace(/,$/, '');
      if (!line) continue;
      if (/^(UNIQUE|FOREIGN KEY|PRIMARY KEY|CONSTRAINT|CHECK)/i.test(line)) continue;
      const columnName = line.match(/^(\w+)\s/)?.[1];
      if (!columnName || existing.has(columnName)) continue;
      // SQLite refuse NOT NULL / UNIQUE lors d'un ALTER TABLE ADD COLUMN.
      const type = line.replace(/^\w+\s+/, '').replace(/NOT NULL/gi, '').replace(/UNIQUE/gi, '').trim();
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${columnName} ${type};`);
    }
  }
}

export function getDb(): Database.Database {
  if (globalForDb.__elimuDb) return globalForDb.__elimuDb;

  // SQLite ne crée pas les dossiers manquants : on s'en assure avant l'ouverture.
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

  if (IS_SERVERLESS && !fs.existsSync(DB_FILE) && fs.existsSync(BUNDLED_DB)) {
    fs.copyFileSync(BUNDLED_DB, DB_FILE);
  }

  const db = new Database(DB_FILE);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');
  bootstrap(db);

  if (process.env.NODE_ENV !== 'production') globalForDb.__elimuDb = db;
  globalForDb.__elimuDb = db;
  return db;
}

type TableSchema = { forward: SchemaMap; reverse: Map<string, { key: string; kind: ColumnKind }> };

/** Carte du schéma (par table) pour la traduction des colonnes. */
function schemaFor(table: string): TableSchema {
  const cache = (globalForDb.__elimuSchema ??= new Map<string, TableSchema>());
  const cached = cache.get(table);
  if (cached) return cached;

  const db = getDb();
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  const forward: SchemaMap = new Map();
  const reverse = new Map<string, { key: string; kind: ColumnKind }>();
  for (const { name } of columns) {
    const key = logicalKey(name);
    const kind = columnKind(name);
    forward.set(key, { column: name, kind });
    reverse.set(name, { key, kind });
  }
  const schema: TableSchema = { forward, reverse };
  cache.set(table, schema);
  return schema;
}

export function invalidateSchemaCache(table?: string) {
  const cache = globalForDb.__elimuSchema;
  if (!cache) return;
  if (table) cache.delete(table);
  else cache.clear();
}

// ---------------------------------------------------------------------------
// Sérialisation
// ---------------------------------------------------------------------------

function decode(kind: ColumnKind, value: unknown): unknown {
  if (value === null || value === undefined) return null;
  if (kind === 'bool') return value === 1 || value === true || value === '1';
  if (kind === 'json') {
    try {
      return JSON.parse(String(value));
    } catch {
      return null;
    }
  }
  if (kind === 'pipe') {
    return String(value).split('|').map((s) => s.trim()).filter(Boolean);
  }
  return value;
}

function encode(kind: ColumnKind, value: unknown): unknown {
  if (value === undefined || value === null) return null;
  if (kind === 'bool') return value ? 1 : 0;
  if (kind === 'json') return typeof value === 'string' ? value : JSON.stringify(value);
  if (kind === 'pipe') {
    if (Array.isArray(value)) return value.filter(Boolean).join('|');
    return String(value);
  }
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'object') return JSON.stringify(value);
  return value as string | number;
}

/** Convertit une ligne SQL (snake_case) en objet applicatif (camelCase). */
export function decodeRow<T>(table: string, row: Record<string, unknown>): T {
  const { reverse } = schemaFor(table);
  const out: Record<string, unknown> = {};
  for (const [column, value] of Object.entries(row)) {
    const known = reverse.get(column);
    const kind = known?.kind ?? columnKind(column);
    out[known?.key ?? logicalKey(column)] = decode(kind, value);
  }
  return out as T;
}

// ---------------------------------------------------------------------------
// Requêtes
// ---------------------------------------------------------------------------

export function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] | Record<string, unknown> = [],
): T[] {
  const rows = getDb().prepare(sql).all(...(Array.isArray(params) ? params : [params])) as Record<
    string,
    unknown
  >[];
  const table = extractTable(sql);
  return rows.map((row) => (table ? decodeRow<T>(table, row) : (row as T)));
}

export function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] | Record<string, unknown> = [],
): T | null {
  const rows = query<T>(sql, params);
  return rows[0] ?? null;
}

export function execute(sql: string, params: unknown[] = []): Database.RunResult {
  return getDb().prepare(sql).run(...params);
}

/** Compte les lignes d'une table avec un filtre optionnel. */
export function countRows(table: string, where?: Record<string, unknown>): number {
  if (!where || Object.keys(where).length === 0) {
    const row = getDb().prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number };
    return row.n;
  }
  const { forward } = schemaFor(table);
  const keys = Object.keys(where);
  const clauses = keys.map((key) => `${forward.get(key)?.column ?? physicalColumn(key)} = ?`);
  const values = keys.map((key) => encode(forward.get(key)?.kind ?? 'plain', where[key]));
  const row = getDb()
    .prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE ${clauses.join(' AND ')}`)
    .get(...values) as { n: number };
  return row.n;
}

/** Identifiant court, triable et unique (style cuid). */
export function newId(prefix = ''): string {
  const time = Date.now().toString(36);
  const rand = randomBytes(8).toString('hex');
  return `${prefix}${prefix ? '_' : ''}${time}${rand}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

/** INSERT générique avec traduction camelCase → colonnes SQL. */
export function insert<T = string>(table: string, data: Record<string, unknown>): string {
  const { forward, reverse } = schemaFor(table);
  const id = (data.id as string) ?? newId();
  const entries: [string, unknown][] = [];
  const timestamp = nowIso();

  for (const [key, rawValue] of Object.entries(data)) {
    if (key === 'id') continue;
    const entry = forward.get(key);
    const column = entry?.column ?? physicalColumn(key);
    entries.push([column, encode(entry?.kind ?? columnKind(column), rawValue)]);
  }

  if (reverse.has('created_at') && !entries.some(([c]) => c === 'created_at')) {
    entries.push(['created_at', timestamp]);
  }
  if (reverse.has('updated_at') && !entries.some(([c]) => c === 'updated_at')) {
    entries.push(['updated_at', timestamp]);
  }

  const columns = ['id', ...entries.map(([c]) => c)];
  const placeholders = columns.map(() => '?').join(', ');
  const values = [id, ...entries.map(([, v]) => v)];

  getDb()
    .prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`)
    .run(...values);
  return id;
}

/** UPDATE générique par identifiant. */
export function update(table: string, id: string, data: Record<string, unknown>): void {
  const { forward, reverse } = schemaFor(table);
  const entries: [string, unknown][] = [];
  for (const [key, rawValue] of Object.entries(data)) {
    if (key === 'id') continue;
    const entry = forward.get(key);
    const column = entry?.column ?? physicalColumn(key);
    entries.push([column, encode(entry?.kind ?? columnKind(column), rawValue)]);
  }
  if (reverse.has('updated_at') && !entries.some(([c]) => c === 'updated_at')) {
    entries.push(['updated_at', nowIso()]);
  }
  if (entries.length === 0) return;
  const assignments = entries.map(([column]) => `${column} = ?`).join(', ');
  getDb()
    .prepare(`UPDATE ${table} SET ${assignments} WHERE id = ?`)
    .run(...entries.map(([, v]) => v), id);
}

export function remove(table: string, id: string): void {
  getDb().prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
}

/** Exécute une fonction dans une transaction (retourne le résultat). */
export function transaction<T>(fn: () => T): T {
  const db = getDb();
  const run = db.transaction(fn);
  return run();
}

/** Détecte la table principale d'une requête SELECT pour le décodage. */
function extractTable(sql: string): string | null {
  const match =
    /^\s*SELECT[\s\S]*?\bFROM\s+([a-z_]+)/i.exec(sql) ?? /\bFROM\s+([a-z_]+)/i.exec(sql);
  return match ? match[1] : null;
}

export const dbInfo = {
  file: DB_FILE,
  schemaFile: SCHEMA_FILE,
};
