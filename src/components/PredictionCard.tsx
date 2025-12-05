import React from 'react';
import type { PredictionData } from '../types';
import { SignalType } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus, ShieldCheck, BrainCircuit, Activity, Target, Zap } from 'lucide-react';

interface PredictionCardProps {
  prediction: PredictionData;
  stockName: string;
  onTradeClick?: () => void;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, stockName, onTradeClick }) => {
  const isBuy = prediction.signal === SignalType.BUY;
  const isSell = prediction.signal === SignalType.SELL;

  const signalColor = isBuy 
    ? 'text-green-400 bg-green-400/10 border-green-400/20' 
    : isSell 
      ? 'text-red-400 bg-red-400/10 border-red-400/20' 
      : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';

  const SignalIcon = isBuy ? ArrowUpRight : isSell ? ArrowDownRight : Minus;

  // Ensure priority order of technical factors
  const priorityOrder = ['Candlestick', 'DEMA', 'RSI', 'MACD', 'Pivot'];
  const sortedFactors = [...prediction.technicalFactors].sort((a, b) => {
    const idxA = priorityOrder.findIndex(p => a.toLowerCase().includes(p.toLowerCase()));
    const idxB = priorityOrder.findIndex(p => b.toLowerCase().includes(p.toLowerCase()));
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });

  const score = prediction.predictionScore ?? 0;
  const target15 = prediction.target15Days ?? 0;
  const target60 = prediction.target2Months ?? 0;

  return (
    <div className="rounded-xl border border-indigo-500/30 bg-slate-800/50 p-6 shadow-2xl relative overflow-hidden group">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>

      <div className="flex flex-col md:flex-row gap-6 relative z-10">
        
        {/* Left: Score & Signal */}
        <div className="flex-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-700 pb-6 md:pb-0 md:pr-6 min-w-[200px]">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">Neural Confidence Score</h3>
          
          {/* Reduced size from w-32 to w-24 to prevent clipping in view */}
          <div className="relative flex items-center justify-center w-24 h-24">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="48" cy="48" r="42" className="text-slate-700" strokeWidth="6" fill="none" stroke="currentColor" />
               <circle 
                 cx="48" cy="48" r="42" 
                 className={`${isBuy ? 'text-green-500' : isSell ? 'text-red-500' : 'text-yellow-500'}`} 
                 strokeWidth="6" 
                 fill="none" 
                 strokeDasharray={264} 
                 strokeDashoffset={264 - (264 * score) / 100}
                 strokeLinecap="round"
                 stroke="currentColor" 
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-2xl font-bold text-white">{score}</span>
               <span className="text-[9px] text-slate-400">/100</span>
             </div>
          </div>

          <div className={`mt-4 px-4 py-2 rounded-full border flex items-center gap-2 ${signalColor}`}>
            <SignalIcon className="w-5 h-5" />
            <span className="font-bold tracking-wide">{prediction.signal} SIGNAL</span>
          </div>

          {/* Trade Button */}
          <button 
            onClick={onTradeClick}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-indigo-600 text-white text-xs font-bold py-2 px-4 rounded transition-all border border-slate-600 hover:border-indigo-500"
          >
            <Zap className="w-3 h-3" />
            Place {prediction.signal !== SignalType.HOLD ? prediction.signal : 'ORDER'}
          </button>
        </div>

        {/* Right: Targets & Logic */}
        <div className="flex-[2] flex flex-col justify-between">
          <div className="mb-4">
             <div className="flex items-center gap-2 mb-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">{stockName} Forecast</h3>
             </div>
             <p className="text-slate-300 text-sm leading-relaxed">
               {prediction.strategyDescription}
             </p>
          </div>

          {/* Actionable Price Ranges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-green-500/10 border border-green-500/20 p-2 rounded-lg text-center">
              <span className="text-[10px] text-green-400 uppercase font-bold block mb-1">Buy Zone</span>
              <span className="text-sm font-mono text-white">{prediction.buyZone}</span>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 p-2 rounded-lg text-center">
              <span className="text-[10px] text-red-400 uppercase font-bold block mb-1">Sell Zone</span>
              <span className="text-sm font-mono text-white">{prediction.sellZone}</span>
            </div>
             <div className="bg-yellow-500/10 border border-yellow-500/20 p-2 rounded-lg text-center">
              <span className="text-[10px] text-yellow-400 uppercase font-bold block mb-1">Stop Loss</span>
              <span className="text-sm font-mono text-white">{prediction.stopLoss}</span>
            </div>
          </div>

          {/* Targets Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex items-center justify-between">
              <div>
                 <span className="text-xs text-slate-500 block mb-1">15-Day Target</span>
                 <div className="text-xl font-mono font-medium text-white">₹{target15.toLocaleString()}</div>
              </div>
              <Target className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block mb-1">2-Month Target</span>
                <div className="text-xl font-mono font-medium text-white">₹{target60.toLocaleString()}</div>
              </div>
              <Target className="w-5 h-5 text-indigo-500" />
            </div>
          </div>

          {/* Technical Factors Chips */}
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold mb-2 block">Key Indicators</span>
            <div className="flex flex-wrap gap-2">
              {sortedFactors.map((factor, idx) => (
                <span key={idx} className="px-2 py-1 text-[10px] bg-slate-700 text-slate-300 rounded border border-slate-600 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> {factor}
                </span>
              ))}
              <span className="px-2 py-1 text-[10px] bg-indigo-900/40 text-indigo-300 rounded border border-indigo-700/50 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> 
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;