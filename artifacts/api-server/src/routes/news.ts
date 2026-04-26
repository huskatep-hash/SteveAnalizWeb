import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { newsPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/news — Tüm haberler
router.get("/news", async (req: Request, res: Response) => {
  try {
    const { category, limit = "20" } = req.query as { category?: string; limit?: string };
    let query = db.select().from(newsPostsTable).where(eq(newsPostsTable.status, "published")).orderBy(desc(newsPostsTable.createdAt)).limit(Number(limit));
    const news = await query;
    res.json(news);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/news/:slug — Tek haber
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

// POST /api/news — Yeni haber ekle
router.post("/news", async (req: Request, res: Response) => {
  try {
    const { title, slug, summary, content, category, tags, hapHeadline, hapContext, hapImpact, hapNumbers, hapQuote } = req.body;
    if (!title || !slug || !content) return res.status(400).json({ error: "Zorunlu alanlar eksik." });

    const [post] = await db.insert(newsPostsTable).values({
      title, slug, summary: summary ?? "", content, category: category ?? "Makro",
      tags: tags ?? [], hapHeadline, hapContext, hapImpact,
      hapNumbers: hapNumbers ?? [], hapQuote, status: "draft"
    }).returning();

    res.status(201).json(post);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
