import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import {
  ListBlogPostsQueryParams,
  CreateBlogPostBody,
  GetBlogPostParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/blog/stats", async (_req, res): Promise<void> => {
  const posts = await db
    .select({ tags: blogPostsTable.tags })
    .from(blogPostsTable);

  const tagCounts: Record<string, number> = {};
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    }
  }

  res.json({ totalPosts: posts.length, tagCounts });
});

router.get("/blog", async (req, res): Promise<void> => {
  const queryParsed = ListBlogPostsQueryParams.safeParse(req.query);
  if (!queryParsed.success) {
    res.status(400).json({ error: queryParsed.error.message });
    return;
  }

  const { tag } = queryParsed.data;

  let posts;
  if (tag) {
    posts = await db
      .select()
      .from(blogPostsTable)
      .where(sql`${tag} = ANY(${blogPostsTable.tags})`)
      .orderBy(desc(blogPostsTable.createdAt));
  } else {
    posts = await db
      .select()
      .from(blogPostsTable)
      .orderBy(desc(blogPostsTable.createdAt));
  }

  res.json(posts);
});

router.post("/blog", async (req, res): Promise<void> => {
  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [post] = await db
    .insert(blogPostsTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(post);
});

router.get("/blog/:slug", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const paramsParsed = GetBlogPostParams.safeParse({ slug: raw });
  if (!paramsParsed.success) {
    res.status(400).json({ error: paramsParsed.error.message });
    return;
  }

  const [post] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, paramsParsed.data.slug));

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.json(post);
});

export default router;
