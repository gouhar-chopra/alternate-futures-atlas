import { ScenarioSchema, type Scenario, type DecisionInput } from "./scenario";
import { DEMO_SCENARIO } from "./demo-scenario";

// All scenario data stays in this browser (localStorage). Nothing is stored on a server.
const KEY = "elsewhere:scenarios";
const DRAFT = "elsewhere:draft";
const NOTES = "elsewhere:notes";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or disabled */
  }
}

export function listScenarios(): Scenario[] {
  const raw = read<unknown[]>(KEY, []);
  return raw.flatMap((r) => {
    const p = ScenarioSchema.safeParse(r);
    return p.success ? [p.data] : [];
  });
}
export function getScenario(id: string): Scenario | null {
  if (id === "demo") return DEMO_SCENARIO;
  return listScenarios().find((s) => s.id === id) ?? null;
}
export function saveScenario(s: Scenario) {
  write(KEY, [s, ...listScenarios().filter((x) => x.id !== s.id)].slice(0, 12));
}
export function deleteScenario(id: string) {
  write(KEY, listScenarios().filter((x) => x.id !== id));
}
export function clearAll() {
  try {
    [KEY, DRAFT, NOTES].forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
export function getDraft(): Partial<DecisionInput> | null {
  return read<Partial<DecisionInput> | null>(DRAFT, null);
}
export function saveDraft(d: Partial<DecisionInput>) {
  write(DRAFT, d);
}
export function getNote(id: string): string {
  return read<Record<string, string>>(NOTES, {})[id] ?? "";
}
export function saveNote(id: string, note: string) {
  write(NOTES, { ...read<Record<string, string>>(NOTES, {}), [id]: note.slice(0, 1000) });
}
