import React from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Package, 
  Weight, 
  Check, 
  ArrowRight
} from 'lucide-react';
import { soundFX } from '../../utils/audio';

export default function CartItemList({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  currency
}) {
  const formatPrice = (priceINR, priceUSD) => {
    return currency === 'INR' ? `₹${priceINR}` : `$${priceUSD.toFixed(2)}`;
  };

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-slate-200/80 transition-all flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#F3E5F5] text-[#7B1FA2] border border-[#E1BEE7]">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Current Cart Items
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#E0F7FA] text-[#00838F] border border-[#B2EBF2]">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Auto-scanned & load-cell verified items
            </p>
          </div>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={() => {
              soundFX.playClick();
              onClearCart();
            }}
            className="text-xs font-medium text-slate-400 hover:text-rose-600 transition flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Empty Cart</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="mt-4 flex-1 overflow-y-auto max-h-[380px] space-y-3 pr-1">
        {cartItems.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center text-3xl mb-3 shadow-inner">
              🛒
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              Your Smart Trolley is Empty
            </h4>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Scan items in front of the camera or click the quick mock buttons on the left to start adding groceries.
            </p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="group p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs flex items-center justify-between gap-3"
            >
              {/* Left: Thumbnail & details */}
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="font-semibold text-slate-800">
                      {formatPrice(item.priceINR, item.priceUSD)}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-0.5 font-mono text-slate-600">
                      <Weight className="w-3 h-3 text-slate-400" />
                      {item.weightGrams}g ea
                    </span>
                    <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded bg-slate-200/60 text-[10px] text-slate-600">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Quantity controls, subtotal, and remove */}
              <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                
                {/* Quantity Pill */}
                <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onUpdateQty(item.id, item.quantity - 1);
                    }}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="w-6 text-center text-xs font-bold text-slate-900 font-mono">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onUpdateQty(item.id, item.quantity + 1);
                    }}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                    title="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Line Item Total */}
                <div className="text-right min-w-[55px]">
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {formatPrice(item.priceINR * item.quantity, item.priceUSD * item.quantity)}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {item.weightGrams * item.quantity}g
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onRemoveItem(item.id);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
