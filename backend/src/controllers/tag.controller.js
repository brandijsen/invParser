import { TagModel } from "../models/tag.model.js";
import { ensureDefaultTagsForUser } from "../services/dueDateTags.service.js";

export async function listTags(req, res) {
  try {
    const userId = req.user.id;
    const { limit, search } = req.query;
    let tags = await TagModel.findByUser(userId, { limit, search });
    if (tags.length === 0) {
      await ensureDefaultTagsForUser(userId);
      tags = await TagModel.findByUser(userId, { limit, search });
    }
    return res.json({ tags });
  } catch (err) {
    const msg = err.code === "ER_NO_SUCH_TABLE" || err.message?.includes("doesn't exist")
      ? "Tag tables missing. Run migration: mysql -u root -p invParserDb < backend/migrations/db.sql"
      : (err.message || "Failed to list tags");
    return res.status(500).json({ message: msg });
  }
}

export async function getDocumentTags(req, res) {
  try {
    const userId = req.user.id;
    const documentId = parseInt(req.params.id, 10);
    if (isNaN(documentId)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }
    const tags = await TagModel.getTagsForDocument(documentId, userId);
    return res.json({ tags });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to get document tags" });
  }
}

export async function setDocumentTags(req, res) {
  try {
    const userId = req.user.id;
    const documentId = parseInt(req.params.id, 10);
    const { tag_ids } = req.body;
    if (isNaN(documentId)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }
    const ids = Array.isArray(tag_ids) ? tag_ids.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id)) : [];
    const tags = await TagModel.setDocumentTags(documentId, ids, userId);
    return res.json({ tags });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to set document tags" });
  }
}
