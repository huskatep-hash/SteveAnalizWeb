import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const DEFAULT_SYMBOLS = [
  { symbol: "BIST100", name: "Borsa İstanbul 100", type: "BIST", yahooSymbol: "XU100.IS" },
  { symbol: "USDTRY", name: "Dolar / Türk Lirası", type: "FX", yahooSymbol: "USDTRY=X" },
  { symbol: "EURTRY", name: "Euro / Türk Lirası", type: "FX", yahooSymbol: "EURTRY=X" },
  { symbol: "BTCUSD", name: "Bitcoin", type: "Kripto", yahooSymbol: "BTC-USD" },
  { symbol: "ETHUSD", name: "Ethereum", type: "Kripto", yahooSymbol: "ETH-USD" },
  { symbol: "ASELS", name: "Aselsan", type: "BIST", yahooSymbol: "ASELS.IS" },
  { symbol: "THYAO", name: "Türk Hava Yolları", type: "BIST", yahooSymbol: "THYAO.IS" },
  { symbol: "ALTIN", name: "Ons Altın", type: "Emtia", yahooSymbol: "GC=F" },
];

let cache: { data: any; time: number } | null = null;
const CACHE_MS = 60000;

async function fetchYahooPrice(yahooSymbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=2d`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Yahoo fetch failed: ${yahooSymbol}`);
  const json = await res.json() as any;
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error(`No meta for ${yahooSymbol}`);
  const price = meta.regularMarketPrice ?? 0;
  const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const change = price - prevClose;
  const changePercent = prevClose ? (change / prevClose) * 100 : 0;
  const name = meta.longName ?? meta.shortName ?? yahooSymbol;
  const type = meta.instrumentType ?? meta.quoteType ?? "Diğer";
  return { price, change, changePercent, name, type };
}

// Varsayılan semboller
router.get("/market", async (req: Request, res: Response) => {
  try {
    if (cache && Date.now() - cache.time < CACHE_MS) {
      return res.json(cache.data);
    }
    const results = await Promise.allSettled(
      DEFAULT_SYMBOLS.map(async (s) => {
        const data = await fetchYahooPrice(s.yahooSymbol);
        return { symbol: s.symbol, name: s.name, type: s.type, price: data.price, change: data.change, changePercent: data.changePercent, updatedAt: new Date().toISOString() };
      })
    );
    const data = results.map((r, i) => {
      if (r.status === "fulfilled") return r.value;
      return { symbol: DEFAULT_SYMBOLS[i].symbol, name: DEFAULT_SYMBOLS[i].name, type: DEFAULT_SYMBOLS[i].type, price: 0, change: 0, changePercent: 0, updatedAt: new Date().toISOString(), error: true };
    });
    cache = { data, time: Date.now() };
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Piyasa verisi alınamadı." });
  }
});

