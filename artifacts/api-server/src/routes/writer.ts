import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, writersTable } from "@workspace/db";
import { ApplyAsWriterBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/writer", async (_req, res): Promise<void> => {
  const writers = await db
    .select()
    .from(writersTable)
    .orderBy(writersTable.createdAt);
  res.json(writers);
});

router.post("/writer", async (req, res): Promise<void> => {
  const parsed = ApplyAsWriterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [writer] = await db
    .insert(writersTable)
    .values({ ...parsed.data, status: "pending" })
    .returning();

  res.status(201).json(writer);
});

router.get("/writer/approved", async (_req, res): Promise<void> => {
  const writers = await db
    .select()
    .from(writersTable)
    .where(eq(writersTable.status, "approved"))
    .orderBy(writersTable.createdAt);
  res.json(writers);
});

export default router;
