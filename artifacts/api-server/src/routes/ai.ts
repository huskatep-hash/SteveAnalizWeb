import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

// OpenAI opsiyonel
let openai: any = null;
try {
  if (process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
    const { default: OpenAI } = await import("openai");
    openai = new OpenAI({
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
    });
    console.log("OpenAI başlatıldı.");
  }
} catch {
  console.warn("OpenAI başlatılamadı, AI chat devre dışı.");
}

const SYSTEM_PROMPT = `Sen SteveAnalizAI'sın — Türk genç yatırımcılara özel bir finansal analiz asistanısın.
Görevin:
- BIST (Borsa İstanbul), döviz, kripto ve emtia piyasaları hakkında net, sade ve eğitici cevaplar vermek
- Yatırım kararı vermek yerine kullanıcının bilinçli karar almasını sağlayacak içgörüler sunmak
- Cevaplarında daima bir yatırım tavsiyesi olmadığını, eğitim amaçlı olduğunu hatırlat
- Türkçe yanıt ver, finansal terimleri kısaca açıkla
- Veri tarihinin gerçek zamanlı olmadığını, bilgilerinin sınırlı olabileceğini belirt
- Cevapların kısa ve öz olsun (en fazla 4-5 paragraf)
Platform: SteveAnaliz.Web`;

router.post("/ai/chat", async (req: Request, res: Response): Promise<void> => {
  if (!openai) {
    res.status(503).json({ error: "AI servisi şu anda aktif değil." });
    return;
  }

  try {
    const { message, history } = req.body as {
      message?: string;
      history?: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      res.status(400).json({ error: "Mesaj gereklidir." });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history ?? []).slice(-10),
      { role: "user", content: message },
    ];

    const stream = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_completion_tokens: 8192,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error("AI chat error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Yapay zeka şu anda yanıt veremiyor." });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Yanıt sırasında bir hata oluştu." })}\n\n`);
      res.end();
    }
  }
});

export default router;
