import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";

const MOCK_POSTS: Record<string, any> = {
  "bist-2026-1": {
    id: 1,
    title: "Borsa İstanbul 2026 Görüşleri",
    content: "<p>Borsa İstanbul 2026 yılına güçlü başladı. Uzmanlar, enflasyonla mücadeledeki kararlılık ve yabancı yatırımcı ilgisiyle BIST100'ün yeni zirveler görebileceğini belirtiyor.</p><p>Özellikle bankacılık ve teknoloji sektörlerinde hareketlilik bekleniyor. Yatırımcıların portföylerini çeşitlendirmesi ve sektörel rotasyonu takip etmesi öneriliyor.</p>",
    tags: ["borsa", "ekonomi"],
    author: "SteveAnalizAI",
    createdAt: new Date().toISOString()
  },
  "dolar-kuru-1": {
    id: 2,
    title: "Dolar Kuru Tahmini",
    content: "<p>Dolar/TL kuru küresel gelişmeler ve TCMB politikaları ışığında dalgalı seyretmeye devam ediyor. Uzmanlar, yılın ikinci yarısında kurda sınırlı bir yükseliş olabileceğini öngörüyor.</p><p>İhracatçı şirketler için avantajlı bir dönem olabileceği belirtilirken, ithalat maliyetlerindeki artışa dikkat çekiliyor.</p>",
    tags: ["dolar", "ekonomi"],
    author: "SteveAnalizAI",
    createdAt: new Date().toISOString()
  },
  "kripto-durum-1": {
    id: 3,
    title: "Kripto Para Piyasasında Son Durum",
    content: "<p>Bitcoin ve Ethereum başta olmak üzere kripto para piyasasında hareketlilik sürüyor. Spot ETF onayları ve kurumsal yatırımcı ilgisi piyasaya olumlu yansıyor.</p><p>Regülasyon haberleri ve makroekonomik gelişmeler kripto paraların yönünü belirlemeye devam ediyor.</p>",
    tags: ["kripto"],
    author: "SteveAnalizAI",
    createdAt: new Date().toISOString()
  }
};

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = MOCK_POSTS[slug || ""];

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Analiz Bulunamadı</h2>
        <Link href="/blog"><Button>Blog'a Dön</Button></Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto animate-in fade-in duration-700 pb-20">
      <Link href="/blog">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Blog'a Dön
        </Button>
      </Link>
      <header className="space-y-6 mb-12 border-b border-border/40 pb-10">
        <div className="flex gap-2 flex-wrap">
          {post.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <time>{new Date(post.createdAt).toLocaleDateString("tr-TR")}</time>
          </div>
        </div>
      </header>
      <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
