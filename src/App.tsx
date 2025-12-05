import React, { useState } from 'react';
import Header from './components/Header';
import StockChart from './components/StockChart';
import FundamentalsCard from './components/FundamentalsCard';
import NewsPanel from './components/NewsPanel';
import PredictionCard from './components/PredictionCard';
import PerformanceMetrics from './components/PerformanceMetrics';
import TradeModal from './components/TradeModal';
import ArchitectureModal from './components/ArchitectureModal';
import TradingDashboard from './components/TradingDashboard';
import { TradingProvider, useTrading } from './context/TradingContext';
import { analyzeStockWithGemini } from './services/geminiService';
import type { SearchState } from './types';
import { Loader2, TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Database, Server, LayoutDashboard, LineChart } from 'lucide-react';

const MainApp: React.FC = () => {
  const [view, setView] = useState<'ANALYSIS' | 'TRADING'>('ANALYSIS');
  const [state, setState] = useState<SearchState>({
    query: '',
    loading: false,
    error: null,
    data: null,
  });
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const { addToWatchlist } = useTrading();

  const handleSearch = async (query: string) => {
    setView('ANALYSIS'); // Switch back to analysis view
    setState((prev) => ({ ...prev, loading: true, error: null, query }));
    
    try {
      const result = await analyzeStockWithGemini(query);
      setState({
        query,
        loading: false,
        error: null,
        data: result,
      });
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to analyze stock. Please try again or check your API Key limit.",
        data: null
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-12 flex flex-col font-sans">
      <Header onSearch={handleSearch} isLoading={state.loading} />

      {/* Navigation Tabs (Mobile/Desktop) */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-16 z-40 shadow-lg">
        <div className="container mx-auto px-4 flex gap-6">
          <button 
            onClick={() => setView('ANALYSIS')}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors ${view === 'ANALYSIS' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <LineChart className="w-4 h-4" /> Market Analysis
          </button>
          <button 
            onClick={() => setView('TRADING')}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors ${view === 'TRADING' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Trading Terminal
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 pt-6 flex-grow">
        
        {view === 'TRADING' ? (
          <TradingDashboard onNavigateSearch={() => setView('ANALYSIS')} />
        ) : (
          <>
            {/* Analysis View Content */}
            {!state.data && !state.loading && !state.error && (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <div className="bg-indigo-500/10 p-4 rounded-full mb-4">
                  <TrendingUp className="w-12 h-12 text-indigo-500" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Market Intelligence Awaits</h1>
                <p className="text-slate-400 max-w-lg mb-8">
                  Enter an NSE or BSE symbol above to generate real-time AI predictions using our ensemble of LSTM, Transformers, and Technical Indicators.
                </p>
                <button onClick={() => setView('TRADING')} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors flex items-center gap-2">
                   <LayoutDashboard className="w-4 h-4" /> Go to Trading Terminal
                </button>
              </div>
            )}

            {state.loading && (
              <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white">Analyzing Market Data...</h2>
                  <p className="text-slate-400 text-sm mt-1">Running LSTM inference • Calculating RSI/MACD • Scanning News</p>
                </div>
              </div>
            )}

            {state.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center max-w-lg mx-auto mt-10">
                <h3 className="text-red-400 font-bold mb-2">Analysis Failed</h3>
                <p className="text-slate-300 text-sm">{state.error}</p>
              </div>
            )}

            {state.data && !state.loading && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Top Bar: Name & Price */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white">{state.data.name}</h1>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="font-mono text-sm bg-slate-800 px-2 py-0.5 rounded">{state.data.symbol}</span>
                      <span className="text-xs">NSE/BSE Data via Google Search Grounding</span>
                      <button 
                        onClick={() => { addToWatchlist(state.data!.symbol); alert("Added to Watchlist"); }}
                        className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded hover:bg-indigo-500/20"
                      >
                        + Watchlist
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-mono font-bold text-white">
                      ₹{(state.data.currentPrice ?? 0).toLocaleString()}
                    </div>
                    <div className={`flex items-center justify-end gap-1 text-sm font-medium ${state.data.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {state.data.changePercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {state.data.changePercent > 0 ? '+' : ''}{state.data.changePercent}%
                    </div>
                  </div>
                </div>

                <PredictionCard 
                  prediction={state.data.prediction} 
                  stockName={state.data.name} 
                  onTradeClick={() => setIsTradeModalOpen(true)}
                />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3">
                    <StockChart data={state.data.chartData} />
                  </div>
                  <div className="lg:col-span-1">
                    <PerformanceMetrics performance={state.data.performance} />
                  </div>
                </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <NewsPanel news={state.data.news} />
                    </div>
                    <div className="lg:col-span-2">
                      <FundamentalsCard data={state.data.fundamentals} />
                    </div>
                 </div>

                <TradeModal 
                  isOpen={isTradeModalOpen} 
                  onClose={() => setIsTradeModalOpen(false)}
                  stockName={state.data.name}
                  symbol={state.data.symbol}
                  currentPrice={state.data.currentPrice}
                  signal={state.data.prediction.signal}
                />

                <ArchitectureModal 
                  isOpen={isArchModalOpen} 
                  onClose={() => setIsArchModalOpen(false)}
                />

              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900 mt-12 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4 p-2 rounded transition-colors">
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="font-mono">AI Analysis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="font-mono">Live Prices (Search)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span className="font-mono">Client-Side Engine</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-600 text-center max-w-3xl mx-auto leading-relaxed">
            Algotrade.AI is an advanced prototype. Trading functionalities simulate a broker environment using LocalStorage.
            Do not make financial decisions based solely on this tool.
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TradingProvider>
      <MainApp />
    </TradingProvider>
  );
};

export default App;