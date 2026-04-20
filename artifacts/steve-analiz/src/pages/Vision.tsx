import { Card, CardContent } from "@/components/ui/card";

export default function Vision() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-700">
      <section className="space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Vizyonumuz</h1>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
      </section>

      <section className="bg-card border border-border/50 rounded-xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
        
        <blockquote className="relative z-10 space-y-6">
          <p className="text-xl md:text-2xl leading-relaxed text-foreground font-serif italic">
            "STEVE ANALİZ.WEB 2.0, genç yatırımcıların, yazanların ve analiz sevenlerin bir araya geldiği bir bilgi ve fikir paylaşımı platformudur. Yapay zeka destekli araçlarla finansal verileri inceleyerek analizler üretir, bu sayede daha erişilebilir bir finansal okuryazarlık ortamı oluşturmayı hedefler. Geleceğin Vizyonerleri adı altında finans, teknoloji ve yatırım alanlarında genç yazarların içeriklerini paylaşmasına destek olur."
          </p>
          <footer className="text-right text-primary font-medium text-lg">
            — Devrim Çağlayan, SteveAnaliz.web
          </footer>
        </blockquote>
      </section>

      <section className="space-y-10">
        <h2 className="text-3xl font-bold tracking-tight text-center">Evrimsel Yol Haritası</h2>
        
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/50 before:to-transparent">
          
          {/* Phase 1 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <span className="text-primary-foreground font-bold text-sm">1</span>
            </div>
            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-card/80 border-primary/40 shadow-lg shadow-primary/5">
              <CardContent className="p-6">
                <div className="text-sm text-primary font-bold mb-1 tracking-wider uppercase">Faz 1</div>
                <h3 className="text-xl font-bold mb-2">Replit MVP</h3>
                <p className="text-muted-foreground">Temel altyapının kurulması, UI/UX tasarımının Web 2.0 standartlarında hayata geçirilmesi ve ilk içeriklerin yayınlanması.</p>
              </CardContent>
            </Card>
          </div>

          {/* Phase 2 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:border-primary/50 transition-colors">
              <span className="font-bold text-sm">2</span>
            </div>
            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-card/40 border-border/50 group-hover:border-border transition-colors">
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground font-bold mb-1 tracking-wider uppercase">Faz 2</div>
                <h3 className="text-xl font-bold mb-2">Dify Entegrasyonu</h3>
                <p className="text-muted-foreground">Yapay zeka destekli blog oluşturma, otomatik piyasa veri analizi ve AI özetlemelerinin entegre edilmesi.</p>
              </CardContent>
            </Card>
          </div>

          {/* Phase 3 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:border-primary/50 transition-colors">
              <span className="font-bold text-sm">3</span>
            </div>
            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-card/40 border-border/50 group-hover:border-border transition-colors">
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground font-bold mb-1 tracking-wider uppercase">Faz 3</div>
                <h3 className="text-xl font-bold mb-2">VPS / CDN Taşıma</h3>
                <p className="text-muted-foreground">Artan trafik ve veri hacmini karşılamak için bağımsız sunuculara geçiş ve global CDN konumlandırması.</p>
              </CardContent>
            </Card>
          </div>

          {/* Phase 4 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:border-primary/50 transition-colors">
              <span className="font-bold text-sm">4</span>
            </div>
            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-card/40 border-border/50 group-hover:border-border transition-colors">
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground font-bold mb-1 tracking-wider uppercase">Faz 4</div>
                <h3 className="text-xl font-bold mb-2">Global AI Dashboard</h3>
                <p className="text-muted-foreground">Kullanıcıların kendi portföylerini yönetebileceği, kişiselleştirilmiş AI asistanına sahip global finansal terminal.</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>
    </div>
  );
}
