import { SoundCloudConsent } from "@/types/soundcloud-consent";

/**
 * Visitor preferences persisted in localStorage under a versioned key.
 * Bump the key version when the stored shape changes incompatibly; older
 * payloads are then ignored instead of being misread.
 */
export const VISITOR_PREFS_KEY = "lifeframe:prefs:v1";

/** A stored "Denied" expires so the visitor is asked again eventually. */
export const SOUND_CLOUD_DENIED_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type StoredSoundCloudConsent =
  | SoundCloudConsent.Granted
  | SoundCloudConsent.Denied;

export type SoundCloudPrefs = Readonly<{
  consent: StoredSoundCloudConsent;
  decidedAt: number;
}>;

// Add new optional fields here (e.g. business mode) rather than changing
// existing ones, so v1 payloads stay readable.
export type VisitorPrefs = Readonly<{
  soundCloud?: SoundCloudPrefs;
}>;

const EMPTY_PREFS: VisitorPrefs = Object.freeze({});

let cachedRaw: string | null = null;
let cachedPrefs: VisitorPrefs = EMPTY_PREFS;
// Used when storage is unavailable (private mode, quota, disabled) so a
// choice still holds for the current page session.
let sessionFallback: VisitorPrefs | null = null;
const listeners = new Set<() => void>();

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseSoundCloudPrefs(value: unknown): SoundCloudPrefs | undefined {
  if (!isRecord(value)) return undefined;
  const { consent, decidedAt } = value;
  if (
    consent !== SoundCloudConsent.Granted &&
    consent !== SoundCloudConsent.Denied
  ) {
    return undefined;
  }
  if (typeof decidedAt !== "number" || !Number.isFinite(decidedAt)) {
    return undefined;
  }
  return { consent, decidedAt };
}

/** Parses a raw stored value, dropping any field that fails validation. */
export function parseVisitorPrefs(raw: string | null): VisitorPrefs {
  if (!raw) return EMPTY_PREFS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return EMPTY_PREFS;
    const soundCloud = parseSoundCloudPrefs(parsed.soundCloud);
    return soundCloud ? { soundCloud } : EMPTY_PREFS;
  } catch {
    return EMPTY_PREFS;
  }
}

export function readVisitorPrefs(): VisitorPrefs {
  if (sessionFallback) return sessionFallback;

  const storage = getStorage();
  if (!storage) return EMPTY_PREFS;

  let raw: string | null;
  try {
    raw = storage.getItem(VISITOR_PREFS_KEY);
  } catch {
    return EMPTY_PREFS;
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedPrefs = parseVisitorPrefs(raw);
  }
  return cachedPrefs;
}

function notify() {
  for (const listener of listeners) listener();
}

export function writeVisitorPrefs(
  update: (current: VisitorPrefs) => VisitorPrefs,
): void {
  const next = update(readVisitorPrefs());
  const storage = getStorage();

  try {
    if (!storage) throw new Error("localStorage unavailable");
    if (Object.values(next).every((value) => value === undefined)) {
      storage.removeItem(VISITOR_PREFS_KEY);
    } else {
      storage.setItem(VISITOR_PREFS_KEY, JSON.stringify(next));
    }
    sessionFallback = null;
  } catch {
    sessionFallback = next;
  }

  notify();
}

export function subscribeVisitorPrefs(listener: () => void): () => void {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === VISITOR_PREFS_KEY) listener();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function readSoundCloudConsent(now = Date.now()): SoundCloudConsent {
  const prefs = readVisitorPrefs().soundCloud;
  if (!prefs) return SoundCloudConsent.Pending;
  if (
    prefs.consent === SoundCloudConsent.Denied &&
    now - prefs.decidedAt > SOUND_CLOUD_DENIED_TTL_MS
  ) {
    return SoundCloudConsent.Pending;
  }
  return prefs.consent;
}

/** Stores Granted/Denied; Pending clears the stored choice. */
export function writeSoundCloudConsent(
  consent: SoundCloudConsent,
  now = Date.now(),
): void {
  writeVisitorPrefs((current) => {
    const soundCloud =
      consent === SoundCloudConsent.Pending
        ? undefined
        : { consent, decidedAt: now };
    return { ...current, soundCloud };
  });
}

/** Test-only: clears module-level caches between test cases. */
export function resetVisitorPrefsCacheForTests(): void {
  cachedRaw = null;
  cachedPrefs = EMPTY_PREFS;
  sessionFallback = null;
  listeners.clear();
}
