import { Link } from "wouter";
import { useListBlogPosts, useGetBlogStats } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BarChart3, TrendingUp, Users } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function Home() {
  const { data: blogPosts, isLoading: isLoadingPosts } = useListBlogPosts();
  const { data: blogStats, isLoading: isLoadingStats } = useGetBlogStats();

  const recentPosts = blogPosts?.slice(0, 3) || [];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <section className="py-20 flex flex-col items-center text-center space-y-8">
        <div className="space-y-4 max-w-4xl">
          <Badge variant="outline" className="px-3 py-1 text-sm border-primary/50 text-primary uppercase tracking-widest">
            STEVE ANALİZ.WEB 2.0
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Geleceğe Yönelik <br />
            <span className="text-primary">Finansal Analiz</span> Platformu
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Genç yatırımcıların bilgiye dayalı karar almasını demokratikleştiren yapay zeka destekli analiz ekosistemi.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/blog">
            <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8">
              Blog'a Git
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <a href="https://youtube.com/@steveanalizweb" target="_blank" rel="noreferrer">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8 border-primary/30 hover:bg-primary/10">
              YouTube Kanalına Git
            </Button>
          </a>
        </div>
      </section>

      {/* Mission Blocks */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
          <CardHeader>
            <BarChart3 className="h-10 w-10 text-primary mb-4" />
            <CardTitle>Demokratik Finans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Steve Analiz.web, finansal piyasalarda bilgiye dayalı karar almayı demokratikleştirmeyi amaçlayan bir finansal analiz platformudur. Geniş veri kümeleri ve yapay zeka destekli öngörülerle genç yatırımcıları güçlendirmek üzerine kurulmuştur.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
          <CardHeader>
            <Users className="h-10 w-10 text-primary mb-4" />
            <CardTitle>Açık Zihniyet & Web 2.0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Web 2.0 prensipleri doğrultusunda, 'Açık Zihniyet' yaklaşımıyla kullanıcıların fikirlerini paylaşabileceği ve analiz ekosistemine katkıda bulunduğu bir platformdur.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
          <CardHeader>
            <TrendingUp className="h-10 w-10 text-primary mb-4" />
            <CardTitle>İçerik & Yazar Ekosistemi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              YouTube kanalı: steveanaliz web – Financial Technologies and Investment Analysis ile birlikte, finans, teknoloji ve yatırım alanlarında genç yazarlar için bir içerik ve yazar platformu olmayı hedefler.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="py-10 border-y border-border/40">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Platform İstatistikleri</h2>
            <p className="text-muted-foreground">Büyüyen analiz havuzumuza göz atın.</p>
          </div>
          
          <div className="flex gap-12">
            <div className="text-center">
              <div className="text-5xl font-black text-primary mb-2">
                {isLoadingStats ? <Skeleton className="h-12 w-16 mx-auto" /> : blogStats?.totalPosts || 0}
              </div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Toplam Analiz</div>
            </div>
            
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-2 max-w-[200px] mb-2">
                {isLoadingStats ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  Object.entries(blogStats?.tagCounts || {})
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([tag]) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))
                )}
              </div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Popüler Konular</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Son Analizler</h2>
            <p className="text-muted-foreground">Piyasalardaki en son gelişmeleri okuyun.</p>
          </div>
          <Link href="/blog">
            <Button variant="ghost" className="hidden sm:flex">
              Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingPosts ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="flex flex-col h-full">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent className="flex-1">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            recentPosts.map((post) => (
              <Card key={post.id} className="flex flex-col h-full bg-card hover:border-primary/40 transition-colors group">
                <CardHeader>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {post.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(post.createdAt), "d MMMM yyyy", { locale: tr })} • {post.author}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground line-clamp-3 text-sm">
                    {post.summary}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={`/blog/${post.slug}`} className="w-full">
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      Devamını Oku
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
        <Link href="/blog" className="sm:hidden mt-4 block">
          <Button variant="outline" className="w-full">
            Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
