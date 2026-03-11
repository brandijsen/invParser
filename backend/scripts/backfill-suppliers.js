/**
 * Backfill suppliers da documenti già processati
 * Crea supplier per ogni documento che ha semantic.seller ma non supplier_id
 *
 * Esecuzione: node scripts/backfill-suppliers.js
 */
import { pool } from "../src/config/db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

import { upsertSupplierFromDocument } from "../src/services/supplier.service.js";

async function main() {
  console.log("Backfilling suppliers from documents...\n");

  const [rows] = await pool.execute(`
    SELECT d.id, d.user_id, dr.parsed_json
    FROM documents d
    JOIN document_results dr ON d.id = dr.document_id
    WHERE d.supplier_id IS NULL
      AND dr.parsed_json IS NOT NULL
      AND JSON_EXTRACT(dr.parsed_json, '$.semantic.seller.name') IS NOT NULL
    ORDER BY d.id
  `);

  if (rows.length === 0) {
    console.log("No documents to process (all have suppliers or no seller data).");
    process.exit(0);
  }

  console.log(`Found ${rows.length} document(s) to process.\n`);

  let created = 0;
  for (const row of rows) {
    const parsed = typeof row.parsed_json === "string" ? JSON.parse(row.parsed_json) : row.parsed_json;
    const semantic = parsed?.semantic;

    if (!semantic?.seller?.name) continue;

    try {
      const supplier = await upsertSupplierFromDocument(row.user_id, row.id, semantic);
      if (supplier) {
        created++;
        console.log(`  ✓ Doc ${row.id}: ${supplier.name}`);
      }
    } catch (err) {
      console.error(`  ✗ Doc ${row.id}:`, err.message);
    }
  }

  console.log(`\nDone. Created/linked ${created} supplier(s).`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
