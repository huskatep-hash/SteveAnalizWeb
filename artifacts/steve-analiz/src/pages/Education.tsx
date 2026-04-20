import { Link } from "wouter";
import { useListEducationContent } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function Education() {
  const { data: educationItems, isLoading } = useListEducationContent();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <section className="py-12 border-b border-border/40">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
            <BookOpen className="mr-2 h-4 w-4" />
            Eğitim Platformu
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Sistematik Finansal Öğrenim
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Finansal analiz, kripto ve yatırım alanlarında yapılandırılmış eğitim içerikleri. Sıfırdan ileri seviyeye adım adım ilerleyin.
          </p>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
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
          ) : educationItems?.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
              Henüz eğitim içeriği bulunmuyor.
            </div>
          ) : (
            educationItems?.map((item) => (
              <Card key={item.id} className="flex flex-col h-full bg-card hover:border-primary/40 transition-colors group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      {item.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium">Bölüm {item.order}</span>
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(item.createdAt), "d MMMM yyyy", { locale: tr })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground line-clamp-3 text-sm">
                    {item.summary}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={`/education/${item.slug}`} className="w-full">
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      Derse Git <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
