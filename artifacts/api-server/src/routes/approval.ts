import { Router, type IRouter, type Request, type Response } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

const router: IRouter = Router();
const resend = new Resend(process.env.RESEND_API_KEY);
const APPROVAL_EMAIL = process.env.APPROVAL_EMAIL ?? "";
const BASE_URL = process.env.BASE_URL ?? "https://steveanalizweb-api.onrender.com";

export async function sendApprovalEmail(postId: number, title: string, summary: string, content: string): Promise<void> {
  if (!APPROVAL_EMAIL || !process.env.RESEND_API_KEY) {
    console.log("Email ayarlari eksik, atlanıyor.");
    return;
  }

  const approveUrl = BASE_URL + "/api/approve/" + postId + "?action=approve";
  const rejectUrl = BASE_URL + "/api/approve/" + postId + "?action=reject";

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: APPROVAL_EMAIL,
    subject: "Yeni Blog Taslagi: " + title,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a2e;">Steve Analiz — Yeni Blog Taslagi</h1>
        <h2>${title}</h2>
        <p style="color: #666;">${summary}</p>
        <hr/>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <pre style="white-space: pre-wrap; font-size: 14px;">${content.substring(0, 500)}...</pre>
        </div>
        <div style="margin-top: 24px; display: flex; gap: 16px;">
          <a href="${approveUrl}" style="background: #22c55e; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            ONAYLA
          </a>
          &nbsp;&nbsp;
          <a href="${rejectUrl}" style="background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            REDDET
          </a>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          Bu email Steve Analiz AI tarafindan otomatik gonderilmistir.
        </p>
      </div>
    `
  });

  console.log("Onay emaili gonderildi:", title);
}

// GET /api/approve/:id?action=approve|reject
router.get("/approve/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const action = req.query.action as string;

  if (!id || !action) {
    return res.status(400).send("Gecersiz istek.");
  }

  try {
    if (action === "approve") {
      await db.update(blogPostsTable)
        .set({ status: "published" })
        .where(eq(blogPostsTable.id, id));

      res.send(`
        <html><body style="font-family:sans-serif;text-align:center;padding:40px;">
          <h1 style="color:#22c55e;">Onaylandi!</h1>
          <p>Blog yazisi yayinlandi.</p>
          <a href="${BASE_URL}/blog">Siteye Git</a>
        </body></html>
      `);
    } else if (action === "reject") {
      await db.delete(blogPostsTable)
        .where(eq(blogPostsTable.id, id));

      res.send(`
        <html><body style="font-family:sans-serif;text-align:center;padding:40px;">
          <h1 style="color:#ef4444;">Reddedildi!</h1>
          <p>Blog yazisi silindi.</p>
        </body></html>
      `);
    } else {
      res.status(400).send("Gecersiz aksiyon.");
    }
  } catch (err: any) {
    res.status(500).send("Hata: " + err.message);
  }
});

export default router;
