import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { newsPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/news", async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit ?? "20");
    const news = await db
      .select()
      .from(newsPostsTable)
      .where(eq(newsPostsTable.status, "published"))
      .orderBy(desc(newsPostsTable.createdAt))
      .limit(limit);
    res.json(news);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/news/:slug", async (req: Request, res: Response) => {
  try {
    const news = await db
      .select()
      .from(newsPostsTable)
      .where(eq(newsPostsTable.slug, req.params.slug))
      .limit(1);
    if (!news.length) return res.status(404).json({ error: "Haber bulunamadi." });
    res.json(news[0]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/news", async (req: Request, res: Response) => {
  try {
    const {
      title, slug, summary, content, category,
      tags, hapHeadline, hapContext, hapImpact,
      hapNumbers, hapQuote, status
    } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: "title, slug ve content zorunludur." });
    }

    const [post] = await db
      .insert(newsPostsTable)
      .values({
        title,
        slug,
        summary: summary ?? "",
        content,
        category: category ?? "Makro",
        tags: tags ?? [],
        hapHeadline: hapHeadline ?? null,
        hapContext: hapContext ?? null,
        hapImpact: hapImpact ?? null,
        hapNumbers: hapNumbers ?? [],
        hapQuote: hapQuote ?? null,
        status: status ?? "draft",
      })
      .returning();

    res.status(201).json(post);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
