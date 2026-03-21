import { describe, it, expect } from "vitest";
import { hasRedFlags, documentNeedsReview } from "./redFlagChecker.js";

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

describe("documentNeedsReview", () => {
  it("returns true when validation_flags is non-empty", () => {
    expect(
      documentNeedsReview({
        totals: { net_payable: { value: "1", confidence: 99 } },
        validation_flags: [{ field: "withholding", severity: "medium", message: "mismatch" }],
      })
    ).toBe(true);
  });

  it("returns false when validation_flags is empty and confidences are ok", () => {
    expect(
      documentNeedsReview({
        total: { value: 100, confidence: 99 },
        validation_flags: [],
      })
    ).toBe(false);
  });

  it("falls back to hasRedFlags when no validation_flags", () => {
    expect(
      documentNeedsReview({ total: { value: 1, confidence: 50 } }, 80)
    ).toBe(true);
  });
});
