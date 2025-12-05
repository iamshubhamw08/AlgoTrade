import React from 'react';
import { X, Server, Globe, BrainCircuit, Database, LineChart, ShieldCheck } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">System Architecture & Logic</h2>
              <p className="text-sm text-slate-400">Technical breakdown of how predictions are generated</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto p-6 space-y-8">
          
          {/* 1. The Pipeline Visual */}
          <div className="relative">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Data Pipeline Flow</h3>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-green-500/30 via-indigo-500/30 to-yellow-500/30 -z-10 transform -translate-y-1/2"></div>

              {/* Step 1 */}
              <div className="bg-slate-800 p-4 rounded-xl border border-green-500/30 w-full md:w-1/4 relative group">
                <div className="absolute -top-3 left-4 bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/20">REAL-TIME</div>
                <div className="flex flex-col items-center text-center">
                  <Globe className="w-8 h-8 text-green-400 mb-3" />
                  <h4 className="font-bold text-white mb-1">1. Live Retrieval</h4>
                  <p className="text-xs text-slate-400">Google Search Grounding fetches Current Price, News, 52-Week High/Low, and PE Ratio.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-800 p-4 rounded-xl border border-indigo-500/30 w-full md:w-1/4 relative">
                 <div className="absolute -top-3 left-4 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-500/20">INFERENCE</div>
                 <div className="flex flex-col items-center text-center">
                  <BrainCircuit className="w-8 h-8 text-indigo-400 mb-3" />
                  <h4 className="font-bold text-white mb-1">2. AI Reasoning</h4>
                  <p className="text-xs text-slate-400">Gemini 2.5 analyzes trend context (e.g. "Near 52-week low") + Sentiment to predict direction.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-800 p-4 rounded-xl border border-yellow-500/30 w-full md:w-1/4 relative">
                 <div className="absolute -top-3 left-4 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-500/20">SIMULATED</div>
                 <div className="flex flex-col items-center text-center">
                  <LineChart className="w-8 h-8 text-yellow-400 mb-3" />
                  <h4 className="font-bold text-white mb-1">3. Charting</h4>
                  <p className="text-xs text-slate-400">OHLC Chart data is simulated mathematically to match the real trend direction for visualization.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Technical Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
               <div className="flex items-center gap-2 mb-3">
                 <Database className="w-5 h-5 text-indigo-400" />
                 <h3 className="font-bold text-white">How much data is used?</h3>
               </div>
               <p className="text-sm text-slate-300 leading-relaxed mb-3">
                 We do not stream 10 years of raw CSV data (approx 3,600 rows) into the AI model because LLMs have token limits and are poor at raw math.
               </p>
               <p className="text-sm text-slate-300 leading-relaxed">
                 Instead, we use a <strong>Snapshot Approach</strong>. The AI searches for summary metrics: <em>"Stock X YTD return", "52-Week Range", "Moving Averages status"</em>. This gives the model about <strong>1 Year of Trend Context</strong> without processing raw ticks.
               </p>
            </div>

            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
               <div className="flex items-center gap-2 mb-3">
                 <ShieldCheck className="w-5 h-5 text-green-400" />
                 <h3 className="font-bold text-white">What is "Real" vs "Simulated"?</h3>
               </div>
               <ul className="space-y-3">
                 <li className="flex gap-3 text-sm text-slate-300">
                   <span className="bg-green-500/20 text-green-400 font-mono px-2 py-0.5 rounded text-xs h-fit">REAL</span>
                   <span>Current Price, Company Fundamentals, News Headlines, Buy/Sell Logic, Prediction Score.</span>
                 </li>
                 <li className="flex gap-3 text-sm text-slate-300">
                   <span className="bg-yellow-500/20 text-yellow-400 font-mono px-2 py-0.5 rounded text-xs h-fit">SIM</span>
                   <span>Candlestick Charts (OHLC History), Backtest Metrics (Profit Factor, Win Rate).</span>
                 </li>
               </ul>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-800/30 text-center">
           <p className="text-xs text-slate-500">
             To achieve 100% Real functionality, a backend server (Python/Node) with a paid API subscription (e.g., Bloomberg/AlphaVantage) is required to feed raw OHLC history.
           </p>
        </div>

      </div>
    </div>
  );
};

export default ArchitectureModal;
