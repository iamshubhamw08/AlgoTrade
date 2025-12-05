// Fix for 'erasableSyntaxOnly': Use const assertion instead of enum
export const SignalType = {
  BUY: 'BUY',
  SELL: 'SELL',
  HOLD: 'HOLD'
} as const;

export type SignalType = typeof SignalType[keyof typeof SignalType];

export interface StockNews {
  title: string;
  source: string;
  time: string;
  url: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export interface Fundamentals {
  peRatio: string;
  pbRatio: string;
  marketCap: string;
  sector: string;
  dayRange: string;
  dividendYield: string;
  eps: string;
  about: string;
  ceo: string;
  founded: string;
  headquarters: string;
}

export interface PredictionData {
  predictionScore: number;
  confidence: number;
  signal: SignalType;
  currentPrice: number;
  target15Days: number;
  target2Months: number;
  strategyDescription: string;
  technicalFactors: string[];
  buyZone: string;
  sellZone: string;
  stopLoss: string;
}

export interface ChartPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  rsi: number;
  wickRange: [number, number];
  bodyRange: [number, number];
  color: string;
}

export interface ModelPerformance {
  accuracy: number;
  backtestPeriod: string;
  totalTrades: number;
  winningTrades: number;
  profitFactor: number;
  maxDrawdown: number;
  avgReturn: number;
  isSimulated: boolean;
}

export interface StockAnalysisResult {
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  lastUpdated: string;
  fundamentals: Fundamentals;
  news: StockNews[];
  prediction: PredictionData;
  chartData: ChartPoint[]; 
  performance: ModelPerformance;
}

export interface SearchState {
  query: string;
  loading: boolean;
  error: string | null;
  data: StockAnalysisResult | null;
}

// --- TRADING ENGINE TYPES ---

export interface PortfolioItem {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  type: 'MANUAL' | 'AUTO';
  entryDate: string;
}

export interface Transaction {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
  date: string;
  executionType: 'MANUAL' | 'AUTO';
  status: 'EXECUTED' | 'PENDING';
}

export interface UserProfile {
  cashBalance: number;
  startBalance: number;
  portfolioValue: number;
  totalNetWorth: number;
  isAutoTradingEnabled: boolean;
}