import { useParams, Link } from "wouter";
import { useGetBlogPost, getGetBlogPostQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

function SafeContent({ content }: { content: string }) {
  return (
    <div className="space-y-4">
      {content.split("\n").map((line, i) => {
        if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-foreground">{line.slice(3)}</h2>;
        if (line.startsWith("### ")) return <h3 key={i} className="text-xl font-semibold mt-6 mb-3 text-foreground">{line.slice(4)}</h3>;
        if (line.trim() === "") return <br key={i} />;
        return <p key={i} className="leading-relaxed text-foreground/90">{line}</p>;
      })}
    </div>
  );
}

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useGetBlogPost(slug || "", {
    query: { enabled: !!slug, queryKey: getGetBlogPostQueryKey(slug || "") }
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in pt-8">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Analiz Bulunamadi</h2>
        <p className="text-muted-foreground mb-8">Aradiginiz analiz mevcut degil.</p>
        <Link href="/blog"><Button>Bloga Don</Button></Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <Link href="/blog">
        <Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Bloga Don
        </Button>
      </Link>
      <header className="space-y-6 mb-12 border-b border-border/40 pb-10">
        <div className="flex gap-2 flex-wrap">
          {post.tags?.map((tag) => (
            <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
              <Badge variant="secondary" className="hover:bg-primary/20 cursor-pointer">{tag}</Badge>
            </Link>
          ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4">
          <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border border-border/50">
            <User className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">{post.author}</span>
          </div>
          <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border border-border/50">
            <Calendar className="h-4 w-4 text-primary" />
            <time dateTime={post.createdAt}>
              {format(new Date(post.createdAt), "d MMMM yyyy", { locale: tr })}
            </time>
          </div>
        </div>
      </header>
      <div className="prose prose-invert max-w-none">
        <SafeContent content={post.content} />
      </div>
      <p className="mt-12 text-xs text-muted-foreground border border-border/40 rounded-lg p-3">
        Steve Analiz, SPK lisansli bir yatirim danismani degildir. Sunulan veriler yalnizca bilgilendirme amaclidir.
      </p>
    </article>
  );
}
