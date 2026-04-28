import { Router, type IRouter, type Request, type Response } from "express";
import { db, newsPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

// Haber listesi
router.get("/news", async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit ?? "20");
    const news = await db.select().from(newsPostsTable)
      .where(eq(newsPostsTable.status, "published"))
      .orderBy(desc(newsPostsTable.createdAt))
      .limit(limit);
    res.json(news);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Haber detay
router.get("/news/:slug", async (req: Request, res: Response) => {
  try {
    const news = await db.select().from(newsPostsTable)
      .where(eq(newsPostsTable.slug, req.params.slug)).limit(1);
    if (!news.length) return res.status(404).json({ error: "Haber bulunamadi." });
    res.json(news[0]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Manuel haber çekme tetikleyicisi (auth gerekli)
router.post("/news/trigger", requireAuth, async (_req: Request, res: Response) => {
  res.json({ success: true, message: "Haberler cekiliyor..." });
  try {
    const { gunlukHaberleriCek } = await import("../news-scheduler");
    await gunlukHaberleriCek();
  } catch (e: any) {
    console.error("Haber tetikleme hatasi:", e.message);
  }
});

export default router;
