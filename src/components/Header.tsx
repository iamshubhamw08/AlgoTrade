import React, { useState } from 'react';
import { Search, TrendingUp, Cpu } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-400">
          <Cpu className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight text-white">Algotrade.AI</span>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search NSE/BSE Symbol (e.g., TATASTEEL, RELIANCE)"
              className="w-full h-10 rounded-full bg-slate-800 border border-slate-700 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </form>

        <div className="hidden md:flex items-center gap-4 text-sm text-slate-400">
           <span className="text-xs font-mono text-indigo-400">MODEL: V3</span>
        </div>
      </div>
    </header>
  );
};

export default Header;