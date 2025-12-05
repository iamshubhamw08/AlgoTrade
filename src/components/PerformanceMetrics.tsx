
import React, { useState } from 'react';
import type { ModelPerformance } from '../types';
import { Trophy, TrendingUp, AlertTriangle, Crosshair, BarChart3, Info, HelpCircle } from 'lucide-react';

interface PerformanceMetricsProps {
  performance: ModelPerformance;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ performance }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const Tooltip = ({ id, text }: { id: string, text: string }) => (
    <div className={`absolute bottom-full mb-2 left-0 right-0 bg-slate-900 border border-slate-600 p-2 rounded text-xs text-slate-300 z-20 shadow-xl ${activeTooltip === id ? 'block' : 'hidden'}`}>
      {text}
      <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-600"></div>
    </div>
  );

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-full relative overflow-visible">
      
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-2 relative z-10">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <h3 className="text-slate-200 font-semibold">Backtest Performance</h3>
        </div>
        {performance.isSimulated && (
          <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
            Simulated Data
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        
        {/* Main Accuracy Metric */}
        <div className="col-span-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 flex items-center justify-between relative group">
          <div>
            <span className="text-xs text-indigo-300 font-medium uppercase tracking-wider block mb-1">Win Rate (Accuracy)</span>
            <span className="text-3xl font-bold text-white">{performance.accuracy}%</span>
            <span className="text-[10px] text-slate-400 block mt-1">Period: {performance.backtestPeriod}</span>
          </div>
          <div className="h-12 w-12 rounded-full border-4 border-indigo-500 flex items-center justify-center">
            <Crosshair className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        {/* Profit Factor */}
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 relative">
           <div className="flex items-center justify-between mb-1">
             <span className="text-xs text-slate-500 block">Profit Factor</span>
             <button 
               onMouseEnter={() => setActiveTooltip('pf')} 
               onMouseLeave={() => setActiveTooltip(null)}
               className="text-slate-600 hover:text-indigo-400"
             >
               <HelpCircle className="w-3 h-3" />
             </button>
           </div>
           <Tooltip id="pf" text="Gross Profit ÷ Gross Loss. A value > 1.5 indicates a profitable system. 2.0+ is excellent." />
           
           <div className="flex items-baseline gap-1">
             <span className="text-xl font-mono font-bold text-green-400">{performance.profitFactor}</span>
           </div>
        </div>

        {/* Max Drawdown */}
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 relative">
           <div className="flex items-center justify-between mb-1">
             <span className="text-xs text-slate-500 block">Max Drawdown</span>
             <button 
               onMouseEnter={() => setActiveTooltip('dd')} 
               onMouseLeave={() => setActiveTooltip(null)}
               className="text-slate-600 hover:text-indigo-400"
             >
               <HelpCircle className="w-3 h-3" />
             </button>
           </div>
           <Tooltip id="dd" text="The maximum observed loss from a peak to a trough of a portfolio, before a new peak is attained." />

           <div className="flex items-baseline gap-1">
             <span className="text-xl font-mono font-bold text-red-400">{performance.maxDrawdown}%</span>
           </div>
        </div>

        {/* Trades Stats */}
        <div className="col-span-2 flex gap-2 mt-2">
           <div className="flex-1 bg-green-900/20 rounded p-2 text-center border border-green-900/30">
             <span className="block text-xs text-green-500 mb-1">Wins</span>
             <span className="font-bold text-white">{performance.winningTrades}</span>
           </div>
           <div className="flex-1 bg-red-900/20 rounded p-2 text-center border border-red-900/30">
             <span className="block text-xs text-red-500 mb-1">Losses</span>
             <span className="font-bold text-white">{performance.totalTrades - performance.winningTrades}</span>
           </div>
           <div className="flex-1 bg-slate-700/20 rounded p-2 text-center border border-slate-700/30">
             <span className="block text-xs text-slate-400 mb-1">Total</span>
             <span className="font-bold text-white">{performance.totalTrades}</span>
           </div>
        </div>

      </div>

      {/* Disclaimer */}
      <div className="mt-6 flex items-start gap-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-indigo-300 leading-tight">
          <strong>Transparency Note:</strong> These metrics are generated by a simulation engine for demonstration. In a real-world scenario, you would need to connect a paid historical data API (e.g., Bloomberg/TickData) to validate these results.
        </p>
      </div>

    </div>
  );
};

export default PerformanceMetrics;

