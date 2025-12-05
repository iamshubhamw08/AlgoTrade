import { GoogleGenAI } from "@google/genai";
// Fix for 'verbatimModuleSyntax': Use 'import type'
import type { StockAnalysisResult } from "../types";

// Generates 2 Years of mock data
const generateMockChartData = (currentPrice: number, volatility: number = 0.02) => {
  const data = [];
  let price = currentPrice * 0.7; 
  const totalDays = 730; 
  
  for (let i = 0; i < totalDays; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (totalDays - i));
    const dateStr = date.toISOString().split('T')[0]; 

    const change = price * volatility * (Math.random() - 0.48); 
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + (Math.random() * price * 0.015);
    const low = Math.min(open, close) - (Math.random() * price * 0.015);
    const rsi = 50 + (Math.sin(i / 10) * 20) + (Math.random() * 10 - 5);
    const isGreen = close >= open;

    data.push({
      date: dateStr,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 50000,
      rsi: parseFloat(rsi.toFixed(2)),
      wickRange: [parseFloat(low.toFixed(2)), parseFloat(high.toFixed(2))],
      bodyRange: [parseFloat(Math.min(open, close).toFixed(2)), parseFloat(Math.max(open, close).toFixed(2))],
      color: isGreen ? '#10b981' : '#ef4444'
    });
    price = close;
  }
  const last = data[data.length - 1];
  last.close = currentPrice;
  last.bodyRange = [Math.min(last.open, currentPrice), Math.max(last.open, currentPrice)];
  return data;
};

const generateMockPerformance = () => {
  const accuracy = 90 + Math.random() * 8; 
  const totalTrades = 120 + Math.floor(Math.random() * 50);
  const winningTrades = Math.floor(totalTrades * (accuracy / 100));
  
  return {
    accuracy: parseFloat(accuracy.toFixed(1)),
    backtestPeriod: "Last 12 Months",
    totalTrades,
    winningTrades,
    profitFactor: parseFloat((1.8 + Math.random()).toFixed(2)),
    maxDrawdown: parseFloat((5 + Math.random() * 10).toFixed(2)),
    avgReturn: parseFloat((1.2 + Math.random()).toFixed(1)),
    isSimulated: true
  };
};

export const analyzeStockWithGemini = async (symbol: string): Promise<StockAnalysisResult> => {
  // CRITICAL LOCAL FIX
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Check your .env file.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Act as a senior quantitative financial analyst. Analyze stock "${symbol}" (NSE/BSE).
    Step 1: GATHER REAL DATA via Google Search Tools (Price, News, Fundamentals).
    Step 2: AI INFERENCE (Compare Price to 52w High, Sentiment, Technicals).
    Step 3: GENERATE OUTPUT (15-day/2-month forecast, Signal).
    
    CRITICAL: Respond with VALID JSON ONLY.
    Structure:
    {
      "symbol": "string", "name": "string", "currentPrice": number, "changePercent": number, "lastUpdated": "string",
      "fundamentals": { "peRatio": "string", "pbRatio": "string", "marketCap": "string", "sector": "string", "dayRange": "string", "dividendYield": "string", "eps": "string", "about": "string", "ceo": "string", "founded": "string", "headquarters": "string" },
      "news": [{ "title": "string", "source": "string", "time": "string", "sentiment": "Positive" | "Negative" | "Neutral" }],
      "prediction": { "predictionScore": number, "confidence": number, "signal": "BUY" | "SELL" | "HOLD", "target15Days": number, "target2Months": number, "strategyDescription": "string", "technicalFactors": ["string"], "buyZone": "string", "sellZone": "string", "stopLoss": "string" }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });

    let text = response.text || "";
    text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    
    let data;
    try { data = JSON.parse(text); } catch (e) { throw new Error("Failed to parse AI response."); }

    const safeCurrentPrice = typeof data.currentPrice === 'number' ? data.currentPrice : 0;
    const newsWithUrls = Array.isArray(data.news) ? data.news.map((item: any) => ({
      ...item,
      url: `https://www.google.com/search?q=${encodeURIComponent(item.title)}`
    })) : [];

    return {
      ...data,
      currentPrice: safeCurrentPrice,
      changePercent: data.changePercent || 0,
      news: newsWithUrls,
      prediction: {
        ...data.prediction,
        target15Days: data.prediction?.target15Days || safeCurrentPrice,
        target2Months: data.prediction?.target2Months || safeCurrentPrice,
        predictionScore: data.prediction?.predictionScore || 50,
      },
      chartData: generateMockChartData(safeCurrentPrice),
      performance: generateMockPerformance()
    };
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
