import React from 'react';
import { 
  Radio, 
  Wifi, 
  Battery, 
  ShoppingCart, 
  Scale, 
  ShieldCheck, 
  ShieldAlert, 
  Tag, 
  Info,
  Clock
} from 'lucide-react';
import CameraScanner from './CameraScanner';
import WeightVerificationCard from './WeightVerificationCard';
import CartItemList from './CartItemList';
import BillingBreakdown from './BillingBreakdown';

export default function CustomerView({
  cartItems,
  onItemScanned,
  lastScannedItem,
  verificationFlash,
  expectedWeight,
  measuredWeight,
  mismatchDeviation,
  onTriggerMismatch,
  onCalibrateReset,
  hasMismatchAlert,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onResetSession,
  onOpenCheckoutModal,
  currency
}) {
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalINR = cartItems.reduce((acc, item) => acc + (item.priceINR * item.quantity), 0);
  const totalUSD = cartItems.reduce((acc, item) => acc + (item.priceUSD * item.quantity), 0);

  const formatPrice = (inr, usd) => {
    return currency === 'INR' ? `₹${inr}` : `$${usd.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. CUSTOMER TOP BAR: Trolley #04 (Active Session), Connection Status, Cart Summary */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Trolley ID & Session Badge */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E0F7FA] border border-[#B2EBF2] flex items-center justify-center text-xl shadow-xs">
            🛒
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 font-['Outfit']">
                Trolley #04
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                Active Session
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>Customer ID: Guest-8821</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center text-slate-600 font-mono">
                <Clock className="w-3 h-3 mr-1 text-slate-400" />
                Session: 14m 20s
              </span>
            </p>
          </div>
        </div>

        {/* Center: Real-Time Connection & Sensor Diagnostics */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-[#00838F]" />
            <span>ESP32 Wi-Fi: <strong className="font-semibold text-slate-900">-48 dBm</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center space-x-2">
            <Battery className="w-3.5 h-3.5 text-emerald-600" />
            <span>Battery: <strong className="font-semibold text-slate-900">88% (Healthy)</strong></span>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border flex items-center space-x-2 ${
            hasMismatchAlert
              ? 'bg-rose-50 text-rose-700 border-rose-300'
              : 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
          }`}>
            {hasMismatchAlert ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>Load Cell: <strong className="font-bold">Mismatch (+{mismatchDeviation}g)</strong></span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Load Cell: <strong className="font-bold">Verified & Balanced</strong></span>
              </>
            )}
          </div>
        </div>

        {/* Right: Cart Summary Quick Pill */}
        <div className="flex items-center space-x-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-2.5 rounded-2xl shadow-sm self-start md:self-auto">
          <div className="text-left">
            <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
              Live Total
            </p>
            <p className="text-base font-extrabold font-mono text-emerald-400">
              {formatPrice(totalINR, totalUSD)}
            </p>
          </div>
          <div className="h-7 w-px bg-slate-700"></div>
          <div className="text-right">
            <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
              Load
            </p>
            <p className="text-sm font-bold font-mono text-slate-200">
              {expectedWeight}g
            </p>
          </div>
        </div>

      </div>

      {/* 2-COLUMN LAYOUT: Left Scanner Column & Right Smart Cart/Verification Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Mobile / Live Scanner Interface */}
        <div className="lg:col-span-5 space-y-6">
          <CameraScanner
            onItemScanned={onItemScanned}
            lastScannedItem={lastScannedItem}
            verificationFlash={verificationFlash}
            currency={currency}
            hasMismatchAlert={hasMismatchAlert}
          />

          {/* Quick Technical Architecture Tip Card */}
          <div className="p-4 rounded-3xl bg-[#F8FAF9] border border-slate-200/70 text-xs text-slate-600 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-slate-800">
              <Info className="w-4 h-4 text-[#00838F]" />
              <span>How Gokart AI Anti-Theft Architecture Works:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-500 pl-1 leading-relaxed">
              <li><strong className="text-slate-700">Optical Vision Layer:</strong> Identifies packaging contours and product barcode.</li>
              <li><strong className="text-slate-700">Gesture Model:</strong> Confirms physical hand deposit trajectory into cart.</li>
              <li><strong className="text-slate-700">4-Point Load Cells:</strong> Validates precise mass within ±15 grams before unfreezing wheels.</li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Smart Cart & Anti-Theft Weight Validation & Billing */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Anti-Theft Weight Validation Card */}
          <WeightVerificationCard
            expectedWeight={expectedWeight}
            measuredWeight={measuredWeight}
            mismatchDeviation={mismatchDeviation}
            onTriggerMismatch={onTriggerMismatch}
            onCalibrateReset={onCalibrateReset}
            hasMismatchAlert={hasMismatchAlert}
          />

          {/* Cart Items List */}
          <CartItemList
            cartItems={cartItems}
            onUpdateQty={onUpdateQty}
            onRemoveItem={onRemoveItem}
            onClearCart={onClearCart}
            currency={currency}
          />

          {/* Billing Breakdown & Payment Action */}
          <BillingBreakdown
            cartItems={cartItems}
            currency={currency}
            hasMismatchAlert={hasMismatchAlert}
            onResetSession={onResetSession}
            onOpenCheckoutModal={onOpenCheckoutModal}
          />

        </div>

      </div>

    </div>
  );
}
