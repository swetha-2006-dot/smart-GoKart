import React, { useState } from 'react';
import { 
  Receipt, 
  QrCode, 
  CheckCircle, 
  CreditCard, 
  Sparkles, 
  X, 
  ShieldCheck, 
  Printer, 
  ArrowRight,
  ShieldAlert,
  Smartphone,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../../utils/audio';

export default function BillingBreakdown({
  cartItems,
  currency,
  hasMismatchAlert,
  onResetSession,
  onOpenCheckoutModal
}) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'processing', 'success'
  const [transactionId, setTransactionId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Calculations
  const subtotalINR = cartItems.reduce((acc, item) => acc + (item.priceINR * item.quantity), 0);
  const subtotalUSD = cartItems.reduce((acc, item) => acc + (item.priceUSD * item.quantity), 0);

  const taxRate = 0.05; // 5% GST
  const taxINR = Math.round(subtotalINR * taxRate);
  const taxUSD = Number((subtotalUSD * taxRate).toFixed(2));

  // Smart Cart Bag / Platform fee
  const platformFeeINR = cartItems.length > 0 ? 2 : 0;
  const platformFeeUSD = cartItems.length > 0 ? 0.05 : 0;

  const totalINR = subtotalINR + taxINR + platformFeeINR;
  const totalUSD = Number((subtotalUSD + taxUSD + platformFeeUSD).toFixed(2));

  const formatPrice = (priceINR, priceUSD) => {
    return currency === 'INR' ? `₹${priceINR}` : `$${priceUSD.toFixed(2)}`;
  };

  const handleOpenPayment = () => {
    if (cartItems.length === 0) return;
    soundFX.playClick();
    if (onOpenCheckoutModal) {
      onOpenCheckoutModal();
      return;
    }
    setTransactionId(`TXN-GK${Math.floor(100000 + Math.random() * 900000)}`);
    setPaymentStatus('pending');
    setShowPaymentModal(true);
  };

  const handleExecutePayment = () => {
    soundFX.playClick();
    setPaymentStatus('processing');

    setTimeout(() => {
      setPaymentStatus('success');
      soundFX.playPaymentSuccess();

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log("Confetti trigger:", e);
      }
    }, 1200);
  };

  const handleCloseModal = () => {
    soundFX.playClick();
    setShowPaymentModal(false);
    if (paymentStatus === 'success') {
      onResetSession();
    }
  };

  const handlePrintReceipt = () => {
    soundFX.playClick();
    window.print();
  };

  return (
    <>
      {/* Billing Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-slate-200/80 transition-all flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
              <Receipt className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Billing Breakdown
            </h3>
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            Instant Self-Checkout
          </span>
        </div>

        {/* Breakdown Items */}
        <div className="py-3.5 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
            <span className="font-semibold text-slate-900">{formatPrice(subtotalINR, subtotalUSD)}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span className="flex items-center gap-1">
              Estimated Tax (GST 5%)
            </span>
            <span className="font-semibold text-slate-900">{formatPrice(taxINR, taxUSD)}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Smart Bag / Cloud Sync Fee</span>
            <span className="font-semibold text-slate-900">{formatPrice(platformFeeINR, platformFeeUSD)}</span>
          </div>

          <div className="h-px bg-slate-200 my-2"></div>

          <div className="flex justify-between items-baseline pt-1">
            <div>
              <span className="text-sm font-extrabold text-slate-900">Final Total</span>
              <p className="text-[10px] text-slate-400">All taxes included</p>
            </div>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight text-emerald-800">
                {formatPrice(totalINR, totalUSD)}
              </span>
            </div>
          </div>
        </div>

        {/* Warning if weight mismatch */}
        {hasMismatchAlert && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="text-[11px] font-semibold">
              Checkout blocked: Resolve weight mismatch on Trolley #04 first.
            </span>
          </div>
        )}

        {/* Primary Checkout Button */}
        <button
          id="proceed-payment-btn"
          onClick={handleOpenPayment}
          disabled={cartItems.length === 0 || hasMismatchAlert}
          className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 ${
            cartItems.length === 0 || hasMismatchAlert
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-[#00838F] via-[#0097A7] to-[#2E7D32] text-white hover:brightness-105 active:scale-[0.99] shadow-pastel-cyan'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Proceed to UPI / QR Payment</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight font-['Outfit']">
                    {paymentStatus === 'success' ? 'Payment Verified!' : 'Trolley UPI Checkout'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Trolley #04 • Smart Self-Check
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              
              {paymentStatus === 'pending' && (
                <div className="text-center">
                  
                  {/* Amount Badge */}
                  <div className="mb-4">
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Amount Due</span>
                    <div className="text-3xl font-black text-slate-900 font-mono mt-0.5">
                      {formatPrice(totalINR, totalUSD)}
                    </div>
                  </div>

                  {/* QR Code Graphic Container */}
                  <div className="mx-auto w-52 h-52 p-3 bg-white border-2 border-slate-800/10 rounded-2xl shadow-inner flex flex-col items-center justify-center relative mb-4">
                    {/* Simulated High-Resolution Dynamic UPI QR SVG */}
                    <div className="w-full h-full bg-[#FAFAFA] rounded-xl flex flex-col items-center justify-center p-2 border border-slate-200 relative overflow-hidden">
                      <svg viewBox="0 0 100 100" className="w-40 h-40">
                        {/* Standard QR Matrix Elements */}
                        <rect x="0" y="0" width="30" height="30" fill="#1E293B" rx="3" />
                        <rect x="5" y="5" width="20" height="20" fill="#FFFFFF" rx="2" />
                        <rect x="10" y="10" width="10" height="10" fill="#00838F" />

                        <rect x="70" y="0" width="30" height="30" fill="#1E293B" rx="3" />
                        <rect x="75" y="5" width="20" height="20" fill="#FFFFFF" rx="2" />
                        <rect x="80" y="10" width="10" height="10" fill="#00838F" />

                        <rect x="0" y="70" width="30" height="30" fill="#1E293B" rx="3" />
                        <rect x="5" y="75" width="20" height="20" fill="#FFFFFF" rx="2" />
                        <rect x="10" y="80" width="10" height="10" fill="#00838F" />

                        {/* Data dots */}
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
                        <div className="p-1 bg-white rounded-lg shadow-sm border border-slate-200">
                          <span className="text-[10px] font-extrabold text-[#00838F]">GOKART</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* UPI Details */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs mb-4">
                    <p className="text-slate-500 font-mono text-[11px]">
                      UPI ID: <span className="font-bold text-slate-800">gokart.ai.trolley04@icici</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Compatible with PhonePe, Google Pay, Paytm, BHIM & Any UPI App
                    </p>
                  </div>

                  {/* Quick Simulation Action Button */}
                  <div className="space-y-2">
                    <button
                      id="simulate-upi-pay-btn"
                      onClick={handleExecutePayment}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md transition flex items-center justify-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Simulate UPI Payment (Instant Auth)</span>
                    </button>

                    <button
                      onClick={() => {
                        setPaymentMethod('CARD');
                        handleExecutePayment();
                      }}
                      className="w-full py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                      <span>Tap to Pay (NFC / Contactless Card)</span>
                    </button>
                  </div>

                </div>
              )}

              {paymentStatus === 'processing' && (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#00838F] border-t-transparent animate-spin mb-4"></div>
                  <h4 className="text-base font-bold text-slate-800">
                    Communicating with Payment Gateway...
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Verifying NPCI Settlement & Reconciling Load Cell Tare
                  </p>
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <CheckCircle className="w-9 h-9" />
                  </div>

                  <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                    Checkout Complete!
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gate exit barcode authorized. Thank you for shopping!
                  </p>

                  {/* Receipt Box */}
                  <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Receipt ID:</span>
                      <span className="font-bold text-slate-800">{transactionId}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Trolley:</span>
                      <span className="font-bold text-slate-800">#04 (Gate Barcode Armed)</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Amount Paid:</span>
                      <span className="font-bold text-emerald-700">{formatPrice(totalINR, totalUSD)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Method:</span>
                      <span className="font-bold text-slate-800">UPI (Instant)</span>
                    </div>
                    <div className="border-t border-slate-200 pt-1 text-[10px] text-slate-400">
                      Load Cell Tare Verified: 0.0g deviation
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 space-y-2">
                    <button
                      onClick={handlePrintReceipt}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-1.5 transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Tax Receipt</span>
                    </button>

                    <button
                      id="finish-session-btn"
                      onClick={handleCloseModal}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide shadow-md transition"
                    >
                      Start New Shopping Session
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </>
  );
}
