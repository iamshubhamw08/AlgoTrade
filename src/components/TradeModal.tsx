
import React, { useState } from 'react';
import { SignalType } from '../types';
import { useTrading } from '../context/TradingContext';
import { X, AlertTriangle, CheckCircle2, Wallet, RefreshCcw } from 'lucide-react';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockName: string;
  symbol: string;
  currentPrice: number;
  signal: SignalType;
}

const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, stockName, symbol, currentPrice, signal }) => {
  const { executeTrade, user } = useTrading();
  const [quantity, setQuantity] = useState<string>('1');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>(signal === SignalType.SELL ? 'SELL' : 'BUY');

  if (!isOpen) return null;

  const totalValue = parseFloat(quantity || '0') * currentPrice;
  const canAfford = user.cashBalance >= totalValue;

  const handleExecute = () => {
    executeTrade(symbol, stockName, tradeType, parseInt(quantity), currentPrice, false);
    setOrderPlaced(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white">Paper Trading Terminal</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!orderPlaced ? (
            <>
              {/* Order Details */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{symbol}</h3>
                  <p className="text-sm text-slate-400">{stockName}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono text-white">₹{currentPrice.toLocaleString()}</div>
                  <div className="text-xs text-slate-500 mt-1">Available Cash: <span className="text-indigo-400 font-mono">₹{user.cashBalance.toLocaleString()}</span></div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs text-slate-500 mb-1 uppercase font-semibold">Action</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setTradeType('BUY')}
                      className={`py-2 rounded font-bold text-sm border transition-all ${tradeType === 'BUY' ? 'bg-green-600 text-white border-green-500 shadow-lg shadow-green-900/50' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                    >
                      BUY
                    </button>
                    <button 
                      onClick={() => setTradeType('SELL')}
                      className={`py-2 rounded font-bold text-sm border transition-all ${tradeType === 'SELL' ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/50' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                    >
                      SELL
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 uppercase font-semibold">Quantity</label>
                    <input 
                      type="number" 
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 uppercase font-semibold">Order Type</label>
                    <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none">
                      <option>Market</option>
                      <option disabled>Limit (Pro)</option>
                    </select>
                  </div>
                </div>

                <div className={`bg-slate-800/50 p-3 rounded flex justify-between items-center border ${!canAfford && tradeType === 'BUY' ? 'border-red-500/50 bg-red-500/10' : 'border-slate-700'}`}>
                  <span className="text-sm text-slate-400">Estimated Total</span>
                  <span className="text-lg font-bold text-white font-mono">₹{totalValue.toLocaleString()}</span>
                </div>
                
                {tradeType === 'BUY' && !canAfford && (
                   <p className="text-xs text-red-400 text-center font-bold">Insufficient Funds</p>
                )}
              </div>

              <button 
                onClick={handleExecute}
                disabled={tradeType === 'BUY' && !canAfford}
                className={`w-full font-bold py-3 rounded-lg transition-all shadow-lg ${tradeType === 'BUY' ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/20' : 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {tradeType === 'BUY' ? 'Place Buy Order' : 'Place Sell Order'}
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Order Executed</h3>
              <p className="text-slate-400 mb-6">
                Successfully {tradeType === 'BUY' ? 'bought' : 'sold'} <strong>{quantity}</strong> qty of <strong>{symbol}</strong> at ₹{currentPrice}.
              </p>
              <div className="flex gap-3">
                 <button 
                  onClick={onClose}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeModal;
