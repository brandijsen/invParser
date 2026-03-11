import "dotenv/config";
import { pool } from "../src/config/db.js";

const [suppliers] = await pool.execute("SELECT id, user_id, name FROM suppliers");
const [docs] = await pool.execute(`
  SELECT d.id, d.supplier_id,
    JSON_EXTRACT(dr.parsed_json, '$.semantic.seller') IS NOT NULL as has_seller
  FROM documents d
  JOIN document_results dr ON d.id = dr.document_id
  LIMIT 10
`);
console.log("Suppliers count:", suppliers.length, suppliers);
console.log("Sample docs:", docs);
process.exit(0);
