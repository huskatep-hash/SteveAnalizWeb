import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, LineChart, MessageSquare, Search, Zap, ShieldCheck } from "lucide-react";

export default function SteveAnalizAI() {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero */}
      <section className="py-12 flex flex-col items-center text-center space-y-6">
        <Badge variant="outline" className="px-3 py-1 text-sm border-primary/50 text-primary uppercase tracking-widest">
          <Sparkles className="h-3 w-3 mr-2" /> Yapay Zeka Destekli
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase max-w-4xl leading-tight">
          <span className="text-primary">SteveAnalizAI</span> ile Finansal Zekayı Yeniden Tanımlayın
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Üretken yapay zeka, makine öğrenimi ve gerçek zamanlı veri analizi tek bir motorda. Piyasaları sorun, içgörü alın, daha hızlı karar verin.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button size="lg" className="text-base h-12 px-8" disabled>
            <Sparkles className="h-5 w-5 mr-2" />
            Beta'ya Erken Erişim Yakında
          </Button>
        </div>
      </section>

      {/* Core Features */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: Brain,
            title: "Akıllı Piyasa Yorumları",
            desc: "Gerçek zamanlı haber, bilanço ve teknik veriyi sentezleyerek anlamlı yorumlar üretir.",
          },
          {
            icon: LineChart,
            title: "Tahminsel Modeller",
            desc: "Geçmiş veri ve momentum analizleriyle olasılıksal senaryo modelleri sunar.",
          },
          {
            icon: MessageSquare,
            title: "Doğal Dil Sorgulama",
            desc: "'BIST100 bu hafta neden düştü?' gibi sorularınıza Türkçe, anlaşılır cevaplar.",
          },
          {
            icon: Search,
            title: "S.A.M Steve Arama Modülü",
            desc: "Şirket, sektör veya tema bazlı derinlemesine arama ve karşılaştırmalı analiz.",
          },
          {
            icon: Zap,
            title: "Gerçek Zamanlı Uyarılar",
            desc: "Fiyat hareketleri, haber akışları ve teknik formasyonlar için kişisel bildirimler.",
          },
          {
            icon: ShieldCheck,
            title: "Şeffaf Kaynak Atıfları",
            desc: "Her cevap kaynak gösterimi ile sunulur. Yatırım kararı sizin, içgörü bizim.",
          },
        ].map((f) => (
          <Card key={f.title} className="hover:border-primary/40 transition-colors">
            <CardHeader>
              <f.icon className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-xl">{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* How it works */}
      <section className="space-y-8">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight uppercase">Nasıl Çalışır?</h2>
          <p className="text-muted-foreground">Üç adımda finansal kararlarınıza yapay zeka gücü.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Sorun", desc: "İlgilendiğiniz şirket, sektör veya makro konuyu doğal dilde yazın." },
            { step: "02", title: "Analiz Edin", desc: "AI, güncel veriyi tarayıp çok kaynaklı bir özet ve yorum üretir." },
            { step: "03", title: "Karar Verin", desc: "Olasılıkları, riskleri ve fırsatları görerek bilinçli aksiyon alın." },
          ].map((s) => (
            <Card key={s.step} className="text-center">
              <CardHeader>
                <div className="text-5xl font-black text-primary/30 mb-2">{s.step}</div>
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{s.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Demo placeholder / chat preview */}
      <section className="bg-card/50 rounded-2xl border border-border p-8 md:p-12 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">SteveAnalizAI</h3>
            <p className="text-sm text-muted-foreground">Önizleme · Demo yanıtları</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
              BIST100 için bu hafta öne çıkan sektörler hangileri?
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] space-y-2">
              <p className="text-sm leading-relaxed">
                Bu hafta BIST100'de <span className="text-primary font-medium">savunma sanayi</span>, <span className="text-primary font-medium">enerji</span> ve <span className="text-primary font-medium">bankacılık</span> sektörleri öne çıktı. Aselsan ve THY haftayı pozitif kapatırken, perakende sektörü baskı altında kaldı.
              </p>
              <p className="text-xs text-muted-foreground italic">— Demo amaçlı örnek yanıt</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="SteveAnalizAI'a sorunuzu yazın... (yakında aktif)"
              className="flex-1 bg-background border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              disabled
            />
            <Button disabled>
              <Sparkles className="h-4 w-4 mr-2" />
              Sor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
