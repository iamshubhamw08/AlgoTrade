import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Trash2, Zap, Clock, Search, History, Activity } from 'lucide-react';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444'];

const TradingDashboard: React.FC<{ onNavigateSearch: () => void }> = ({ onNavigateSearch }) => {
  const { user, portfolio, transactions, watchlist, removeFromWatchlist, toggleAutoTrading, runAutoScan } = useTrading();
  const [activeTab, setActiveTab] = useState<'PORTFOLIO' | 'TRANSACTIONS' | 'WATCHLIST'>('PORTFOLIO');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    await runAutoScan();
    setIsScanning(false);
  };

  // Ensure values are numbers using nullish coalescing
  const cashBalance = user?.cashBalance ?? 0;
  const portfolioValue = user?.portfolioValue ?? 0;
  const totalNetWorth = user?.totalNetWorth ?? 0;
  const startBalance = user?.startBalance ?? 0;

  // Pie Chart Data
  const pieData = [
    { name: 'Cash', value: cashBalance },
    ...portfolio.map(p => ({ name: p.symbol, value: p.quantity * (p.currentPrice ?? 0) }))
  ];

  const pnlValue = totalNetWorth - startBalance;
  const pnlPercent = startBalance > 0 ? (pnlValue / startBalance * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Section: Account Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="w-24 h-24 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Net Worth</h3>
            <div className="text-3xl font-bold text-white mt-1">₹{totalNetWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <div className={`text-sm mt-1 flex items-center gap-1 ${pnlValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {pnlValue >= 0 ? <TrendingUp className="w-4 h-4"/> : <TrendingDown className="w-4 h-4"/>}
              {pnlPercent.toFixed(2)}% P&L
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-end">
            <div>
              <div className="text-xs text-slate-500">Available Cash</div>
              <div className="text-xl font-mono text-white">₹{cashBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 text-right">Invested</div>
              <div className="text-xl font-mono text-indigo-400">₹{portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>
          </div>
        </div>

        {/* Allocation Chart */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 flex items-center">
          <div className="w-1/2 h-32">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={pieData} innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value">
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : COLORS[index % COLORS.length + 1]} />
                   ))}
                 </Pie>
                 <ReTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }} itemStyle={{ color: '#fff' }} formatter={(val: number) => `₹${val.toLocaleString()}`} />
               </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="w-1/2 pl-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase">Allocation</h4>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-slate-300">Cash ({totalNetWorth > 0 ? ((cashBalance / totalNetWorth) * 100).toFixed(0) : 0}%)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span className="text-slate-300">Stocks ({totalNetWorth > 0 ? ((portfolioValue / totalNetWorth) * 100).toFixed(0) : 0}%)</span>
            </div>
          </div>
        </div>

        {/* Auto-Trading Controls */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Zap className={`w-5 h-5 ${user.isAutoTradingEnabled ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500'}`} />
                AI Auto-Pilot
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={user.isAutoTradingEnabled} onChange={toggleAutoTrading} />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              When enabled, the bot scans Nifty 50 stocks every 3 seconds and executes trades automatically using 10% of cash.
            </p>
          </div>
          <button 
            disabled={true} 
            className={`mt-4 w-full py-2 rounded font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              user.isAutoTradingEnabled 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/50 animate-pulse' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {user.isAutoTradingEnabled ? (
              <>
                <Activity className="w-3 h-3 animate-spin" />
                Auto-Pilot Active: Scanning...
              </>
            ) : (
              <>Enable Auto-Pilot to Start</>
            )}
          </button>
        </div>
      </div>

      {/* Main Terminal Area */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 min-h-[400px] flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-slate-700 overflow-x-auto">
          <button onClick={() => setActiveTab('PORTFOLIO')} className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'PORTFOLIO' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>Portfolio</button>
          <button onClick={() => setActiveTab('WATCHLIST')} className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'WATCHLIST' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>Watchlist</button>
          <button onClick={() => setActiveTab('TRANSACTIONS')} className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'TRANSACTIONS' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>Transaction Log</button>
        </div>

        {/* Content */}
        <div className="p-0 flex-1 overflow-x-auto">
          {activeTab === 'PORTFOLIO' && (
             <div className="w-full">
               {portfolio.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                   <Search className="w-12 h-12 mb-2 opacity-20" />
                   <p>Your portfolio is empty.</p>
                   <button onClick={onNavigateSearch} className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">Find Stocks to Buy</button>
                 </div>
               ) : (
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase bg-slate-800/50">
                       <th className="p-4 font-semibold">Symbol</th>
                       <th className="p-4 font-semibold text-right">Qty</th>
                       <th className="p-4 font-semibold text-right">Avg Price</th>
                       <th className="p-4 font-semibold text-right">LTP</th>
                       <th className="p-4 font-semibold text-right">Current Value</th>
                       <th className="p-4 font-semibold text-right">P&L</th>
                       <th className="p-4 font-semibold text-center">Type</th>
                     </tr>
                   </thead>
                   <tbody>
                     {portfolio.map((item) => {
                       const price = item.currentPrice ?? 0;
                       const avg = item.avgPrice ?? 0;
                       const currentValue = item.quantity * price;
                       const investedValue = item.quantity * avg;
                       const pnl = currentValue - investedValue;
                       const pnlPercent = investedValue !== 0 ? (pnl / investedValue) * 100 : 0;
                       
                       return (
                         <tr key={item.symbol} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors text-sm">
                           <td className="p-4">
                             <div className="font-bold text-white">{item.symbol}</div>
                             <div className="text-[10px] text-slate-400">{item.name}</div>
                           </td>
                           <td className="p-4 text-right text-slate-300 font-mono">{item.quantity}</td>
                           <td className="p-4 text-right text-slate-300 font-mono">{avg.toFixed(2)}</td>
                           <td className="p-4 text-right text-white font-mono">{price.toFixed(2)}</td>
                           <td className="p-4 text-right text-white font-mono">₹{currentValue.toLocaleString()}</td>
                           <td className={`p-4 text-right font-mono font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                             {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} <br/>
                             <span className="text-[10px] opacity-70">({pnlPercent.toFixed(2)}%)</span>
                           </td>
                           <td className="p-4 text-center">
                             <span className={`text-[10px] px-2 py-0.5 rounded border ${item.type === 'AUTO' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-600/10 text-slate-400 border-slate-600/20'}`}>
                               {item.type}
                             </span>
                           </td>
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
               )}
             </div>
          )}

          {activeTab === 'WATCHLIST' && (
            <div className="p-6">
              {watchlist.length === 0 ? (
                <div className="text-center text-slate-500">No stocks in watchlist.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {watchlist.map(sym => (
                    <div key={sym} className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex justify-between items-center group">
                      <span className="font-bold text-white">{sym}</span>
                      <div className="flex gap-2">
                        <button onClick={() => { onNavigateSearch(); /* Trigger search logic ideally */ }} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-500">Analyze</button>
                        <button onClick={() => removeFromWatchlist(sym)} className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'TRANSACTIONS' && (
            <div className="w-full">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase bg-slate-800/50">
                     <th className="p-4 font-semibold">Date</th>
                     <th className="p-4 font-semibold">Symbol</th>
                     <th className="p-4 font-semibold">Action</th>
                     <th className="p-4 font-semibold text-right">Qty</th>
                     <th className="p-4 font-semibold text-right">Price</th>
                     <th className="p-4 font-semibold text-right">Total</th>
                     <th className="p-4 font-semibold text-center">Mode</th>
                   </tr>
                 </thead>
                 <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-slate-700/50 text-sm">
                        <td className="p-4 text-slate-400 text-xs">{new Date(tx.date).toLocaleString()}</td>
                        <td className="p-4 text-white font-medium">{tx.symbol}</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tx.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-4 text-right text-slate-300 font-mono">{tx.quantity}</td>
                        <td className="p-4 text-right text-slate-300 font-mono">{(tx.price ?? 0).toFixed(2)}</td>
                        <td className="p-4 text-right text-white font-mono">₹{(tx.total ?? 0).toLocaleString()}</td>
                        <td className="p-4 text-center">
                           <span className={`text-[10px] uppercase font-bold ${tx.executionType === 'AUTO' ? 'text-indigo-400' : 'text-slate-500'}`}>
                             {tx.executionType}
                           </span>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;