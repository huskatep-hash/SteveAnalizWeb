import { db } from "@workspace/db";
import { newsPostsTable } from "@workspace/db";
import { sendApprovalEmail } from "./routes/approval";
import cron from "node-cron";

// Groq opsiyonel
let groq: any = null;
try {
  if (process.env.GROQ_API_KEY) {
    const { default: Groq } = await import("groq-sdk");
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log("Groq başlatıldı.");
  }
} catch {
  console.warn("Groq başlatılamadı, haber çevirisi devre dışı.");
}

const NEWS_API_KEY = process.env.NEWS_API_KEY;

function makeSlug(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    + "-" + Date.now();
}

async function gunlukHaberleriCek() {
  console.log("Gunluk haberler cekiliyor...");
  
  if (!NEWS_API_KEY) {
    console.error("NEWS_API_KEY eksik!");
    return;
  }

  try {
    const url = `https://newsapi.org/v2/everything?q=ekonomi+borsa+faiz&language=tr&sortBy=publishedAt&pageSize=3&apiKey=${NEWS_API_KEY}`;
    const r = await fetch(url);
    const data = (await r.json()) as { articles?: Array<{ title?: string; description?: string; content?: string }> };
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
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Bilinmeyen hata";
        console.error("Kayit hatasi:", message);
      }
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Bilinmeyen hata";
    console.error("Cekme hatasi:", message);
  }
}

cron.schedule("0 6 * * *", gunlukHaberleriCek, { timezone: "Europe/Istanbul" });
console.log("Haber scheduler aktif - her sabah 06:00");

export { gunlukHaberleriCek };
