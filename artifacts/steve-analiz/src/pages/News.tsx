import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Clock } from "lucide-react";

const MOCK_NEWS = [
  {
    id: 1,
    title: "TCMB Faizi Sabit Bıraktı",
    slug: "tcmb-faiz-sabit",
    summary: "TCMB politika faizini %45 seviyesinde sabit tuttu.",
    content: "<p>TCMB faizi sabit bıraktı.</p>",
    category: "Makro",
    tags: ["TCMB", "faiz"],
    readTime: "3 dk",
    hapHeadline: "Merkez Bankası Faizi Sabit Tuttu",
    hapContext: "Enflasyonla mücadelede kararlılık mesajı.",
    hapImpact: "Kısa vadede bankacılık hisseleri olumlu etkilenebilir.",
    hapQuote: "TCMB temkinli duruşunu koruyor.",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Bitcoin 70.000 Doları Aştı",
    slug: "bitcoin-70-bin",
    summary: "Bitcoin spot ETF talebiyle 70.000 doları aştı.",
    content: "<p>Bitcoin yükselişte.</p>",
    category: "Kripto",
    tags: ["Bitcoin", "kripto"],
    readTime: "3 dk",
    hapHeadline: "Bitcoin 70.000 Doları Gördü",
    hapContext: "Spot ETF talebi fiyatı yükseltti.",
    hapImpact: "Kripto yatırımcıları için olumlu.",
    hapQuote: "Kurumsal yatırımcılar kriptoya giriş yapıyor.",
    createdAt: new Date().toISOString()
  }
];

const CATEGORY_COLORS: Record<string, string> = {
  Makro: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Kripto: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function News() {
  const [selected, setSelected] = useState<any>(null);
  const news = MOCK_NEWS;

  if (selected) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
        <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
          ← Haberlere Dön
        </button>
        <div className="space-y-2">
          <Badge className={CATEGORY_COLORS[selected.category] ?? ""}>{selected.category}</Badge>
          <h1 className="text-3xl font-bold">{selected.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{selected.readTime}</span>
            <span>•</span>
            <span>{new Date(selected.createdAt).toLocaleDateString("tr-TR")}</span>
          </div>
        </div>
        {selected.hapHeadline && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{selected.hapHeadline}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selected.hapContext && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Bu ne demek?</p>
                  <p className="text-sm">{selected.hapContext}</p>
                </div>
              )}
              {selected.hapImpact && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Senin için ne ifade ediyor?</p>
                  <p className="text-sm">{selected.hapImpact}</p>
                </div>
              )}
              {selected.hapQuote && (
                <blockquote className="border-l-2 border-primary pl-4 italic text-sm text-muted-foreground">
                  "{selected.hapQuote}"
                </blockquote>
              )}
            </CardContent>
          </Card>
        )}
        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: selected.content?.replace(/\n/g, "<br/>") ?? "" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-3 max-w-3xl">
        <Badge variant="outline" className="px-3 py-1 text-sm border-primary/50 text-primary uppercase tracking-widest">
          <Newspaper className="h-3 w-3 mr-2" /> Hap Haber
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase">
          Piyasayı <span className="text-primary">3 Dakikada</span> Yakala
        </h1>
        <p className="text-xl text-muted-foreground">
          Karmaşık ekonomi haberlerini sade, anlaşılır ve hızlı formatla.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map(item => (
          <Card
            key={item.id}
            className="cursor-pointer hover:border-primary/40 transition-all duration-300 group"
            onClick={() => setSelected(item)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-2">
                <Badge className={`text-xs ${CATEGORY_COLORS[item.category] ?? ""}`}>
                  {item.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {item.readTime}
                </div>
              </div>
              <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {item.hapHeadline ?? item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
              {item.hapContext && (
                <div className="bg-muted/30 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.hapContext}</p>
                </div>
              )}
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                </span>
                <span className="text-xs text-primary group-hover:underline">Oku →</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
