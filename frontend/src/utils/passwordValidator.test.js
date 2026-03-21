import { describe, it, expect } from "vitest";
import { validatePassword } from "./passwordValidator.js";

describe("validatePassword", () => {
  it("rejects empty", () => {
    expect(validatePassword("").valid).toBe(false);
    expect(validatePassword(null).valid).toBe(false);
  });

  it("rejects short password", () => {
    expect(validatePassword("Ab1").valid).toBe(false);
  });

  it("rejects missing uppercase", () => {
    expect(validatePassword("abcdefgh1").valid).toBe(false);
  });

  it("rejects missing lowercase", () => {
    expect(validatePassword("ABCDEFGH1").valid).toBe(false);
  });

  it("rejects missing digit", () => {
    expect(validatePassword("Abcdefgh").valid).toBe(false);
  });

  it("accepts valid password", () => {
    expect(validatePassword("ValidPass1").valid).toBe(true);
  });
});
