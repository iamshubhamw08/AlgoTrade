import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, AreaChart, Area, ReferenceLine, Cell
} from 'recharts';
import type { ChartPoint } from '../types';

interface StockChartProps {
  data: ChartPoint[];
}

type TimeFrame = '1D' | '5D' | '1M' | '3M' | '6M' | 'YTD' | '1Y' | '3Y' | 'ALL';

// Defined outside to prevent re-render thrashing
const CustomTooltip = ({ active, payload, label, activeTab }: any) => {
  if (active && payload && payload.length) {
    const p = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl text-xs z-50">
        <p className="text-slate-400 mb-2 font-mono">{label}</p>
        {activeTab === 'CANDLE' ? (
          <div className="space-y-1">
             <div className="flex justify-between gap-4"><span className="text-slate-500">Open:</span> <span className="text-slate-200">{p.open}</span></div>
             <div className="flex justify-between gap-4"><span className="text-slate-500">High:</span> <span className="text-slate-200">{p.high}</span></div>
             <div className="flex justify-between gap-4"><span className="text-slate-500">Low:</span> <span className="text-slate-200">{p.low}</span></div>
             <div className="flex justify-between gap-4"><span className="text-slate-500">Close:</span> <span className="text-slate-200">{p.close}</span></div>
          </div>
        ) : (
          <div className="space-y-1">
            {payload.map((item: any) => (
              <div key={item.name} className="flex justify-between gap-4">
                <span style={{ color: item.color }}>{item.name}:</span>
                <span className="text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
};

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'CANDLE' | 'LINE' | 'RSI'>('CANDLE');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1Y');

  // Filter Data based on Timeframe
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    let startDate = new Date();
    
    switch (timeFrame) {
      case '1D': return data.slice(-24); // Mock: last 24 points
      case '5D': startDate.setDate(now.getDate() - 5); break;
      case '1M': startDate.setMonth(now.getMonth() - 1); break;
      case '3M': startDate.setMonth(now.getMonth() - 3); break;
      case '6M': startDate.setMonth(now.getMonth() - 6); break;
      case 'YTD': startDate = new Date(now.getFullYear(), 0, 1); break;
      case '1Y': startDate.setFullYear(now.getFullYear() - 1); break;
      case '3Y': startDate.setFullYear(now.getFullYear() - 3); break;
      case 'ALL': return data;
    }

    return data.filter(d => new Date(d.date) >= startDate);
  }, [data, timeFrame]);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 h-[600px] flex flex-col">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div>
           <h3 className="text-slate-200 font-semibold">Technical Chart</h3>
           <p className="text-[10px] text-slate-500">Real-time intervals simulated</p>
        </div>
        
        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
          {/* Chart Types */}
          <div className="flex bg-slate-900 rounded-lg p-0.5 w-full sm:w-auto">
            {['CANDLE', 'LINE', 'RSI'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Timeframes */}
          <div className="flex flex-wrap justify-end gap-1">
            {(['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y', '3Y', 'ALL'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFrame(tf)}
                className={`px-2 py-1 text-[10px] font-bold rounded hover:bg-slate-700 transition-colors ${
                  timeFrame === tf ? 'bg-slate-700 text-indigo-400' : 'text-slate-500'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'RSI' ? (
             <ComposedChart data={filteredData}>
               <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
               <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickMargin={10} minTickGap={30} />
               <YAxis stroke="#64748b" domain={[0, 100]} fontSize={10} tickCount={5} />
               <Tooltip content={(props) => <CustomTooltip {...props} activeTab={activeTab} />} />
               
               {/* Equilibrium Line (Red at 50) */}
               <ReferenceLine y={50} stroke="#ef4444" strokeWidth={1.5} label={{ value: "Equilibrium (50)", position: 'right', fill: '#ef4444', fontSize: 10 }} />
               
               {/* Overbought/Oversold Bounds */}
               <ReferenceLine y={70} stroke="#94a3b8" strokeDasharray="3 3" strokeWidth={1} />
               <ReferenceLine y={30} stroke="#94a3b8" strokeDasharray="3 3" strokeWidth={1} />
               
               {/* RSI Line (White/High Contrast as requested "Black" logic for visibility) */}
               <Line 
                 type="monotone" 
                 dataKey="rsi" 
                 stroke="#f8fafc" // White for dark mode visibility (equivalent to black on paper)
                 strokeWidth={2} 
                 dot={false}
                 name="RSI Line"
               />
             </ComposedChart>
          ) : activeTab === 'LINE' ? (
             <AreaChart data={filteredData}>
               <defs>
                 <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5}/>
                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
               <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickMargin={10} minTickGap={30} />
               <YAxis stroke="#64748b" domain={['auto', 'auto']} fontSize={10} tickFormatter={(val) => `₹${val}`} />
               <Tooltip content={(props) => <CustomTooltip {...props} activeTab={activeTab} />} />
               <Area type="monotone" dataKey="close" stroke="#6366f1" strokeWidth={2} fill="url(#colorClose)" name="Price" />
             </AreaChart>
          ) : (
            // Custom Candlestick Implementation
            <ComposedChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickMargin={10} minTickGap={30} />
              <YAxis stroke="#64748b" domain={['auto', 'auto']} fontSize={10} tickFormatter={(val) => `₹${val}`} />
              <Tooltip content={(props) => <CustomTooltip {...props} activeTab={activeTab} />} />
              
              {/* Wicks (Thin Bar) */}
              <Bar dataKey="wickRange" fill="#94a3b8" barSize={1} xAxisId={0} />
              
              {/* Body (Thicker Bar) - Color logic handled by Cell */}
              <Bar dataKey="bodyRange" barSize={8} xAxisId={0}>
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </ComposedChart>
          )}
        </ResponsiveContainer>

        {activeTab === 'RSI' && (
          <div className="absolute top-2 left-14 bg-slate-900/80 p-2 rounded border border-slate-700 text-[10px] text-slate-400 max-w-xs">
            <span className="block font-bold text-white mb-1">RSI Interpretation</span>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <span className="text-red-400">&gt; 70: Overbought</span>
              <span className="text-green-400">&lt; 30: Oversold</span>
              <span className="text-white col-span-2 border-t border-slate-700 pt-1 mt-1">
                Line &gt; 50: Bullish Momentum<br/>
                Line &lt; 50: Bearish Momentum
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockChart;