const NAMESPACE = 'axons-finance-db';

/**
 * Stand-in for a backend database: persists each "table" to localStorage so
 * data survives page reloads, and seeds it on first use.
 */
export function readTable<T>(table: string, seed: () => T): T {
  try {
    const raw = localStorage.getItem(`${NAMESPACE}:${table}`);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // corrupted storage — fall through and reseed
  }
  const seeded = seed();
  writeTable(table, seeded);
  return seeded;
}

export function writeTable<T>(table: string, value: T): void {
  localStorage.setItem(`${NAMESPACE}:${table}`, JSON.stringify(value));
}

export function resetTable(table: string): void {
  localStorage.removeItem(`${NAMESPACE}:${table}`);
}
