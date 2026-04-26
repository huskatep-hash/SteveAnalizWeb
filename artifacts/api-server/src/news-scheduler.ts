import Groq from "groq-sdk";
import { db } from "@workspace/db";
import { newsPostsTable } from "@workspace/db";
import { sendApprovalEmail } from "./routes/approval";
import cron from "node-cron";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const NEWS_API_KEY = process.env.NEWS_API_KEY;

function makeSlug(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    + "-" + Date.now();
}

async function fetchEconomyNews() {
  const url = `https://newsapi.org/v2/everything?q=ekonomi+borsa+faiz+dolar&language=tr&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json() as any;
  return data.articles ?? [];
}

async function convertToHapFormat(article: any) {
  const prompt = `Sen bir Turk finans editörüsün. Asagidaki haber metnini "Hap Haber" formatina cevir.

HABER BASLIGI: ${article.title}
HABER ICERIGI: ${article.description ?? article.content ?? ""}

Asagidaki JSON formatinda SADECE JSON dondur, baska hicbir sey yazma:
{
  "hapHeadline": "Cok kisa, carpici baslik (max 8 kelime)",
  "hapContext": "Bu ne demek? Basit Turkce aciklama (max 2 cumle)",
  "hapImpact": "Yatirimci icin ne ifade ediyor? (max 2 cumle)",
  "hapQuote": "Ozlu bir cumle veya uzman gorusu",
  "summary": "2 cumlelik ozet",
  "category": "Makro veya Kripto veya Emtia veya Sirket veya Piyasa"
}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });

  const text = completion.choices[0].message.content ?? "{}";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

async function gunlukHaberleriCek() {
  console.log("Gunluk haberler cekiliyor...");
  
  if (!NEWS_API_KEY) {
    console.error("NEWS_API_KEY eksik!");
    return;
  }

  try {
    const articles = await fetchEconomyNews();
    console.log(`${articles.length} haber bulundu.`);

    for (const article of articles.slice(0, 5)) {
      try {
        const hap = await convertToHapFormat(article);
        const slug = makeSlug(article.title ?? "haber");

        const [post] = await db.insert(newsPostsTable).values({
          title: article.title ?? "Baslıksız",
          slug,
          author: "SteveAnalizAI",
          summary: hap.summary ?? article.description ?? "",
          content: article.content ?? article.description ?? "",
          category: hap.category ?? "Makro",
          tags: ["ekonomi", "guncel"],
          status: "draft",
          hapHeadline: hap.hapHeadline ?? null,
          hapContext: hap.hapContext ?? null,
          hapImpact: hap.hapImpact ?? null,
          hapNumbers: [],
          hapQuote: hap.hapQuote ?? null,
        }).returning();

        console.log(`Taslak olusturuldu: ${post.id}`);
        await sendApprovalEmail(post.id, post.title, post.summary, post.content);
        
        await new Promise(r => setTimeout(r, 2000));
      } catch (e: any) {
        console.error("Haber isleme hatasi:", e.message);
      }
    }
  } catch (e: any) {
    console.error("Haber cekme hatasi:", e.message);
  }
}

cron.schedule("0 6 * * *", gunlukHaberleriCek, { timezone: "Europe/Istanbul" });
console.log("Haber scheduler aktif - her sabah 06:00");

export { gunlukHaberleriCek };
