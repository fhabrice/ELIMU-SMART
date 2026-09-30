/**
 * Petit utilitaire de consultation de la base SQLite.
 *
 *   npm run db:shell              → affiche les comptages de toutes les tables
 *   npm run db:shell -- "SELECT …" → exécute une requête et affiche le résultat
 */
import './load-env';
import { getDb, dbInfo, query } from '../src/lib/sqlite';


const sql = process.argv.slice(2).join(' ').trim();
const db = getDb();

console.log(`Base : ${dbInfo.file} (schéma : ${dbInfo.schemaFile})`);

if (sql) {
  try {
    const rows = query<Record<string, unknown>>(sql);
    if (rows.length === 0) {
      console.log('Aucun résultat.');
    } else {
      console.table(rows.slice(0, 50));
      if (rows.length > 50) console.log(`… ${rows.length - 50} ligne(s) supplémentaire(s)`);
    }
  } catch (error) {
    // Les requêtes d'écriture ne renvoient pas de lignes : on les exécute via prepare().
    try {
      const result = db.prepare(sql).run();
      console.log(`Requête exécutée (${result.changes} ligne(s) affectée(s)).`);
    } catch (inner) {
      console.error('Erreur SQL :', (inner as Error).message);
      process.exitCode = 1;
    }
    void error;
  }
} else {
  const tables = query<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
  );
  const rows = tables.map(({ name }) => ({
    table: name,
    lignes: (db.prepare(`SELECT COUNT(*) AS total FROM ${name}`).get() as { total: number }).total,
  }));
  console.table(rows);
  console.log('Astuce : npm run db:shell -- "SELECT * FROM schools"');
}
