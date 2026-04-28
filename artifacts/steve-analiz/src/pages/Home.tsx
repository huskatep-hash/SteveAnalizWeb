import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, TrendingUp, Users, PenTool } from "lucide-react";

const MOCK_POSTS = [
  { id: 1, title: "Borsa İstanbul 2026 Görüşleri", slug: "bist-2026-1", summary: "BIST100 için 2026 beklentileri.", tags: ["borsa"], author: "SteveAnalizAI", createdAt: new Date().toISOString() },
  { id: 2, title: "Dolar Kuru Tahmini", slug: "dolar-kuru-1", summary: "Dolar/TL projeksiyonları.", tags: ["dolar"], author: "SteveAnalizAI", createdAt: new Date().toISOString() },
  { id: 3, title: "Kripto Para Piyasası", slug: "kripto-durum-1", summary: "Kripto piyasasında son durum.", tags: ["kripto"], author: "SteveAnalizAI", createdAt: new Date().toISOString() }
];

const MOCK_EDUCATION = [
  { id: 1, title: "Temel Finans Eğitimi", slug: "temel-finans-1", summary: "Finansal okuryazarlık.", type: "education", order: 1 },
  { id: 2, title: "İleri Teknik Analiz", slug: "teknik-analiz-1", summary: "Teknik analiz araçları.", type: "education", order: 2 }
];

const MOCK_STATS = { totalPosts: 3, tagCounts: { borsa: 1, dolar: 1, kripto: 1 } };

export default function Home() {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="py-20 flex flex-col items-center text-center space-y-8">
        <div className="space-y-4 max-w-4xl">
          <Badge variant="outline" className="px-3 py-1 text-sm border-primary/50 text-primary uppercase tracking-widest">
            SteveAnaliz.Web 2.0
          </Badge>
          <h1 className="text-2xl md:text-4xl font-bold uppercase text-foreground leading-tight">
            Geleceğe Yönelik <br />
            <span className="text-primary">Finansal Analiz</span> Platformu
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Genç yatırımcıların bilgiye dayalı karar almasını demokratikleştiren yapay zeka destekli analiz ekosistemi.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/blog"><Button size="lg">Blog'a Git <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
          <a href="https://youtube.com/@steveanalizweb" target="_blank" rel="noreferrer">
            <Button variant="outline" size="lg">YouTube</Button>
          </a>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50"><CardHeader><BarChart3 className="h-10 w-10 text-primary mb-4" /><CardTitle>Demokratik Finans</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Finansal piyasalarda bilgiye dayalı karar almayı demokratikleştirmeyi amaçlayan bir platform.</p></CardContent></Card>
        <Card className="bg-card/50"><CardHeader><Users className="h-10 w-10 text-primary mb-4" /><CardTitle>Açık Zihniyet</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Kullanıcıların fikirlerini paylaşabileceği ve analiz ekosistemine katkıda bulunduğu bir platform.</p></CardContent></Card>
        <Card className="bg-card/50"><CardHeader><TrendingUp className="h-10 w-10 text-primary mb-4" /><CardTitle>İçerik Ekosistemi</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Genç yazarlar için bir içerik ve yazar platformu olmayı hedefler.</p></CardContent></Card>
      </section>

      <section className="py-10 border-y border-border/40">
        <div className="flex justify-between items-center gap-8">
          <div><h2 className="text-3xl font-bold">Platform İstatistikleri</h2></div>
          <div className="flex gap-12">
            <div className="text-center"><div className="text-5xl font-black text-primary">{MOCK_STATS.totalPosts}</div><div className="text-sm text-muted-foreground">Analiz</div></div>
            <div className="text-center"><div className="text-5xl font-black text-primary">{MOCK_EDUCATION.length}</div><div className="text-sm text-muted-foreground">Eğitim</div></div>
            <div className="text-center"><div className="text-5xl font-black text-primary">2</div><div className="text-sm text-muted-foreground">Yazar</div></div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div><h2 className="text-3xl font-bold">Son Analizler</h2></div>
          <Link href="/blog"><Button variant="ghost">Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_POSTS.map(post => (
            <Card key={post.id} className="flex flex-col h-full bg-card hover:border-primary/40 transition-colors group">
              <CardHeader>
                <div className="flex gap-2 mb-3">{post.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}</div>
                <CardTitle className="line-clamp-2 group-hover:text-primary">{post.title}</CardTitle>
                <CardDescription>{post.author}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1"><p className="text-muted-foreground line-clamp-3 text-sm">{post.summary}</p></CardContent>
              <CardFooter>
                <Link href={`/blog/${post.slug}`} className="w-full">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">Devamını Oku</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div><h2 className="text-3xl font-bold">Eğitim Platformu</h2></div>
          <Link href="/education"><Button variant="ghost">Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_EDUCATION.map(item => (
            <Card key={item.id} className="flex flex-col h-full bg-card hover:border-primary/40 transition-colors group">
              <CardHeader>
                <Badge variant="outline" className="text-xs border-primary/30 text-primary w-fit mb-2">{item.type}</Badge>
                <CardTitle className="line-clamp-2 group-hover:text-primary">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1"><p className="text-muted-foreground line-clamp-3 text-sm">{item.summary}</p></CardContent>
              <CardFooter>
                <Link href={`/education/${item.slug}`} className="w-full">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">Derse Git</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-primary/5 rounded-2xl p-12 border border-primary/20 text-center space-y-6">
        <PenTool className="h-12 w-12 text-primary mx-auto" />
        <h2 className="text-3xl font-bold">Yazar Ekosistemimize Katılın</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Finansal analiz ve piyasa öngörülerinizi geniş bir kitleyle paylaşın.</p>
        <Link href="/writer"><Button size="lg">Yazar Platformu <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
      </section>
    </div>
  );
}
