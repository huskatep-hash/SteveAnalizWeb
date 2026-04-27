import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { newsPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

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

router.post("/news/trigger", async (req: Request, res: Response) => {
  res.json({ success: true, message: "Haberler cekiliyor..." });
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  if (!NEWS_API_KEY) { console.error("NEWS_API_KEY eksik!"); return; }
  try {
    console.log("Haberler cekiliyor...");
    const url = `https://newsapi.org/v2/everything?q=ekonomi+borsa+faiz&language=tr&sortBy=publishedAt&pageSize=3&apiKey=${NEWS_API_KEY}`;
    const r = await fetch(url);
    const data = await r.json() as any;
    const articles = data.articles ?? [];
    console.log(`${articles.length} haber bulundu.`);
    for (const article of articles) {
      try {
        const slug = (article.title ?? "haber").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50) + "-" + Date.now();
        const [post] = await db.insert(newsPostsTable).values({
          title: article.title ?? "Basliksiz",
          slug,
          author: "SteveAnalizAI",
          summary: article.description ?? "",
          content: article.content ?? article.description ?? "",
          category: "Makro",
          tags: ["ekonomi", "guncel"],
          status: "draft",
          hapHeadline: article.title ?? null,
          hapContext: article.description ?? null,
          hapImpact: null,
          hapNumbers: [],
          hapQuote: null,
        }).returning();
        console.log(`Haber kaydedildi: ${post.id} - ${post.title}`);
      } catch (e: any) { console.error("Kayit hatasi:", e.message); }
    }
  } catch (e: any) { console.error("Cekme hatasi:", e.message); }
});

router.post("/news", async (req: Request, res: Response) => {
  try {
    const { title, slug, summary, content, category, tags, hapHeadline, hapContext, hapImpact, hapNumbers, hapQuote, status } = req.body;
    if (!title || !slug || !content) {
      return res.status(400).json({ error: "title, slug ve content zorunludur." });
    }
    const [post] = await db.insert(newsPostsTable).values({
      title, slug, summary: summary ?? "", content,
      category: category ?? "Makro", tags: tags ?? [],
      hapHeadline: hapHeadline ?? null, hapContext: hapContext ?? null,
      hapImpact: hapImpact ?? null, hapNumbers: hapNumbers ?? [],
      hapQuote: hapQuote ?? null, status: status ?? "draft",
    }).returning();
    res.status(201).json(post);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
