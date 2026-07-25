import { describe, it, expect } from "vitest";
import { es } from "../i18n/locales/es";
import { en } from "../i18n/locales/en";

function getKeys(obj: Record<string, any>, prefix = ""): string[] {
  let keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

describe("i18n Locale Parity", () => {
  it("should have identical key structures in Spanish and English locales", () => {
    const esKeys = getKeys(es);
    const enKeys = getKeys(en);

    expect(esKeys).toEqual(enKeys);
  });
});
