import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Plus, Star, Eye } from "lucide-react";
import { useState } from "react";

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  market: string;
}

const defaultWatchlist: WatchlistItem[] = [
  { symbol: "BIST100", name: "Borsa İstanbul 100", price: 9847.32, change: 124.5, changePercent: 1.28, market: "BIST" },
  { symbol: "USDTRY", name: "Dolar / Türk Lirası", price: 38.42, change: -0.18, changePercent: -0.47, market: "FX" },
  { symbol: "EURTRY", name: "Euro / Türk Lirası", price: 41.85, change: 0.22, changePercent: 0.53, market: "FX" },
  { symbol: "BTCUSD", name: "Bitcoin", price: 94250, change: 1820, changePercent: 1.97, market: "Kripto" },
  { symbol: "ETHUSD", name: "Ethereum", price: 3245, change: -45, changePercent: -1.37, market: "Kripto" },
  { symbol: "ASELS", name: "Aselsan", price: 78.9, change: 1.45, changePercent: 1.87, market: "BIST" },
  { symbol: "THYAO", name: "Türk Hava Yolları", price: 312.5, change: 4.2, changePercent: 1.36, market: "BIST" },
  { symbol: "GOLD", name: "Ons Altın", price: 2645, change: 12.5, changePercent: 0.47, market: "Emtia" },
];

export default function Watchlist() {
  const [filter, setFilter] = useState("");
  const [activeMarket, setActiveMarket] = useState<string>("Tümü");

  const markets = ["Tümü", "BIST", "FX", "Kripto", "Emtia"];
  const filtered = defaultWatchlist.filter((item) => {
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
          BIST, döviz, kripto ve emtia piyasalarında ilgilendiğiniz enstrümanları tek ekranda izleyin. Yapay zeka destekli uyarılar yakında.
        </p>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="flex flex-wrap gap-2">
            {markets.map((m) => (
              <Button
                key={m}
                variant={activeMarket === m ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveMarket(m)}
              >
                {m}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 max-w-md w-full">
            <Input
              placeholder="Sembol veya isim ara..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

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
                      <div className="text-2xl font-bold tabular-nums">
                        {item.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium mt-1 ${isUp ? "text-primary" : "text-destructive"}`}>
                        {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {isUp ? "+" : ""}{item.change.toFixed(2)} ({isUp ? "+" : ""}{item.changePercent.toFixed(2)}%)
                      </div>
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

        {filtered.length === 0 && (
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
