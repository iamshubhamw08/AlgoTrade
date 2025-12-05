import React from 'react';
import type { StockNews } from '../types';
import { ExternalLink, Clock } from 'lucide-react';

interface NewsPanelProps {
  news: StockNews[];
}

const NewsPanel: React.FC<NewsPanelProps> = ({ news }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-full">
      <h3 className="text-slate-200 font-semibold mb-4 border-b border-slate-700 pb-2">Latest Signals & News</h3>
      <div className="space-y-4">
        {news.length === 0 ? (
           <p className="text-slate-500 text-sm">No recent high-impact news found.</p>
        ) : (
          news.map((item, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  item.sentiment === 'Positive' ? 'bg-green-500/10 text-green-500' :
                  item.sentiment === 'Negative' ? 'bg-red-500/10 text-red-500' :
                  'bg-slate-600/10 text-slate-400'
                }`}>
                  {item.sentiment}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.time}
                </span>
              </div>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="block mt-1">
                <h4 className="text-sm text-slate-300 font-medium group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {item.title}
                </h4>
              </a>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500">{item.source}</span>
                <ExternalLink className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsPanel;