import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Plus, Star, Eye, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  market: string;
  updatedAt?: string;
  error?: boolean;
}

export default function Watchlist() {
  const [filter, setFilter] = useState("");
  const [activeMarket, setActiveMarket] = useState<string>("Tümü");
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const markets = ["Tümü", "BIST", "FX", "Kripto", "Emtia"];

  async function fetchMarket() {
    setLoading(true);
    try {
      const res = await fetch("/api/market");
      const data = await res.json();
      setWatchlist(data.map((d: any) => ({
        symbol: d.symbol,
        name: d.name,
        price: d.price,
        change: d.change,
        changePercent: d.changePercent,
        market: d.type,
        error: d.error,
      })));
      setLastUpdate(new Date().toLocaleTimeString("tr-TR"));
    } catch (e) {
      console.error("Market fetch error:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMarket();
    const interval = setInterval(fetchMarket, 60000);
    return () => clearInterval(interval);
  }, []);

  const filtered = watchlist.filter((item) => {
    const matchesMarket = activeMarket === "Tümü" || item.market === activeMarket;
    const matchesText =
      filter === "" ||
      item.symbol.toLowerCase().includes(filter.toLowerCase()) ||
      item.name.toLowerCase().includes(filter.toLowerCase());
    return matchesMarket && matchesText;
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-4 max-w-3xl">
        <Badge variant="outline" className="px-3 py-1 text-sm border-primary/50 text-primary uppercase tracking-widest">
          <Eye className="h-3 w-3 mr-2" /> İzleme Listesi
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase">
          Piyasaları <span className="text-primary">Anlık</span> Takip Edin
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          BIST, döviz, kripto ve emtia piyasalarında ilgilendiğiniz enstrümanları tek ekranda izleyin.
        </p>
        {lastUpdate && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <RefreshCw className="h-3 w-3" /> Son güncelleme: {lastUpdate} — Her 1 dakikada otomatik yenilenir
          </p>
        )}
      </section>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="flex flex-wrap gap-2">
            {markets.map((m) => (
              <Button key={m} variant={activeMarket === m ? "default" : "outline"} size="sm" onClick={() => setActiveMarket(m)}>
                {m}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 max-w-md w-full">
            <Input placeholder="Sembol veya isim ara..." value={filter} onChange={(e) => setFilter(e.target.value)} />
            <Button variant="outline" size="icon" onClick={fetchMarket}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            Piyasa verileri yükleniyor...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => {
              const isUp = item.change >= 0;
              return (
                <Card key={item.symbol} className="hover:border-primary/40 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-mono text-lg">{item.symbol}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{item.name}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">{item.market}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-end">
                      <div>
                        {item.error ? (
                          <div className="text-sm text-muted-foreground">Veri alınamadı</div>
                        ) : (
                          <>
                            <div className="text-2xl font-bold tabular-nums">
                              {item.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-medium mt-1 ${isUp ? "text-primary" : "text-destructive"}`}>
                              {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                              {isUp ? "+" : ""}{item.change.toFixed(2)} ({isUp ? "+" : ""}{item.changePercent.toFixed(2)}%)
                            </div>
                          </>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground border border-border/40 rounded-xl">
            Aramanıza uygun sembol bulunamadı.
          </div>
        )}
      </section>

      <section className="bg-primary/5 rounded-2xl p-8 md:p-12 border border-primary/20 text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">Kişisel İzleme Listenizi Oluşturun</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Yakında: Üyelik ile sınırsız sembol ekleyin, fiyat alarmları kurun ve SteveAnalizAI'dan kişisel piyasa özetleri alın.
        </p>
      </section>
    </div>
  );
}
