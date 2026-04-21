import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, LineChart, MessageSquare, Search, Zap, ShieldCheck, Send, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "BIST100 için bu hafta öne çıkan sektörler hangileri?",
  "Genç bir yatırımcı portföyünü nasıl çeşitlendirmeli?",
  "Bitcoin halving sonrası ne beklemeliyiz?",
  "Türk Lirası'nda kısa vadeli görünüm nasıl?",
];

export default function SteveAnalizAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    setError(null);
    const history = messages.slice();
    const newMessages: ChatMessage[] = [
      ...history,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    try {
      const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Yanıt alınamadı.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload) continue;
          try {
            const data = JSON.parse(payload);
            if (data.error) {
              throw new Error(data.error);
            }
            if (data.content) {
              setMessages((prev) => {
                const copy = prev.slice();
                const last = copy[copy.length - 1];
                if (last && last.role === "assistant") {
                  copy[copy.length - 1] = { ...last, content: last.content + data.content };
                }
                return copy;
              });
            }
          } catch (e) {
            console.error("Parse error", e);
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(msg);
      setMessages((prev) => {
        const copy = prev.slice();
        if (copy[copy.length - 1]?.role === "assistant" && copy[copy.length - 1].content === "") {
          copy.pop();
        }
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero */}
      <section className="py-12 flex flex-col items-center text-center space-y-6">
        <Badge variant="outline" className="px-3 py-1 text-sm border-primary/50 text-primary uppercase tracking-widest">
          <Sparkles className="h-3 w-3 mr-2" /> Yapay Zeka Destekli
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase max-w-4xl leading-tight">
          <span className="text-primary">SteveAnalizAI</span> ile Finansal Zekayı Yeniden Tanımlayın
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Üretken yapay zeka, makine öğrenimi ve gerçek zamanlı veri analizi tek bir motorda. Piyasaları sorun, içgörü alın, daha hızlı karar verin.
        </p>
      </section>

      {/* Live Chat */}
      <section className="bg-card/50 rounded-2xl border border-border p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">SteveAnalizAI</h3>
            <p className="text-sm text-muted-foreground">
              {streaming ? "Yanıt yazılıyor..." : "Sorularınızı yazın, gerçek zamanlı yanıt alın"}
            </p>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="min-h-[300px] max-h-[500px] overflow-y-auto space-y-4 pr-2"
        >
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-4">
              <p className="text-muted-foreground text-sm">Başlamak için bir öneri seçin veya kendi sorunuzu yazın:</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                {SUGGESTIONS.map((s) => (
                  <Button
                    key={s}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-2 px-3 whitespace-normal text-left"
                    onClick={() => sendMessage(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted rounded-tl-sm"
                }`}
              >
                {m.content || (streaming && i === messages.length - 1 ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null)}
              </div>
            </div>
          ))}

          {error && (
            <div className="text-center text-sm text-destructive bg-destructive/10 rounded-md py-2 px-4">
              {error}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="pt-4 border-t border-border"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="SteveAnalizAI'a sorunuzu yazın..."
              className="flex-1 bg-background border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={streaming}
            />
            <Button type="submit" disabled={streaming || input.trim().length === 0}>
              {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">Sor</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Yanıtlar yatırım tavsiyesi değildir, eğitim amaçlıdır.
          </p>
        </form>
      </section>

      {/* Core Features */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Brain, title: "Akıllı Piyasa Yorumları", desc: "Gerçek zamanlı haber, bilanço ve teknik veriyi sentezleyerek anlamlı yorumlar üretir." },
          { icon: LineChart, title: "Tahminsel Modeller", desc: "Geçmiş veri ve momentum analizleriyle olasılıksal senaryo modelleri sunar." },
          { icon: MessageSquare, title: "Doğal Dil Sorgulama", desc: "'BIST100 bu hafta neden düştü?' gibi sorularınıza Türkçe, anlaşılır cevaplar." },
          { icon: Search, title: "S.A.M Steve Arama Modülü", desc: "Şirket, sektör veya tema bazlı derinlemesine arama ve karşılaştırmalı analiz." },
          { icon: Zap, title: "Gerçek Zamanlı Uyarılar", desc: "Fiyat hareketleri, haber akışları ve teknik formasyonlar için kişisel bildirimler." },
          { icon: ShieldCheck, title: "Şeffaf Kaynak Atıfları", desc: "Her cevap kaynak gösterimi ile sunulur. Yatırım kararı sizin, içgörü bizim." },
        ].map((f) => (
          <Card key={f.title} className="hover:border-primary/40 transition-colors">
            <CardHeader>
              <f.icon className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-xl">{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* How it works */}
      <section className="space-y-8">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight uppercase">Nasıl Çalışır?</h2>
          <p className="text-muted-foreground">Üç adımda finansal kararlarınıza yapay zeka gücü.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Sorun", desc: "İlgilendiğiniz şirket, sektör veya makro konuyu doğal dilde yazın." },
            { step: "02", title: "Analiz Edin", desc: "AI, güncel veriyi tarayıp çok kaynaklı bir özet ve yorum üretir." },
            { step: "03", title: "Karar Verin", desc: "Olasılıkları, riskleri ve fırsatları görerek bilinçli aksiyon alın." },
          ].map((s) => (
            <Card key={s.step} className="text-center">
              <CardHeader>
                <div className="text-5xl font-black text-primary/30 mb-2">{s.step}</div>
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{s.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
