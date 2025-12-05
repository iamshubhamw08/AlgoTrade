import React from 'react';
import type { Fundamentals } from '../types';
import { Building2, User, Globe, Calendar } from 'lucide-react';

interface FundamentalsCardProps {
  data: Fundamentals;
}

const FundamentalsCard: React.FC<FundamentalsCardProps> = ({ data }) => {
  const metrics = [
    { label: 'Market Cap', value: data.marketCap },
    { label: 'P/E Ratio', value: data.peRatio },
    { label: 'P/B Ratio', value: data.pbRatio },
    { label: 'EPS', value: data.eps },
    { label: 'Div Yield', value: data.dividendYield },
    { label: 'Day Range', value: data.dayRange },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Metrics Section */}
      <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-slate-200 font-semibold mb-4 border-b border-slate-700 pb-2">Financial Fundamentals</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
          {metrics.map((item, index) => (
            <div key={index} className="flex flex-col p-2 bg-slate-900/40 rounded-lg border border-slate-800/50">
              <span className="text-xs text-slate-500 mb-1">{item.label}</span>
              <span className="text-sm font-medium text-slate-200 truncate" title={item.value}>{item.value || 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Company Profile Section */}
      <div className="lg:col-span-1 bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-slate-200 font-semibold mb-4 border-b border-slate-700 pb-2">Company Profile</h3>
        <div className="space-y-4">
           <div>
             <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Building2 className="w-3 h-3"/> Sector</span>
             <p className="text-sm text-white font-medium">{data.sector}</p>
           </div>
           <div>
             <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><User className="w-3 h-3"/> CEO</span>
             <p className="text-sm text-white">{data.ceo || 'N/A'}</p>
           </div>
           <div>
             <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Calendar className="w-3 h-3"/> Founded</span>
             <p className="text-sm text-white">{data.founded || 'N/A'}</p>
           </div>
           <div>
             <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Globe className="w-3 h-3"/> Headquarters</span>
             <p className="text-sm text-white">{data.headquarters || 'N/A'}</p>
           </div>
           
           <div className="pt-2 border-t border-slate-700 mt-2">
             <span className="text-xs text-slate-500 mb-1 block">About</span>
             <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">
               {data.about}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FundamentalsCard;