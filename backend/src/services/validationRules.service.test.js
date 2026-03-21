import { describe, it, expect } from "vitest";
import {
  validateExtractedData,
  ALERT_CATEGORY,
} from "./validationRules.service.js";

describe("validateExtractedData", () => {
  it("returns empty flags when semantic is missing", () => {
    const r = validateExtractedData(null, "standard");
    expect(r.flags).toEqual([]);
    expect(r.isValid).toBe(true);
  });

  it("flags VAT calculation error for standard invoice", () => {
    const semantic = {
      amounts: {
        subtotal: { value: 100, confidence: 99 },
        vat: {
          rate: { value: 22, confidence: 99 },
          amount: { value: 10, confidence: 99 },
        },
        total_amount: { value: 122, confidence: 99 },
      },
    };
    const r = validateExtractedData(semantic, "standard");
    const vatFlag = r.flags.find((f) => f.field === "vat.amount");
    expect(vatFlag).toBeDefined();
    expect(vatFlag.type).toBe("calculation_error");
    expect(vatFlag.category).toBe(ALERT_CATEGORY.ARITHMETIC);
  });

  it("tags flags with data_quality for missing currency", () => {
    const semantic = {
      amounts: {
        subtotal: { value: 50, confidence: 99 },
        total_amount: { value: 50, confidence: 99 },
      },
    };
    const r = validateExtractedData(semantic, "tax_exempt");
    const cur = r.flags.find((f) => f.field === "currency");
    expect(cur).toBeDefined();
    expect(cur.category).toBe(ALERT_CATEGORY.DATA_QUALITY);
  });
});
