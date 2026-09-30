/** Helpers de (dé)sérialisation JSON pour les colonnes String de SQLite. */

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function stringifyJson(value: unknown): string {
  return JSON.stringify(value ?? null);
}

/** Convertit "a|b|c" en ['a','b','c']. */
export function parsePipeList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toPipeList(items: (string | undefined | null)[]): string {
  return items.filter(Boolean).join('|');
}