// Sembol ara
router.get("/market/search", async (req: Request, res: Response) => {
  const q = req.query.q as string;
  if (!q || q.length < 1) return res.status(400).json({ error: "Arama terimi gerekli." });
  try {
    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0&listsCount=0`;
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const json = await r.json() as any;
    const quotes = (json?.quotes ?? []).map((q: any) => ({
      symbol: q.symbol,
      name: q.longname ?? q.shortname ?? q.symbol,
      type: q.quoteType ?? "Diğer",
      exchange: q.exchange ?? "",
    }));
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: "Arama başarısız." });
  }
});

// Belirli sembol fiyatı
router.get("/market/quote/:symbol", async (req: Request, res: Response) => {
  const { symbol } = req.params;
  try {
    const data = a

cat > /home/runner/workspace/artifacts/steve-analiz/src/pages/Watchlist.tsx << 'EOF'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Plus, Star, Eye, RefreshCw, Search, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: string;
  error?: boolean;
}

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

export default function Watchlist() {
  const [filter, setFilter] = useState("");
  const [activeMarket, setActiveMarket] = useState("Tümü");
  const [marketData, setMarketData] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [myList, setMyList] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("watchlist") ?? "[]"); } catch { return []; }
  });
  const [myListData, setMyListData] = useState<MarketItem[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");

  const markets = ["Tümü", "BIST", "FX", "Kripto", "Emtia"];

  async function fetchMarket() {
    setLoading(true);
    try {
      const res = await fetch("/api/market");
      const data = await res.json();
      setMarketData(data);
      setLastUpdate(new Date().toLocaleTimeString("tr-TR"));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function fetchMyList(symbols: string[]) {
    if (!symbols.length) { setMyListData([]); return; }
    const results = await Promise.allSettled(
      symbols.map(async (s) => {
        const res = await fetch(`/api/market/quote/${s}`);
        return await res.json();
      })
    );
    setMyListData(results.filter(r => r.status === "fulfilled").map((r: any) => r.value));
  }

  const searchSymbols = useCallback(async (q: string) => {
    if (!q || q.length < 1) { setSearchResults([]); return; }
    setSearching(t
cat > /home/runner/workspace/artifacts/steve-analiz/src/pages/Watchlist.tsx << 'EOF'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Plus, Star, Eye, RefreshCw, Search, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: string;
  error?: boolean;
}

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

export default function Watchlist() {
  const [filter, setFilter] = useState("");
  const [activeMarket, setActiveMarket] = useState("Tümü");
  const [marketData, setMarketData] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [myList, setMyList] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("watchlist") ?? "[]"); } catch { return []; }
  });
  const [myListData, setMyListData] = useState<MarketItem[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");

  const markets = ["Tümü", "BIST", "FX", "Kripto", "Emtia"];

  async function fetchMarket() {
    setLoading(true);
    try {
      const res = await fetch("/api/market");
      const data = await res.json();
      setMarketData(data);
      setLastUpdate(new Date().toLocaleTimeString("tr-TR"));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function fetchMyList(symbols: string[]) {
    if (!symbols.length) { setMyListData([]); return; }
    const results = await Promise.allSettled(
      symbols.map(async (s) => {
        const res = await fetch(`/api/market/quote/${s}`);
        return await res.json();
      })
    );
    setMyListData(results.filter(r => r.status === "fulfilled").map((r: any) => r.value));
  }

  const searchSymbols = useCallback(async (q: string) => {
    if (!q || q.length < 1) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/market/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (e) { console.error(e); }
    finally { setSearching(false); }
  }, []);

  useEffect(() => {
    fetchMarket();
    const interval = setInterval(fetchMarket, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchMyList(myList);
  }, [myList]);

  useEffect(() => {
    const t = setTimeout(() => searchSymbols(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery, searchSymbols]);

  function toggleMyList(symbol: string) {
    const updated = myList.includes(symbol)
      ? myList.filter(s => s !== symbol)
      : [...myList, symbol];
    setMyList(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  }

  const filtered = marketData.filter((item) => {
    const matchesMarket = activeMarket === "Tümü" || item.type === activeMarket;
    const matchesText = filter === "" || item.symbol.toLowerCase().includes(filter.toLowerCase()) || item.name.toLowerCase().includes(filter.toLowerCase());
    return matchesMarket && matchesText;
  });

  function MarketCard({ item }: { item: MarketItem }) {
    const isUp = item.change >= 0;
    const inMyList = myList.includes(item.symbol);
    return (
      <Card className="hover:border-primary/40 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-mono text-lg">{item.symbol}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{item.name}</p>
            </div>
            <Badge variant="secondary" className="text-xs">{item.type}</Badge>
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
            <Button variant="ghost" size="icon" onClick={() => toggleMyList(item.symbol)}
              className={inMyList ? "text-yellow-500" : "text-muted-foreground hover:text-primary"}>
              <Star className="h-4 w-4" fill={inMyList ? "currentColor" : "none"} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-4 max-w-3xl">
        <Badge variant="outline" className="px-3 py-1 text-sm border-primary/50 text-primary uppercase tracking-widest">
          <Eye className="h-3 w-3 mr-2" /> İzleme Listesi
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase">
          Piyasaları <span className="text-primary">Anlık</span> Takip Edin
        </h1>
        {lastUpdate && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <RefreshCw className="h-3 w-3" /> Son güncelleme: {lastUpdate}
          </p>
        )}
      </section>

      {/* Sembol Ara */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Sembol Ara</h2>
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="AAPL, QQQM, BTC-USD, THYAO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1" onClick={() => { setSearchQuery(""); setSearchResults([]); }}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {searching && <p className="text-sm text-muted-foreground">Aranıyor...</p>}
        {searchResults.length > 0 && (
          <div className="border border-border rounded-xl overflow-hidden">
            {searchResults.map((r) => (
              <div key={r.symbol} className="flex justify-between items-center p-3 hover:bg-muted/50 border-b border-border/40 last:border-0">
                <div>
                  <span className="font-mono font-bold">{r.symbol}</span>
                  <span className="text-sm text-muted-foreground ml-2">{r.name}</span>
                  <Badge variant="outline" className="ml-2 text-xs">{r.exchange}</Badge>
                </div>
                <Button size="sm" variant={myList.includes(r.symbol) ? "default" : "outline"} onClick={() => toggleMyList(r.symbol)}>
                  {myList.includes(r.symbol) ? <><Star className="h-3 w-3 mr-1" fill="currentColor" /> Listede</> : <><Plus className="h-3 w-3 mr-1" /> Ekle</>}
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tab: Tüm Piyasalar / Listem */}
      <section className="space-y-6">
        <div className="flex gap-2 border-b border-border pb-2">
          <Button variant={activeTab === "all" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("all")}>Tüm Piyasalar</Button>
          <Button variant={activeTab === "mine" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("mine")}>
            <Star className="h-3 w-3 mr-1" /> Listem {myList.length > 0 && `(${myList.length})`}
          </Button>
        </div>

        {activeTab === "all" && (
          <>
            <div className="flex flex-wrap gap-2">
              {markets.map((m) => (
                <Button key={m} variant={activeMarket === m ? "default" : "outline"} size="sm" onClick={() => setActiveMarket(m)}>{m}</Button>
              ))}
              <Button variant="outline" size="sm" onClick={fetchMarket}><RefreshCw className="h-3 w-3 mr-1" /> Yenile</Button>
            </div>
            {loading ? (
              <div className="text-center py-16"><RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" /><p className="text-muted-foreground">Yükleniyor...</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item) => <MarketCard key={item.symbol} item={item} />)}
              </div>
            )}
          </>
        )}

        {activeTab === "mine" && (
          <>
            {myList.length === 0 ? (
              <div className="text-center py-16 border border-border/40 rounded-xl text-muted-foreground">
                <Star className="h-8 w-8 mx-auto mb-4 opacity-30" />
                <p>Listeniz boş. Sembol arayarak ekleyin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myListData.map((item) => <MarketCard key={item.symbol} item={item} />)}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
