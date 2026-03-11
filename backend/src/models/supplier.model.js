import { pool } from "../config/db.js";

export const SupplierModel = {
  async create({ userId, name, vatNumber, address, email }) {
    const [result] = await pool.execute(
      `
      INSERT INTO suppliers (user_id, name, vat_number, address, email)
      VALUES (?, ?, ?, ?, ?)
      `,
      [userId, name, vatNumber || null, address || null, email || null]
    );
    return this.findById(result.insertId, userId);
  },

  async findById(supplierId, userId) {
    const [rows] = await pool.execute(
      `
      SELECT id, user_id, name, vat_number, address, email, created_at, updated_at
      FROM suppliers
      WHERE id = ? AND user_id = ?
      `,
      [supplierId, userId]
    );
    return rows[0];
  },

  async findByUser(userId, { search = "", limit = 50 } = {}) {
    let sql = `
      SELECT id, name, vat_number, address, email, created_at
      FROM suppliers
      WHERE user_id = ?
    `;
    const params = [userId];

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      sql += ` AND (name LIKE ? OR vat_number LIKE ? OR address LIKE ? OR email LIKE ?)`;
      params.push(term, term, term, term);
    }

    const limitVal = Math.min(500, Math.max(1, parseInt(limit, 10) || 50));
    sql += ` ORDER BY name ASC LIMIT ${limitVal}`;

    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  /**
   * Trova fornitore per VAT (priorità) o nome simile
   */
  async findMatch(userId, { vatNumber, name }) {
    if (vatNumber && vatNumber.trim()) {
      const normalized = String(vatNumber).replace(/\s/g, "").toUpperCase();
      if (normalized.length >= 8) {
        const [rows] = await pool.execute(
          `SELECT id, name, vat_number FROM suppliers 
           WHERE user_id = ? AND (REPLACE(UPPER(vat_number), ' ', '') = ? OR vat_number LIKE ?)`,
          [userId, normalized, `%${normalized.slice(-9)}%`]
        );
        if (rows[0]) return rows[0];
      }
    }

    if (name && name.trim().length >= 3) {
      const [rows] = await pool.execute(
        `SELECT id, name, vat_number FROM suppliers 
         WHERE user_id = ? AND LOWER(name) LIKE ?
         ORDER BY CASE WHEN LOWER(name) = LOWER(?) THEN 0 ELSE 1 END
         LIMIT 1`,
        [userId, `%${name.trim().toLowerCase()}%`, name.trim()]
      );
      if (rows[0]) return rows[0];
    }

    return null;
  },

  async updateById(supplierId, userId, { name, vat_number, address, email }) {
    const updates = [];
    const params = [];
    if (name !== undefined) {
      updates.push("name = ?");
      params.push(String(name || "").trim() || null);
    }
    if (vat_number !== undefined) {
      updates.push("vat_number = ?");
      params.push(vat_number ? String(vat_number).trim() || null : null);
    }
    if (address !== undefined) {
      updates.push("address = ?");
      params.push(address ? String(address).trim() || null : null);
    }
    if (email !== undefined) {
      updates.push("email = ?");
      params.push(email ? String(email).trim() || null : null);
    }
    if (updates.length === 0) return this.findById(supplierId, userId);
    params.push(supplierId, userId);
    await pool.execute(
      `UPDATE suppliers SET ${updates.join(", ")}, updated_at = NOW() WHERE id = ? AND user_id = ?`,
      params
    );
    return this.findById(supplierId, userId);
  },

  async deleteById(supplierId, userId) {
    const [result] = await pool.execute(
      `DELETE FROM suppliers WHERE id = ? AND user_id = ?`,
      [supplierId, userId]
    );
    return result.affectedRows > 0;
  },

  async upsert(userId, { name, vatNumber, address, email }) {
    const existing = await this.findMatch(userId, { vatNumber, name });
    if (existing) {
      await pool.execute(
        `UPDATE suppliers 
         SET name = COALESCE(?, name), 
             vat_number = COALESCE(?, vat_number),
             address = COALESCE(?, address),
             email = COALESCE(?, email),
             updated_at = NOW()
         WHERE id = ?`,
        [name || existing.name, vatNumber || null, address || null, email || null, existing.id]
      );
      return this.findById(existing.id, userId);
    }
    return this.create({ userId, name, vatNumber, address, email });
  },
};
