import { useState } from "react";
import { Link, useSearch } from "wouter";
import { useListBlogPosts, useGetBlogStats, getListBlogPostsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function Blog() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const tagParam = searchParams.get("tag") || undefined;

  const { data: blogPosts, isLoading: isLoadingPosts } = useListBlogPosts(
    { tag: tagParam },
    { query: { queryKey: getListBlogPostsQueryKey({ tag: tagParam }) } }
  );
  const { data: blogStats, isLoading: isLoadingStats } = useGetBlogStats();

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight">Blog & Analizler</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Steve Analiz.web'in finansal analiz, kripto, makro ekonomi ve yatırım stratejileri üzerine yazılmış blog ve analizlerini buradan takip edebilirsin.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar / Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b border-border pb-2">Konular</h3>
            {isLoadingStats ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-5/6" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Link href="/blog">
                  <Badge 
                    variant={!tagParam ? "default" : "outline"} 
                    className="cursor-pointer hover:bg-primary/80 transition-colors"
                  >
                    Tümü
                  </Badge>
                </Link>
                {Object.entries(blogStats?.tagCounts || {}).map(([tag, count]) => (
                  <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                    <Badge 
                      variant={tagParam === tag ? "default" : "outline"} 
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                    >
                      {tag} ({count})
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Blog Posts Grid */}
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
            ) : blogPosts?.length === 0 ? (
              <div className="col-span-full py-12 text-center border rounded-lg border-dashed">
                <p className="text-muted-foreground">Bu kategoride henüz analiz bulunmuyor.</p>
                {tagParam && (
                  <Link href="/blog">
                    <Button variant="link" className="mt-4">Tüm analizleri gör</Button>
                  </Link>
                )}
              </div>
            ) : (
              blogPosts?.map((post, i) => (
                <Card 
                  key={post.id} 
                  className="flex flex-col h-full bg-card hover:border-primary/40 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
                >
                  <CardHeader>
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {post.tags?.map((tag) => (
                        <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className="z-10">
                          <Badge variant="secondary" className="text-xs hover:bg-primary/20 cursor-pointer">{tag}</Badge>
                        </Link>
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
