/**
 * Scans parsed data and finds fields with confidence score below the threshold (red flags).
 * Returns an array of problematic fields for the UI.
 */

const CONFIDENCE_THRESHOLD = 70;

/**
 * Extracts all fields with their confidence score from a nested object
 */
function extractFieldsWithConfidence(obj, path = "") {
  const fields = [];

  function traverse(current, currentPath) {
    if (!current || typeof current !== "object") return;

    // If it has value and confidence, it's a field
    if ("value" in current && "confidence" in current) {
      fields.push({
        path: currentPath,
        value: current.value,
        confidence: current.confidence,
      });
      return;
    }

    // Otherwise keep traversing
    for (const [key, value] of Object.entries(current)) {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      traverse(value, newPath);
    }
  }

  traverse(obj, path);
  return fields;
}

/**
 * Returns red-flag fields (confidence < threshold).
 */
export function identifyRedFlags(parsedJson, threshold = CONFIDENCE_THRESHOLD) {
  if (!parsedJson) return [];

  const allFields = extractFieldsWithConfidence(parsedJson);
  
  const redFlags = allFields.filter(
    (field) => field.confidence < threshold
  );

  return redFlags.map((field) => ({
    ...field,
    severity: getSeverity(field.confidence),
    label: formatFieldLabel(field.path),
  }));
}

/**
 * Determines severity based on confidence score
 */
function getSeverity(confidence) {
  if (confidence < 50) return "critical";
  if (confidence < 60) return "high";
  if (confidence < 70) return "medium";
  return "low";
}

/**
 * Turns a field path into a readable label (e.g. amounts.vat.rate → Amounts > Vat > Rate).
 */
function formatFieldLabel(path) {
  return path
    .split(".")
    .map((part) => {
      // Underscores to spaces, title case
      return part
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    })
    .join(" > ");
}

/**
 * Calculates the average confidence score of a document
 */
export function calculateAverageConfidence(parsedJson) {
  if (!parsedJson) return 100;

  const allFields = extractFieldsWithConfidence(parsedJson);
  
  if (allFields.length === 0) return 100;

  const sum = allFields.reduce((acc, field) => acc + field.confidence, 0);
  return Math.round(sum / allFields.length);
}

/**
 * Verifica se un documento ha red flags
 */
export function hasRedFlags(parsedJson, threshold = CONFIDENCE_THRESHOLD) {
  const redFlags = identifyRedFlags(parsedJson, threshold);
  return redFlags.length > 0;
}

/**
 * Updates a specific field in parsed_json
 */
export function updateFieldValue(parsedJson, fieldPath, newValue) {
  const pathParts = fieldPath.split(".");
  const result = JSON.parse(JSON.stringify(parsedJson)); // Deep clone

  let current = result;
  
  // Walk to the target field
  for (let i = 0; i < pathParts.length - 1; i++) {
    if (!current[pathParts[i]]) {
      current[pathParts[i]] = {};
    }
    current = current[pathParts[i]];
  }

  const lastKey = pathParts[pathParts.length - 1];
  
  // Se il campo ha structure { value, confidence }, aggiorna solo value
  if (current[lastKey] && typeof current[lastKey] === "object" && "value" in current[lastKey]) {
    current[lastKey].value = newValue;
    // Set confidence to 100 for manually edited fields
    current[lastKey].confidence = 100;
  } else {
    // Otherwise replace with a scored field
    current[lastKey] = { value: newValue, confidence: 100 };
  }

  return result;
}
