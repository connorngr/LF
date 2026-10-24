import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  SOUND_CLOUD_DENIED_TTL_MS,
  VISITOR_PREFS_KEY,
  parseVisitorPrefs,
  readSoundCloudConsent,
  readVisitorPrefs,
  resetVisitorPrefsCacheForTests,
  subscribeVisitorPrefs,
  writeSoundCloudConsent,
} from "@/lib/visitor-prefs";
import { SoundCloudConsent } from "@/types/soundcloud-consent";

const NOW = 1_700_000_000_000;

describe("visitor-prefs", () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetVisitorPrefsCacheForTests();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("parseVisitorPrefs", () => {
    it("returns empty prefs for missing or corrupt JSON", () => {
      expect(parseVisitorPrefs(null)).toEqual({});
      expect(parseVisitorPrefs("")).toEqual({});
      expect(parseVisitorPrefs("{not json")).toEqual({});
    });

    it("returns empty prefs for non-object JSON", () => {
      expect(parseVisitorPrefs("42")).toEqual({});
      expect(parseVisitorPrefs("null")).toEqual({});
      expect(parseVisitorPrefs("[1,2]")).toEqual({});
    });

    it("drops invalid soundCloud fields", () => {
      expect(
        parseVisitorPrefs(
          JSON.stringify({ soundCloud: { consent: "pending", decidedAt: NOW } }),
        ),
      ).toEqual({});
      expect(
        parseVisitorPrefs(
          JSON.stringify({ soundCloud: { consent: "granted", decidedAt: "x" } }),
        ),
      ).toEqual({});
    });

    it("keeps a valid soundCloud choice and ignores unknown fields", () => {
      expect(
        parseVisitorPrefs(
          JSON.stringify({
            soundCloud: { consent: "granted", decidedAt: NOW },
            unknown: true,
          }),
        ),
      ).toEqual({
        soundCloud: { consent: SoundCloudConsent.Granted, decidedAt: NOW },
      });
    });
  });

  describe("readSoundCloudConsent", () => {
    it("is Pending when nothing is stored", () => {
      expect(readSoundCloudConsent(NOW)).toBe(SoundCloudConsent.Pending);
    });

    it("is Pending when the stored value is corrupt", () => {
      window.localStorage.setItem(VISITOR_PREFS_KEY, "{oops");
      expect(readSoundCloudConsent(NOW)).toBe(SoundCloudConsent.Pending);
    });

    it("ignores payloads stored under another version key", () => {
      window.localStorage.setItem(
        "lifeframe:prefs:v0",
        JSON.stringify({ soundCloud: { consent: "granted", decidedAt: NOW } }),
      );
      expect(readSoundCloudConsent(NOW)).toBe(SoundCloudConsent.Pending);
    });

    it("is Pending when localStorage throws on read", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("SecurityError");
      });
      expect(readSoundCloudConsent(NOW)).toBe(SoundCloudConsent.Pending);
    });

    it("expires a Denied choice after the TTL but keeps Granted", () => {
      writeSoundCloudConsent(SoundCloudConsent.Denied, NOW);
      expect(readSoundCloudConsent(NOW + SOUND_CLOUD_DENIED_TTL_MS)).toBe(
        SoundCloudConsent.Denied,
      );
      expect(readSoundCloudConsent(NOW + SOUND_CLOUD_DENIED_TTL_MS + 1)).toBe(
        SoundCloudConsent.Pending,
      );

      writeSoundCloudConsent(SoundCloudConsent.Granted, NOW);
      expect(readSoundCloudConsent(NOW + SOUND_CLOUD_DENIED_TTL_MS * 10)).toBe(
        SoundCloudConsent.Granted,
      );
    });
  });

  describe("writeSoundCloudConsent", () => {
    it("persists Granted and Denied under the versioned key", () => {
      writeSoundCloudConsent(SoundCloudConsent.Granted, NOW);
      expect(JSON.parse(window.localStorage.getItem(VISITOR_PREFS_KEY)!)).toEqual({
        soundCloud: { consent: "granted", decidedAt: NOW },
      });

      writeSoundCloudConsent(SoundCloudConsent.Denied, NOW + 1);
      expect(readSoundCloudConsent(NOW + 1)).toBe(SoundCloudConsent.Denied);
    });

    it("never persists Pending; it clears the stored choice", () => {
      writeSoundCloudConsent(SoundCloudConsent.Granted, NOW);
      writeSoundCloudConsent(SoundCloudConsent.Pending, NOW);
      expect(window.localStorage.getItem(VISITOR_PREFS_KEY)).toBeNull();
      expect(readVisitorPrefs()).toEqual({});
    });

    it("keeps the choice in memory when localStorage throws on write", () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
      writeSoundCloudConsent(SoundCloudConsent.Granted, NOW);
      expect(readSoundCloudConsent(NOW)).toBe(SoundCloudConsent.Granted);
      expect(window.localStorage.getItem(VISITOR_PREFS_KEY)).toBeNull();
    });

    it("notifies subscribers until they unsubscribe", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeVisitorPrefs(listener);

      writeSoundCloudConsent(SoundCloudConsent.Granted, NOW);
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      writeSoundCloudConsent(SoundCloudConsent.Denied, NOW);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("notifies subscribers on storage events for the prefs key only", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeVisitorPrefs(listener);

      window.dispatchEvent(new StorageEvent("storage", { key: "other" }));
      expect(listener).not.toHaveBeenCalled();

      window.dispatchEvent(
        new StorageEvent("storage", { key: VISITOR_PREFS_KEY }),
      );
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
    });
  });
});
