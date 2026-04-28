import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MOCK_BLOGS = [
  {
    id: 1,
    title: "Borsa İstanbul 2026 Görüşleri",
    slug: "bist-2026-1",
    summary: "BIST100 endeksi için 2026 beklentileri ve sektörel analiz. Uzmanlar bankacılık ve teknoloji sektörlerinde hareketlilik bekliyor.",
    tags: ["borsa", "ekonomi"],
    author: "SteveAnalizAI",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Dolar Kuru Tahmini",
    slug: "dolar-kuru-1",
    summary: "Dolar/TL kuru için kısa ve orta vadeli projeksiyonlar. Küresel gelişmeler ve TCMB politikaları ışığında analiz.",
    tags: ["dolar", "ekonomi"],
    author: "SteveAnalizAI",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Kripto Para Piyasasında Son Durum",
    slug: "kripto-durum-1",
    summary: "Bitcoin ve Ethereum başta olmak üzere kripto para piyasasındaki son gelişmeler ve yatırımcı stratejileri.",
    tags: ["kripto"],
    author: "SteveAnalizAI",
    createdAt: new Date().toISOString()
  }
];

export default function Blog() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const filteredPosts = selectedTag 
    ? MOCK_BLOGS.filter(post => post.tags.includes(selectedTag))
    : MOCK_BLOGS;

  const allTags = [...new Set(MOCK_BLOGS.flatMap(post => post.tags))];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight">Blog & Analizler</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Finans, ekonomi ve yatırım üzerine derinlemesine analizler.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant={!selectedTag ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setSelectedTag(null)}
        >
          Tümü
        </Badge>
        {allTags.map(tag => (
          <Badge 
            key={tag}
            variant={selectedTag === tag ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="h-full bg-card hover:border-primary/40 transition-all duration-300 group cursor-pointer">
              <CardHeader>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl">
                  {post.title}
                </CardTitle>
                <CardDescription>{post.author} • {new Date(post.createdAt).toLocaleDateString("tr-TR")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3 text-sm">{post.summary}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  Devamını Oku
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
