import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface HapNumber {
  label: string;
  value: string;
  change: "up" | "down" | "neutral";
}

interface NewsPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  readTime: string;
  hapHeadline: string | null;
  hapContext: string | null;
  hapImpact: string | null;
  hapNumbers: HapNumber[];
  hapQuote: string | null;
  likes: number;
  views: number;
  createdAt: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Makro: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Kripto: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Emtia: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Sirket: "bg-green-500/10 text-green-400 border-green-500/20",
  Piyasa: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

function SafeContent({ content }: { content: string }) {
  return (
    <div className="space-y-3">
      {content.split("\n").map((line, i) => {
        if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold mt-6 mb-2 text-foreground">{line.slice(3)}</h2>;
        if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold mt-4 mb-2 text-foreground">{line.slice(4)}</h3>;
        if (line.trim() === "") return <br key={i} />;
        return <p key={i} className="leading-relaxed text-foreground/90">{line}</p>;
      })}
    </div>
  );
}

export default function News() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<NewsPost | null>(null);
  const [activeCategory, setActiveCategory] = useState("Tumu");

  useEffect(() => {
    fetch("/api/news?limit=50")
      .then(r => r.json())
      .then(data => { setNews(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["Tumu", "Makro", "Kripto", "Emtia", "Sirket", "Piyasa"];
  const filtered = activeCategory === "Tumu" ? news : news.filter(n => n.category === activeCategory);

  if (selected) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
        <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
          Haberlere Don
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
