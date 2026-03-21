/** Below this confidence (exclusive), the document list shows the “Review” badge. */
export const REVIEW_BADGE_CONFIDENCE_THRESHOLD = 80;

/**
 * True if any parsed field with `{ value, confidence }` is below the threshold.
 * Used for the Invoices table Review badge (default threshold {@link REVIEW_BADGE_CONFIDENCE_THRESHOLD}).
 */
export function hasRedFlags(parsedJson, threshold = REVIEW_BADGE_CONFIDENCE_THRESHOLD) {
  if (!parsedJson) return false;

  const fields = extractFieldsWithConfidence(parsedJson);
  return fields.some((field) => field.confidence < threshold);
}

/**
 * Use for the Invoices table “Review” badge. Aligns with detail “Verification Needed”:
 * any `validation_flags` entries from the parser, or low field confidence ({@link hasRedFlags}).
 */
export function documentNeedsReview(parsedJson, threshold = REVIEW_BADGE_CONFIDENCE_THRESHOLD) {
  if (!parsedJson) return false;
  const vf = parsedJson.validation_flags;
  if (Array.isArray(vf) && vf.length > 0) return true;
  return hasRedFlags(parsedJson, threshold);
}

/**
 * Extracts all fields with confidence from a nested object
 */
function extractFieldsWithConfidence(obj, path = "") {
  const fields = [];

  function traverse(current, currentPath) {
    if (!current || typeof current !== "object") return;

    if ("value" in current && "confidence" in current) {
      fields.push({
        path: currentPath,
        value: current.value,
        confidence: current.confidence,
      });
      return;
    }

    for (const [key, value] of Object.entries(current)) {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      traverse(value, newPath);
    }
  }

  traverse(obj, path);
  return fields;
}
