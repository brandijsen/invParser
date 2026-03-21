import { describe, it, expect } from "vitest";
import { hasRedFlags } from "./redFlagChecker.js";

describe("hasRedFlags", () => {
  it("returns false for null/undefined", () => {
    expect(hasRedFlags(null)).toBe(false);
    expect(hasRedFlags(undefined)).toBe(false);
  });

  it("returns false when no confidence fields", () => {
    expect(hasRedFlags({ foo: "bar" })).toBe(false);
  });

  it("returns false when all confidences meet threshold", () => {
    expect(
      hasRedFlags(
        { total: { value: 100, confidence: 99 } },
        95
      )
    ).toBe(false);
  });

  it("returns true when a field is below threshold", () => {
    expect(
      hasRedFlags(
        { total: { value: 100, confidence: 50 } },
        95
      )
    ).toBe(true);
  });
});
