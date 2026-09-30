/**
 * Point d'entrée unique vers la base de données.
 *
 * La plateforme utilise SQLite via better-sqlite3 (voir src/lib/sqlite.ts) :
 * aucune dépendance à un serveur externe, ce qui simplifie le déploiement en
 * République démocratique du Congo (hébergement local, connexions instables).
 *
 * Pour migrer vers PostgreSQL, le schéma équivalent est fourni dans
 * docs/modele-de-donnees-reference.prisma ; seule cette couche est à adapter.
 */
export {
  getDb,
  query,
  queryOne,
  execute,
  insert,
  update,
  remove,
  countRows,
  transaction,
  newId,
  dbInfo,
  decodeRow,
} from './sqlite';

export { getDb as default } from './sqlite';
