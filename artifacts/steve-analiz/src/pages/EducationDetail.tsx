import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const MOCK_CONTENT: Record<string, any> = {
  "temel-finans-1": {
    id: 1,
    title: "Temel Finans Eğitimi",
    summary: "Finansal okuryazarlığın temelleri.",
    content: "<p>Bu eğitimde finansal kavramlar, bütçe yönetimi ve temel yatırım araçları hakkında bilgi edineceksiniz.</p>",
    type: "education",
    order: 1
  },
  "teknik-analiz-1": {
    id: 2,
    title: "İleri Teknik Analiz",
    summary: "Teknik analiz araçları ve stratejileri.",
    content: "<p>Teknik analiz, fiyat grafikleri ve indikatörler kullanarak piyasa hareketlerini tahmin etme yöntemidir.</p>",
    type: "education",
    order: 2
  },
  "kripto-temel-1": {
    id: 3,
    title: "Kripto Para Temelleri",
    summary: "Blockchain ve kripto paralara giriş.",
    content: "<p>Blockchain teknolojisinin çalışma prensiplerini ve güvenli yatırım stratejilerini keşfedin.</p>",
    type: "education",
    order: 3
  }
};

export default function EducationDetail() {
  const { slug } = useParams<{ slug: string }>();
  const item = MOCK_CONTENT[slug || ""];

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Ders Bulunamadı</h2>
        <Link href="/education"><Button>Eğitime Dön</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-700 pb-20">
      <Link href="/education">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Eğitime Dön
        </Button>
      </Link>
      <header className="space-y-6 mb-12">
        <Badge variant="outline" className="text-xs border-primary/30 text-primary">{item.type}</Badge>
        <h1 className="text-4xl font-extrabold">{item.title}</h1>
        <p className="text-lg text-muted-foreground">{item.summary}</p>
      </header>
      <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: item.content }} />
    </div>
  );
}
