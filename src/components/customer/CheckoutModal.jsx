import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Printer, 
  Download, 
  Scale, 
  Package, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../../utils/audio';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  currency,
  onSuccessfulPayment
}) {
  const [activeTab, setActiveTab] = useState('UPI'); // 'UPI', 'CARD', 'CASH'
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'processing', 'success'
  const [countdownSeconds, setCountdownSeconds] = useState(120); // 2:00 timer
  const [transactionId, setTransactionId] = useState('');
  const [timestamp, setTimestamp] = useState('');

  // Card Form State
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardHolder, setCardHolder] = useState('GOKART GUEST USER');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('789');

  // Calculations
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalWeightGrams = cartItems.reduce((acc, item) => acc + (item.weightGrams * item.quantity), 0);
  const subtotalINR = cartItems.reduce((acc, item) => acc + (item.priceINR * item.quantity), 0);
  const subtotalUSD = cartItems.reduce((acc, item) => acc + (item.priceUSD * item.quantity), 0);

  const gstRate = 0.05; // 5% GST
  const gstINR = Math.round(subtotalINR * gstRate);
  const gstUSD = Number((subtotalUSD * gstRate).toFixed(2));

  const platformFeeINR = cartItems.length > 0 ? 2 : 0;
  const platformFeeUSD = cartItems.length > 0 ? 0.05 : 0;

  const finalTotalINR = subtotalINR + gstINR + platformFeeINR;
  const finalTotalUSD = Number((subtotalUSD + gstUSD + platformFeeUSD).toFixed(2));

  const formatPrice = (inr, usd) => {
    return currency === 'INR' ? `₹${inr}` : `$${usd.toFixed(2)}`;
  };

  // Format 120 -> "02:00", 119 -> "01:59"
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen || paymentStatus !== 'pending') return;
    
    setCountdownSeconds(120);
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          return 120; // Auto-refresh timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, paymentStatus]);

  // Generate TXN on modal open
  useEffect(() => {
    if (isOpen) {
      setTransactionId(`TXN-GK${Math.floor(100000 + Math.random() * 900000)}`);
      setTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setPaymentStatus('pending');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Simulate Successful Payment
  const handleExecutePayment = (methodName = activeTab) => {
    soundFX.playClick();
    setPaymentStatus('processing');

    setTimeout(() => {
      setPaymentStatus('success');
      soundFX.playPaymentSuccess();

      // Trigger Confetti Effect
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn("Confetti error:", e);
      }

      // Notify parent to record payment and clear cart
      if (onSuccessfulPayment) {
        onSuccessfulPayment({
          transactionId,
          method: methodName,
          amountINR: finalTotalINR,
          amountUSD: finalTotalUSD,
          itemsCount: totalItemCount,
          totalWeight: totalWeightGrams,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }, 1200);
  };

  const handlePrintReceipt = () => {
    soundFX.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      
      {/* Sleek Full-Screen / Modal Card */}
      <div className="bg-[#FAFDFB] w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden relative animate-scale-up my-auto flex flex-col max-h-[95vh]">
        
        {/* Top Pastel Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-[#E0F7FA] via-[#E8F5E9] to-[#F3E5F5] border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-slate-200/60 flex items-center justify-center text-xl">
              🛒
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-['Outfit']">
                  Gokart AI Autonomous Checkout
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                  Trolley #04
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span>Self-Service Payment Gateway</span>
                <span>•</span>
                <span>Gate Exit Pass Generator</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-200 flex items-center justify-center shadow-xs transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          
          {paymentStatus === 'processing' ? (
            /* Processing Screen */
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-18 h-18 rounded-full border-4 border-[#00838F] border-t-transparent animate-spin mb-5"></div>
              <h3 className="text-xl font-black text-slate-900 font-['Outfit']">
                Processing Secure Settlement...
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Authenticating with NPCI UPI Gateway, validating load-cell zero tare, and unlocking trolley wheel brakes.
              </p>
            </div>
          ) : paymentStatus === 'success' ? (
            /* Digital Receipt & Payment Success Screen */
            <div className="max-w-xl mx-auto text-center py-4">
              
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-3xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] flex items-center justify-center mx-auto mb-3 shadow-pastel-mint">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Payment Confirmed & Verified
              </span>

              <h3 className="text-2xl font-black text-slate-900 font-['Outfit'] mt-2">
                Checkout Completed!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your exit authorization barcode is armed. Simply roll through the exit lane.
              </p>

              {/* Digital Tax Invoice Receipt Card */}
              <div className="mt-5 p-5 rounded-2xl bg-white border border-slate-200 shadow-soft text-left text-xs font-mono space-y-3">
                <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2.5">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">GOKART AI SUPERMARKET</p>
                    <p className="text-[10px] text-slate-400 font-sans">Autonomous Store #04 • Mesh Lane 1</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#00838F] text-xs">{transactionId}</p>
                    <p className="text-[10px] text-slate-400">{timestamp}</p>
                  </div>
                </div>

                {/* Itemized Manifest */}
                <div className="space-y-1.5 py-1">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-600 text-[11px]">
                      <span className="truncate pr-2">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-bold text-slate-800 shrink-0">
                        {formatPrice(item.priceINR * item.quantity, item.priceUSD * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Totals */}
                <div className="border-t border-dashed border-slate-200 pt-2 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotalINR, subtotalUSD)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>GST (5%):</span>
                    <span>{formatPrice(gstINR, gstUSD)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Smart Bag / Cloud Fee:</span>
                    <span>{formatPrice(platformFeeINR, platformFeeUSD)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                    <span>TOTAL AMOUNT PAID:</span>
                    <span className="text-[#2E7D32]">{formatPrice(finalTotalINR, finalTotalUSD)}</span>
                  </div>
                </div>

                {/* Gate Exit Barcode */}
                <div className="pt-2 text-center border-t border-dashed border-slate-200">
                  <div className="mx-auto w-48 h-12 bg-slate-100 rounded flex items-center justify-center p-1 border border-slate-200">
                    {/* Simulated exit barcode stripes */}
                    <div className="flex space-x-1 h-full items-center">
                      <div className="w-1 h-8 bg-slate-800"></div>
                      <div className="w-2 h-8 bg-slate-800"></div>
                      <div className="w-0.5 h-8 bg-slate-800"></div>
                      <div className="w-1.5 h-8 bg-slate-800"></div>
                      <div className="w-1 h-8 bg-slate-800"></div>
                      <div className="w-2.5 h-8 bg-slate-800"></div>
                      <div className="w-1 h-8 bg-slate-800"></div>
                      <div className="w-0.5 h-8 bg-slate-800"></div>
                      <div className="w-2 h-8 bg-slate-800"></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">GATE EXIT CODE: {transactionId}-AUTH-OK</p>
                </div>
              </div>

              {/* Receipt Action Buttons */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={handlePrintReceipt}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>

                <button
                  id="checkout-finish-session-btn"
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-md"
                >
                  <span>Start New Session</span>
                </button>
              </div>

            </div>
          ) : (
            /* Main Checkout 2-Column Interface */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT: Order Summary Breakdown Card */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft space-y-4">
                
                {/* Summary Header */}
                <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
                  <div className="p-2 rounded-xl bg-[#E0F7FA] text-[#00838F]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Order Summary Breakdown
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Verified Cart Manifest
                    </p>
                  </div>
                </div>

                {/* Key Metrics: Items & Weight */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                      <Package className="w-3 h-3 text-slate-400" />
                      Total Items
                    </span>
                    <p className="text-base font-extrabold text-slate-800 mt-1">
                      {totalItemCount} {totalItemCount === 1 ? 'Product' : 'Products'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                      <Scale className="w-3 h-3 text-slate-400" />
                      Total Weight
                    </span>
                    <p className="text-base font-extrabold text-emerald-700 font-mono mt-1">
                      {totalWeightGrams}g
                    </p>
                  </div>
                </div>

                {/* Compact Items List */}
                <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 pr-1 text-xs">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate pr-2">
                        <span className="text-base">{item.icon}</span>
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-400">Qty: {item.quantity} • {item.weightGrams * item.quantity}g</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-900 font-mono shrink-0">
                        {formatPrice(item.priceINR * item.quantity, item.priceUSD * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Charges List */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatPrice(subtotalINR, subtotalUSD)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated GST (5%)</span>
                    <span className="font-semibold text-slate-900">{formatPrice(gstINR, gstUSD)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Smart Cart Cloud Fee</span>
                    <span className="font-semibold text-slate-900">{formatPrice(platformFeeINR, platformFeeUSD)}</span>
                  </div>
                  <div className="h-px bg-slate-200 my-1"></div>
                  <div className="flex justify-between items-baseline pt-1">
                    <div>
                      <span className="text-sm font-extrabold text-slate-900">Final Amount</span>
                      <p className="text-[10px] text-slate-400">Instant checkout</p>
                    </div>
                    <span className="text-xl font-black text-emerald-800 font-mono">
                      {formatPrice(finalTotalINR, finalTotalUSD)}
                    </span>
                  </div>
                </div>

                {/* Anti-Theft Verification Badge */}
                <div className="p-2.5 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] text-xs text-[#2E7D32] flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#2E7D32]" />
                  <span className="text-[11px] font-semibold">
                    Tare weight balanced. Brakes authorized for exit release.
                  </span>
                </div>

              </div>

              {/* RIGHT: Interactive Payment Options Tabs */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft flex flex-col justify-between">
                
                <div>
                  {/* Payment Method Tabs */}
                  <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl mb-5">
                    <button
                      id="tab-upi"
                      onClick={() => {
                        soundFX.playClick();
                        setActiveTab('UPI');
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                        activeTab === 'UPI'
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#00838F]" />
                      <span>UPI QR Code</span>
                    </button>

                    <button
                      id="tab-card"
                      onClick={() => {
                        soundFX.playClick();
                        setActiveTab('CARD');
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                        activeTab === 'CARD'
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5 text-[#7B1FA2]" />
                      <span>Credit/Debit</span>
                    </button>

                    <button
                      id="tab-cash"
                      onClick={() => {
                        soundFX.playClick();
                        setActiveTab('CASH');
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                        activeTab === 'CASH'
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Banknote className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>Cash on Exit</span>
                    </button>
                  </div>

                  {/* TAB 1: UPI QR CODE */}
                  {activeTab === 'UPI' && (
                    <div className="text-center py-2 animate-fade-in">
                      
                      {/* Pulsing Countdown Timer requested */}
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold mb-4">
                        <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        <span>Scan within <strong className="font-mono font-extrabold text-amber-900">{formatTimer(countdownSeconds)}</strong></span>
                      </div>

                      {/* Scannable Mock QR Code Display */}
                      <div className="mx-auto w-48 h-48 p-2.5 bg-white border-2 border-slate-800/20 rounded-2xl shadow-inner flex flex-col items-center justify-center relative mb-4">
                        <div className="w-full h-full bg-[#FAFDFB] rounded-xl flex flex-col items-center justify-center p-2 border border-slate-200 relative overflow-hidden">
                          <svg viewBox="0 0 100 100" className="w-38 h-38">
                            <rect x="0" y="0" width="30" height="30" fill="#1E293B" rx="3" />
                            <rect x="5" y="5" width="20" height="20" fill="#FFFFFF" rx="2" />
                            <rect x="10" y="10" width="10" height="10" fill="#00838F" />

                            <rect x="70" y="0" width="30" height="30" fill="#1E293B" rx="3" />
                            <rect x="75" y="5" width="20" height="20" fill="#FFFFFF" rx="2" />
                            <rect x="80" y="10" width="10" height="10" fill="#00838F" />

                            <rect x="0" y="70" width="30" height="30" fill="#1E293B" rx="3" />
                            <rect x="5" y="75" width="20" height="20" fill="#FFFFFF" rx="2" />
                            <rect x="10" y="80" width="10" height="10" fill="#00838F" />

                            <circle cx="45" cy="15" r="3" fill="#1E293B" />
                            <circle cx="55" cy="20" r="3" fill="#1E293B" />
                            <circle cx="40" cy="35" r="3" fill="#2E7D32" />
                            <circle cx="50" cy="50" r="4" fill="#00838F" />
                            <circle cx="60" cy="40" r="3" fill="#1E293B" />
                            <circle cx="35" cy="55" r="3" fill="#1E293B" />
                            <circle cx="50" cy="65" r="3" fill="#2E7D32" />
                            <circle cx="65" cy="60" r="3" fill="#1E293B" />
                            <circle cx="45" cy="85" r="3" fill="#1E293B" />
                            <circle cx="60" cy="80" r="3" fill="#00838F" />
                            <circle cx="85" cy="45" r="3" fill="#1E293B" />
                            <circle cx="85" cy="65" r="3" fill="#1E293B" />
                          </svg>

                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="p-1 bg-white rounded shadow text-[9px] font-black text-[#00838F]">GOKART</span>
                          </div>
                        </div>
                      </div>

                      {/* VPA Address & App badges */}
                      <p className="text-xs font-mono text-slate-700 font-semibold mb-2">
                        UPI ID: <span className="text-[#00838F]">gokart.ai.trolley04@icici</span>
                      </p>
                      
                      <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 mb-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">GPay</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">PhonePe</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Paytm</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">BHIM</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CREDIT / DEBIT CARD */}
                  {activeTab === 'CARD' && (
                    <div className="space-y-4 py-2 animate-fade-in text-xs">
                      {/* Virtual Card Graphic */}
                      <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 text-white shadow-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-xs tracking-wider text-slate-300">SMART CART CARD</span>
                          <span className="text-xs font-bold text-amber-400">EMV Contactless</span>
                        </div>
                        <div className="font-mono text-base tracking-widest font-black text-slate-100">
                          {cardNumber}
                        </div>
                        <div className="flex justify-between items-end text-[10px] text-slate-300 font-mono">
                          <div>
                            <span className="block text-[8px] text-slate-400 uppercase">Cardholder</span>
                            <span className="font-bold">{cardHolder}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-slate-400 uppercase">Expires</span>
                            <span className="font-bold">{cardExpiry}</span>
                          </div>
                        </div>
                      </div>

                      {/* Mock Form Inputs */}
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B1FA2]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry Date</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B1FA2]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">CVV / CVC</label>
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B1FA2]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CASH ON EXIT */}
                  {activeTab === 'CASH' && (
                    <div className="text-center py-4 space-y-3 animate-fade-in text-xs">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto text-2xl">
                        💵
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-800">
                        Assistance Counter Checkout Slip
                      </h4>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Present this session voucher at <strong className="text-slate-800">Exit Kiosk #3</strong> to pay via physical currency or gift vouchers.
                      </p>
                      
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-700">
                        <p>Slip ID: <strong className="text-slate-900">{transactionId}</strong></p>
                        <p>Trolley #04 • Cash Desk 3</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Requested Action Button */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    id="simulate-payment-btn"
                    onClick={() => handleExecutePayment(activeTab)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#00838F] via-[#2E7D32] to-[#7B1FA2] hover:brightness-105 active:scale-[0.99] text-white font-extrabold text-sm tracking-wide shadow-md shadow-emerald-900/10 flex items-center justify-center space-x-2 transition"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>Simulate Successful Payment ({formatPrice(finalTotalINR, finalTotalUSD)})</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
