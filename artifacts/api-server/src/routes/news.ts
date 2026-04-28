import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { newsPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/news", async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit ?? "20");
    const news = await db
      .select({
        id: newsPostsTable.id,
        title: newsPostsTable.title,
        slug: newsPostsTable.slug,
        summary: newsPostsTable.summary,
        content: newsPostsTable.content,
        category: newsPostsTable.category,
        tags: newsPostsTable.tags,
        createdAt: newsPostsTable.createdAt,
      })
      .from(newsPostsTable)
      .where(eq(newsPostsTable.status, "published"))
      .orderBy(desc(newsPostsTable.createdAt))
      .limit(limit);
    res.json(news);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
});

router.get("/news/:slug", async (req: Request, res: Response) => {
  try {
    const news = await db
      .select({
        id: newsPostsTable.id,
        title: newsPostsTable.title,
        slug: newsPostsTable.slug,
        summary: newsPostsTable.summary,
        content: newsPostsTable.content,
        category: newsPostsTable.category,
        tags: newsPostsTable.tags,
        createdAt: newsPostsTable.createdAt,
      })
      .from(newsPostsTable)
      .where(eq(newsPostsTable.slug, req.params.slug))
      .limit(1);
    if (!news.length) return res.status(404).json({ error: "Haber bulunamadi." });
    res.json(news[0]);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
