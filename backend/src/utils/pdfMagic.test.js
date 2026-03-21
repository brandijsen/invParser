import { describe, it, expect } from "vitest";
import { bufferLooksLikePdf } from "./pdfMagic.js";

describe("pdfMagic", () => {
  it("accepts buffer starting with %PDF", () => {
    expect(bufferLooksLikePdf(Buffer.from("%PDF-1.4\n"))).toBe(true);
  });

  it("rejects non-PDF content", () => {
    expect(bufferLooksLikePdf(Buffer.from("hello"))).toBe(false);
    expect(bufferLooksLikePdf(Buffer.alloc(2))).toBe(false);
  });
});
