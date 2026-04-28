import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

const MOCK_EDUCATION = [
  { id: 1, title: "Temel Finans Eğitimi", slug: "temel-finans-1", summary: "Finansal okuryazarlığın temelleri.", type: "education", order: 1, createdAt: new Date().toISOString() },
  { id: 2, title: "İleri Teknik Analiz", slug: "teknik-analiz-1", summary: "Teknik analiz araçları ve stratejileri.", type: "education", order: 2, createdAt: new Date().toISOString() },
  { id: 3, title: "Kripto Para Temelleri", slug: "kripto-temel-1", summary: "Blockchain ve kripto paralara giriş.", type: "education", order: 3, createdAt: new Date().toISOString() }
];

export default function Education() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <section className="py-12 border-b border-border/40">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <BookOpen className="mr-2 h-4 w-4" /> Eğitim Platformu
          </div>
          <h1 className="text-4xl font-extrabold">Sistematik Finansal Öğrenim</h1>
          <p className="text-xl text-muted-foreground">Finansal analiz, kripto ve yatırım alanlarında yapılandırılmış eğitim içerikleri.</p>
        </div>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_EDUCATION.map(item => (
          <Card key={item.id} className="flex flex-col h-full bg-card hover:border-primary/40 transition-colors group">
            <CardHeader>
              <div className="flex justify-between items-start mb-3">
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">{item.type}</Badge>
                <span className="text-xs text-muted-foreground">Bölüm {item.order}</span>
              </div>
              <CardTitle className="line-clamp-2 group-hover:text-primary">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground line-clamp-3 text-sm">{item.summary}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/education/${item.slug}`} className="w-full">
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                  Derse Git <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
