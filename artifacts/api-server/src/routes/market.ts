import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const SYMBOLS = [
  { symbol: "BIST100", name: "Borsa İstanbul 100", type: "BIST", yahooSymbol: "XU100.IS" },
  { symbol: "USDTRY", name: "Dolar / Türk Lirası", type: "FX", yahooSymbol: "USDTRY=X" },
  { symbol: "EURTRY", name: "Euro / Türk Lirası", type: "FX", yahooSymbol: "EURTRY=X" },
  { symbol: "BTCUSD", name: "Bitcoin", type: "Kripto", yahooSymbol: "BTC-USD" },
  { symbol: "ETHUSD", name: "Ethereum", type: "Kripto", yahooSymbol: "ETH-USD" },
  { symbol: "ASELS", name: "Aselsan", type: "BIST", yahooSymbol: "ASELS.IS" },
  { symbol: "THYAO", name: "Türk Hava Yolları", type: "BIST", yahooSymbol: "THYAO.IS" },
  { symbol: "ALTIN", name: "Ons Altın", type: "Emtia", yahooSymbol: "GC=F" },
];

// 1 dakika cache
let cache: { data: any; time: number } | null = null;
const CACHE_MS = 60000;

async function fetchYahoo(yahooSymbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=2d`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  if (!res.ok) throw new Error(`Yahoo fetch failed: ${yahooSymbol}`);
  const json = await res.json() as any;
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error(`No meta for ${yahooSymbol}`);
  
  const price = meta.regularMarketPrice ?? 0;
  const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const change = price - prevClose;
  const changePercent = prevClose ? (change / prevClose) * 100 : 0;
  
  return { price, change, changePercent };
}

router.get("/api/market", async (req: Request, res: Response) => {
  try {
    // Cache kontrolü
    if (cache && Date.now() - cache.time < CACHE_MS) {
      return res.json(cache.data);
    }

    const results = await Promise.allSettled(
      SYMBOLS.map(async (s) => {
        const data = await fetchYahoo(s.yahooSymbol);
        return {
          symbol: s.symbol,
          name: s.name,
          type: s.type,
          price: data.price,
          change: data.change,
          changePercent: data.changePercent,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const data = results.map((r, i) => {
      if (r.status === "fulfilled") return r.value;
      // Hata durumunda sembolü döndür, fiyat 0
      return {
        symbol: SYMBOLS[i].symbol,
        name: SYMBOLS[i].name,
        type: SYMBOLS[i].type,
        price: 0,
        change: 0,
        changePercent: 0,
        updatedAt: new Date().toISOString(),
        error: true,
      };
    });

    cache = { data, time: Date.now() };
    res.json(data);
  } catch (err) {
    console.error("Market error:", err);
    res.status(500).json({ error: "Piyasa verisi alınamadı." });
  }
});

export default router;
