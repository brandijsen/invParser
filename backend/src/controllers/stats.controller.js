import { StatsModel } from "../models/stats.model.js";

/**
 * GET /api/stats/overview
 * Returns general statistics
 */
export const getOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await StatsModel.getOverview(userId);
    res.json(stats);
  } catch (err) {
    console.error("Get overview stats failed:", err);
    res.status(500).json({ message: "Failed to get statistics" });
  }
};

/**
 * GET /api/stats/trends
 * Returns upload trend, type distribution, due dates, spending
 */
export const getTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const days = parseInt(req.query.days) || 30;

    const fetchSafe = async (fn, fallback) => {
      try {
        return await fn();
      } catch (e) {
        console.error("Stats sub-query failed:", e.message);
        return fallback;
      }
    };

    const [
      uploadTrend,
      typeDistribution,
      dueDateDistribution,
      spendingTrend,
      latestDocuments,
    ] = await Promise.all([
      fetchSafe(() => StatsModel.getUploadTrend(userId, days), []),
      fetchSafe(() => StatsModel.getDocumentTypeDistribution(userId), []),
      fetchSafe(() => StatsModel.getDueDateDistribution(userId), []),
      fetchSafe(() => StatsModel.getSpendingTrend(userId, 90), []), // Spending: always 90 days
      fetchSafe(() => StatsModel.getLatestDocuments(userId, 5), []),
    ]);

    res.json({
      uploadTrend,
      typeDistribution,
      dueDateDistribution,
      spendingTrend,
      latestDocuments,
    });
  } catch (err) {
    console.error("Get trends failed:", err);
    res.status(500).json({ message: "Failed to get trends" });
  }
};
