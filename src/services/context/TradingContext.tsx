import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PortfolioItem, Transaction, UserProfile } from '../types';

interface TradingContextType {
  user: UserProfile;
  portfolio: PortfolioItem[];
  transactions: Transaction[];
  watchlist: string[];
  executeTrade: (symbol: string, name: string, type: 'BUY' | 'SELL', qty: number, price: number, isAuto?: boolean) => void;
  toggleAutoTrading: () => void;
  runAutoScan: () => Promise<void>;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) throw new Error('useTrading must be used within a TradingProvider');
  return context;
};

// Mock Nifty 50 Data for Auto-Trading Simulation
const NIFTY_50_MOCK = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2980 },
  { symbol: 'TCS', name: 'Tata Consultancy Svcs', price: 4120 },
  { symbol: 'INFY', name: 'Infosys Ltd', price: 1650 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1450 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', price: 980 },
  { symbol: 'SBIN', name: 'State Bank of India', price: 760 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1200 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1080 },
  { symbol: 'ITC', name: 'ITC Limited', price: 435 },
  { symbol: 'LT', name: 'Larsen & Toubro', price: 3600 },
  { symbol: 'AXISBANK', name: 'Axis Bank', price: 1050 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1750 },
  { symbol: 'WIPRO', name: 'Wipro Limited', price: 480 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', price: 2850 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', price: 11500 }
];

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe Load from local storage with Defaults
  const [user, setUser] = useState<UserProfile>(() => {
    const defaultUser = {
      cashBalance: 500000,
      startBalance: 500000,
      portfolioValue: 0,
      totalNetWorth: 500000,
      isAutoTradingEnabled: false
    };
    try {
      const saved = localStorage.getItem('user_profile');
      return saved ? { ...defaultUser, ...JSON.parse(saved) } : defaultUser;
    } catch (e) {
      return defaultUser;
    }
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem('user_portfolio');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('user_transactions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('user_watchlist');
      return saved ? JSON.parse(saved) : ['RELIANCE', 'TCS', 'INFY'];
    } catch (e) { return ['RELIANCE', 'TCS', 'INFY']; }
  });

  // Persist State
  useEffect(() => {
    localStorage.setItem('user_profile', JSON.stringify(user));
    localStorage.setItem('user_portfolio', JSON.stringify(portfolio));
    localStorage.setItem('user_transactions', JSON.stringify(transactions));
    localStorage.setItem('user_watchlist', JSON.stringify(watchlist));
  }, [user, portfolio, transactions, watchlist]);

  // Update Net Worth on Portfolio Change
  useEffect(() => {
    const currentPortValue = portfolio.reduce((acc, item) => acc + (item.quantity * (item.currentPrice ?? item.avgPrice)), 0);
    setUser(prev => ({
      ...prev,
      portfolioValue: currentPortValue,
      totalNetWorth: prev.cashBalance + currentPortValue
    }));
  }, [portfolio, user.cashBalance]);

  const executeTrade = (symbol: string, name: string, type: 'BUY' | 'SELL', qty: number, price: number, isAuto = false) => {
    const total = qty * price;

    if (type === 'BUY') {
      if (user.cashBalance < total) {
        if (!isAuto) alert("Insufficient Funds!"); 
        return;
      }
      
      setUser(prev => ({ ...prev, cashBalance: prev.cashBalance - total }));
      
      setPortfolio(prev => {
        const existing = prev.find(p => p.symbol === symbol);
        if (existing) {
          // Average Down logic
          const totalCost = (existing.quantity * existing.avgPrice) + total;
          const newQty = existing.quantity + qty;
          return prev.map(p => p.symbol === symbol ? { ...p, quantity: newQty, avgPrice: totalCost / newQty, currentPrice: price } : p);
        }
        return [...prev, { symbol, name, quantity: qty, avgPrice: price, currentPrice: price, type: isAuto ? 'AUTO' : 'MANUAL', entryDate: new Date().toISOString() }];
      });
    } else {
      // SELL Logic
      const existing = portfolio.find(p => p.symbol === symbol);
      if (!existing || existing.quantity < qty) {
        if (!isAuto) alert("Insufficient Holdings!");
        return;
      }

      setUser(prev => ({ ...prev, cashBalance: prev.cashBalance + total }));
      
      setPortfolio(prev => {
        if (existing.quantity === qty) {
          return prev.filter(p => p.symbol !== symbol);
        }
        return prev.map(p => p.symbol === symbol ? { ...p, quantity: p.quantity - qty, currentPrice: price } : p);
      });
    }

    // Log Transaction
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      symbol,
      type,
      quantity: qty,
      price,
      total,
      date: new Date().toISOString(),
      executionType: isAuto ? 'AUTO' : 'MANUAL',
      status: 'EXECUTED'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const toggleAutoTrading = () => {
    setUser(prev => ({ ...prev, isAutoTradingEnabled: !prev.isAutoTradingEnabled }));
  };

  const runAutoScan = async () => {
    if (!user.isAutoTradingEnabled) return;

    // Simulate small latency
    await new Promise(r => setTimeout(r, 500));

    // --- STEP 1: PRICE SIMULATION & SELL LOGIC ---
    let didAction = false;
    
    // Simulate price movements for existing portfolio
    const updatedPortfolio = portfolio.map(item => {
        const volatility = 0.02; // 2% swing potential
        // Random move between -2% and +2.5% (slight upward bias for demo)
        const randomMove = 1 + (Math.random() * (volatility * 2.2) - volatility); 
        return { ...item, currentPrice: item.currentPrice * randomMove };
    });
    
    // Update portfolio state with new prices visually
    setPortfolio(updatedPortfolio);

    for (const item of updatedPortfolio) {
        const pnlPercent = ((item.currentPrice - item.avgPrice) / item.avgPrice) * 100;
        
        // Take Profit (+3%) or Stop Loss (-2%)
        if (pnlPercent >= 3 || pnlPercent <= -2) {
             executeTrade(item.symbol, item.name, 'SELL', item.quantity, item.currentPrice, true);
             didAction = true;
             break; // Limit to 1 action per cycle to prevent overwhelming UI
        }
    }

    if (didAction) return;

    // --- STEP 2: BUY LOGIC ---
    // 30% chance to buy on any given scan tick if no sell happened
    if (Math.random() > 0.7) {
      const pick = NIFTY_50_MOCK[Math.floor(Math.random() * NIFTY_50_MOCK.length)];
      
      // Don't buy if we already have it
      if (!portfolio.find(p => p.symbol === pick.symbol)) {
        const investAmount = user.cashBalance * 0.1; // 10% of cash
        
        if (investAmount > pick.price) {
           const qty = Math.floor(investAmount / pick.price);
           // Simulate a slight price variation for the buy
           const buyPrice = pick.price * (1 + (Math.random() * 0.01 - 0.005));
           executeTrade(pick.symbol, pick.name, 'BUY', qty, buyPrice, true);
        }
      }
    }
  };

  // --- AUTOMATION LOOP ---
  // This is the critical piece that keeps the bot running when toggle is ON
  useEffect(() => {
    let interval: any;

    if (user.isAutoTradingEnabled) {
      // Run immediately
      runAutoScan();
      
      // Then run every 3 seconds
      interval = setInterval(() => {
        runAutoScan();
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user.isAutoTradingEnabled, portfolio, user.cashBalance]); 
  // Dependency on portfolio/cash ensures the loop restarts with fresh state after every trade

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) setWatchlist(prev => [...prev, symbol]);
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
  };

  return (
    <TradingContext.Provider value={{ user, portfolio, transactions, watchlist, executeTrade, toggleAutoTrading, runAutoScan, addToWatchlist, removeFromWatchlist }}>
      {children}
    </TradingContext.Provider>
  );
};
