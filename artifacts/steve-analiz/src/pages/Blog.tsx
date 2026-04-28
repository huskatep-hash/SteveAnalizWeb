import { useState } from "react";
import { Link, useSearch } from "wouter";
import { useListBlogPosts, useGetBlogStats, getListBlogPostsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const MOCK_BLOGS = [
  {
    id: 1,
    title: "Borsa İstanbul 2026 Görüşleri",
    slug: "bist-2026-1",
    summary: "BIST100 endeksi için 2026 beklentileri ve sektörel analiz.",
    tags: ["borsa", "ekonomi"],
    author: "SteveAnalizAI",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Dolar Kuru Tahmini",
    slug: "dolar-kuru-1",
    summary: "Dolar/TL kuru için projeksiyonlar.",
    tags: ["dolar", "ekonomi"],
    author: "SteveAnalizAI",
    createdAt: new Date().toISOString()
  }
];

export default function Blog() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const tagParam = searchParams.get("tag") || undefined;

  const { data: blogPosts, isLoading: isLoadingPosts } = useListBlogPosts(
    { tag: tagParam },
    { query: { queryKey: getListBlogPostsQueryKey({ tag: tagParam }) } }
  );
  const { data: blogStats, isLoading: isLoadingStats } = useGetBlogStats();

  // Güvenli dizi
  const safePosts = Array.isArray(blogPosts) && blogPosts.length > 0 ? blogPosts : MOCK_BLOGS;

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight">Blog & Analizler</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Steve Analiz.web'in finansal analiz, kripto, makro ekonomi ve yatırım stratejileri üzerine yazılmış blog ve analizlerini buradan takip edebilirsin.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b border-border pb-2">Konular</h3>
            {isLoadingStats ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Link href="/blog">
                  <Badge variant={!tagParam ? "default" : "outline"} className="cursor-pointer">
                    Tümü
                  </Badge>
                </Link>
                {Object.entries(blogStats?.tagCounts || {}).map(([tag]) => (
                  <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                    <Badge variant={tagParam === tag ? "default" : "outline"} className="cursor-pointer">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>
        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoadingPosts ? (
              Array.from({ length: 4 }).map((_, i) => (
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
              safePosts.map((post) => (
                <Card key={post.id} className="flex flex-col h-full bg-card hover:border-primary/40 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {post.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>{format(new Date(post.createdAt), "d MMM yyyy", { locale: tr })}</span>
                      <span>•</span>
                      <span className="font-medium text-foreground/80">{post.author}</span>
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
        </div>
      </div>
    </div>
  );
}
