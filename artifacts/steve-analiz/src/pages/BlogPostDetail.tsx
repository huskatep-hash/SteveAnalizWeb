import { useParams, Link } from "wouter";
import { useGetBlogPost, getGetBlogPostQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, isError } = useGetBlogPost(slug || "", {
    query: { 
      enabled: !!slug, 
      queryKey: getGetBlogPostQueryKey(slug || "") 
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in pt-8">
        <Skeleton className="h-10 w-24" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-4/5" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-4 pt-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Analiz Bulunamadı</h2>
        <p className="text-muted-foreground mb-8">Aradığınız analiz mevcut değil veya kaldırılmış olabilir.</p>
        <Link href="/blog">
          <Button>Blog'a Dön</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <Link href="/blog">
        <Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Blog'a Dön
        </Button>
      </Link>

      <header className="space-y-6 mb-12 border-b border-border/40 pb-10">
        <div className="flex gap-2 flex-wrap">
          {post.tags?.map((tag) => (
            <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
              <Badge variant="secondary" className="hover:bg-primary/20 cursor-pointer">
                {tag}
              </Badge>
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

      <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:text-foreground prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-pre:bg-card prose-pre:border prose-pre:border-border">
        {/* In a real app we might use a markdown renderer like react-markdown. 
            Here we dangerously set inner HTML since content might be HTML from a CMS,
            or just render it as text if it's plain text. We will assume simple text with line breaks for now. */}
        <div 
          dangerouslySetInnerHTML={{ 
            __html: post.content.replace(/\n/g, '<br />') 
          }} 
        />
      </div>
    </article>
  );
}
