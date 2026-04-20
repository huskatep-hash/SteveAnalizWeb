import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, educationPostsTable } from "@workspace/db";
import {
  CreateEducationContentBody,
  GetEducationContentParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/education", async (_req, res): Promise<void> => {
  const posts = await db
    .select()
    .from(educationPostsTable)
    .orderBy(educationPostsTable.order, educationPostsTable.createdAt);
  res.json(posts);
});

router.post("/education", async (req, res): Promise<void> => {
  const parsed = CreateEducationContentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [post] = await db
    .insert(educationPostsTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(post);
});

router.get("/education/:slug", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const paramsParsed = GetEducationContentParams.safeParse({ slug: raw });
  if (!paramsParsed.success) {
    res.status(400).json({ error: paramsParsed.error.message });
    return;
  }

  const [post] = await db
    .select()
    .from(educationPostsTable)
    .where(eq(educationPostsTable.slug, paramsParsed.data.slug));

  if (!post) {
    res.status(404).json({ error: "Education content not found" });
    return;
  }

  res.json(post);
});

export default router;
