import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const DEFAULT_SYMBOLS = [
  { symbol: "BIST100", name: "Borsa Istanbul 100", type: "BIST", yahooSymbol: "XU100.IS" },
  { symbol: "USDTRY", name: "Dolar / Turk Lirasi", type: "FX", yahooSymbol: "USDTRY=X" },
  { symbol: "EURTRY", name: "Euro / Turk Lirasi", type: "FX", yahooSymbol: "EURTRY=X" },
  { symbol: "BTCUSD", name: "Bitcoin", type: "Kripto", yahooSymbol: "BTC-USD" },
  { symbol: "ETHUSD", name: "Ethereum", type: "Kripto", yahooSymbol: "ETH-USD" },
  { symbol: "ASELS", name: "Aselsan", type: "BIST", yahooSymbol: "ASELS.IS" },
  { symbol: "THYAO", name: "Turk Hava Yollari", type: "BIST", yahooSymbol: "THYAO.IS" },
  { symbol: "ALTIN", name: "Ons Altin", type: "Emtia", yahooSymbol: "GC=F" },
];

let cache: { data: any; time: number } | null = null;
const CACHE_MS = 60000;

async function fetchYahooPrice(yahooSymbol: string) {
  const url = "https://query1.finance.yahoo.com/v8/finance/chart/" + yahooSymbol + "?interval=1d&range=2d";
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const json = await res.json() as any;
  const meta = json?.chart?.result?.[0]?.meta;
  const price = meta.regularMarketPrice ?? 0;
  const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const change = price - prevClose;
  const changePercent = prevClose ? (change / prevClose) * 100 : 0;
  const name = meta.longName ?? meta.shortName ?? yahooSymbol;
  const type = meta.instrumentType ?? meta.quoteType ?? "Diger";
  return { price, change, changePercent, name, type };
}

router.get("/market", async (req: Request, res: Response) => {
  try {
    if (cache && Date.now() - cache.time < CACHE_MS) return res.json(cache.data);
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
    res.status(500).json({ error: "Piyasa verisi alinamadi." });
  }
});

router.get("/market/search", async (req: Request, res: Response) => {
  const q = req.query.q as string;
  try {
    const url = "https://query1.finance.yahoo.com/v1/finance/search?q=" + encodeURIComponent(q) + "&quotesCount=8&newsCount=0&listsCount=0";
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const json = await r.json() as any;
    const quotes = (json?.quotes ?? []).map((q: any) => ({
      symbol: q.symbol,
      name: q.longname ?? q.shortname ?? q.symbol,
      type: q.quoteType ?? "Diger",
      exchange: q.exchange ?? "",
    }));
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: "Arama basarisiz." });
  }
});

router.get("/market/quote/:symbol", async (req: Request, res: Response) => {
  const { symbol } = req.params;
  try {
    const data = await fetchYahooPrice(symbol);
    res.json({ symbol, name: data.name, type: data.type, price: data.price, change: data.change, changePercent: data.changePercent, updatedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: symbol + " verisi alinamadi." });
  }
});

export default router;
