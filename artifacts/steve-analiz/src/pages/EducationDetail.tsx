import { useRoute, Link } from "wouter";
import { useGetEducationContent, getGetEducationContentQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, BookOpen, Layers } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function EducationDetail() {
  const [, params] = useRoute("/education/:slug");
  const slug = params?.slug || "";

  const { data: item, isLoading, isError } = useGetEducationContent(slug, {
    query: {
      enabled: !!slug,
      queryKey: getGetEducationContentQueryKey(slug)
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
        <Skeleton className="h-10 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-4">
        <h1 className="text-3xl font-bold">Ders Bulunamadı</h1>
        <p className="text-muted-foreground">Aradığınız eğitim içeriğine ulaşılamıyor veya silinmiş olabilir.</p>
        <Link href="/education">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Eğitimlere Dön
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="mb-8">
        <Link href="/education">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Eğitim Platformu
          </Button>
        </Link>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <Badge variant="outline" className="border-primary/50 text-primary">
            <Layers className="mr-1.5 h-3 w-3" /> Bölüm {item.order}
          </Badge>
          <Badge variant="secondary">
            <BookOpen className="mr-1.5 h-3 w-3" /> {item.type}
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          {item.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-border/40 py-4 mb-10">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(item.createdAt), "d MMMM yyyy", { locale: tr })}
          </div>
        </div>
      </div>

      <div className="text-xl text-muted-foreground leading-relaxed mb-10 italic border-l-4 border-primary/50 pl-6">
        {item.summary}
      </div>

      <div 
        className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:border prose-img:border-border/50"
        dangerouslySetInnerHTML={{ __html: item.content }}
      />
      
      <div className="mt-16 pt-8 border-t border-border/40 flex justify-between items-center">
        <Link href="/education">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Tüm Eğitimler
          </Button>
        </Link>
      </div>
    </article>
  );
}
