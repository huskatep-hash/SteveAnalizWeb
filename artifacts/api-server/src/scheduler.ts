import Groq from "groq-sdk";
import { db, blogPostsTable } from "@workspace/db";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const KONULAR = [
  "Turkiye enflasyon verileri ve portfoy stratejisi",
  "Fed faiz kararlari ve gelisen piyasalara etkisi",
  "Altin fiyatlari teknik ve temel analiz",
  "Borsa Istanbul sektor rotasyonu firsatlari",
  "Bitcoin ve kripto piyasasi makro baglamda analiz",
  "Dolar TL kuru ve doviz stratejileri",
  "Emtia piyasalari ve Turkiye ekonomisine etkileri"
];

function makeSlug(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    + "-" + Date.now();
}

export async function gunlukBlogYaz(): Promise<void> {
  const konu = KONULAR[new Date().getDay() % KONULAR.length];
  console.log("Blog uretiliyor:", konu);

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: "Sen deneyimli bir Turk finans ve ekonomi blog yazarisin. Asagidaki konu hakkinda profesyonel bir blog yazisi yaz: KONU: " + konu + ". KURALLAR: Turkce yaz, 800-1000 kelime, ## ile basliklar kullan, makro ve mikro ekonomik baglamı ekle, genc yatirimcilara hitap et, sonunda Yatirimci Notu ekle. Tarih: " + new Date().toLocaleDateString("tr-TR")
      }],
      max_tokens: 2000
    });

    const content = completion.choices[0].message.content ?? "";
    const slug = makeSlug(konu);

    await db.insert(blogPostsTable).values({
      title: konu,
      slug,
      author: "SteveAnalizAI",
      summary: konu + " hakkinda kapsamli analiz ve yatirim stratejileri.",
      content,
      tags: ["analiz", "ekonomi"],
      type: "analysis"
    });

    console.log("Blog kaydedildi:", slug);
  } catch (e: any) {
    console.error("Scheduler hatasi:", e.message);
  }
}
