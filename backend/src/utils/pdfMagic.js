import fs from "fs";

/** Minimum bytes to read for PDF signature check */
export const PDF_MAGIC_READ_LEN = 8;

/**
 * Returns true if the buffer starts with a PDF file signature (%PDF).
 * Does not guarantee the file is well-formed or uncorrupted.
 */
export function bufferLooksLikePdf(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) return false;
  const head = buffer.subarray(0, Math.min(buffer.length, PDF_MAGIC_READ_LEN)).toString("latin1");
  return head.startsWith("%PDF");
}

/**
 * Reads the start of a file from disk and checks the PDF magic bytes.
 */
export function filePathLooksLikePdf(filePath) {
  const fd = fs.openSync(filePath, "r");
  try {
    const buf = Buffer.alloc(PDF_MAGIC_READ_LEN);
    const bytesRead = fs.readSync(fd, buf, 0, PDF_MAGIC_READ_LEN, 0);
    return bufferLooksLikePdf(buf.subarray(0, bytesRead));
  } finally {
    fs.closeSync(fd);
  }
}
