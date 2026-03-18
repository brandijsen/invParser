/**
 * Checks if a document has red flags (fields with confidence < threshold)
 */
export function hasRedFlags(parsedJson, threshold = 95) {
  if (!parsedJson) return false;

  const fields = extractFieldsWithConfidence(parsedJson);
  return fields.some((field) => field.confidence < threshold);
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
