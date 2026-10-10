import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Cpu, 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  Volume2, 
  VolumeX, 
  User, 
  LayoutDashboard, 
  Sparkles, 
  Wifi, 
  Smartphone, 
  QrCode, 
  LogOut, 
  Home
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function Navbar({
  currentView,
  setCurrentView,
  soundEnabled,
  setSoundEnabled,
  currency,
  setCurrency,
  hasMismatchAlert,
  activeAlertCount,
  isSocketConnected,
  onOpenMobilePairing,
  currentUser,
  onLogout
}) {
  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundFX.toggleSound(newState);
    if (newState) soundFX.playClick();
  };

  const handleViewChange = (view) => {
    soundFX.playClick();
    setCurrentView(view);
  };

  const handleLogoutClick = () => {
    soundFX.playClick();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Branding (Clickable to return Home) */}
          <div 
            onClick={handleLogoutClick}
            className="flex items-center space-x-3.5 cursor-pointer group"
            title="Return to Landing Page"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00838F] via-[#2E7D32] to-[#7B1FA2] p-0.5 shadow-md shadow-emerald-900/10 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-[#00838F]" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-['Outfit']">
                  Gokart <span className="bg-gradient-to-r from-[#00838F] to-[#2E7D32] bg-clip-text text-transparent">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-[#E0F7FA] text-[#00838F] rounded-full border border-[#B2EBF2]">
                  <Sparkles className="w-3 h-3 mr-1 text-[#00838F]" />
                  v2.4 Smart Cart
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 tracking-tight flex items-center gap-1.5">
                <span>Autonomous Vision Checkout</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                <span>Socket.io Real-Time Bridge</span>
              </p>
            </div>
          </div>

          {/* Center: Live Connection & Socket.io Status */}
          <div className="hidden lg:flex items-center space-x-3 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isSocketConnected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isSocketConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}></span>
              </span>
              <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-slate-500" />
                Socket.io Bridge: <span className="font-semibold text-slate-900">{isSocketConnected ? 'Connected (Port 5000)' : 'Connecting...'}</span>
              </span>
            </div>
            
            <div className="h-3 w-px bg-slate-300"></div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>&lt;200ms Latency</span>
              <span className="text-slate-400">•</span>
              <span>Load Cell Calibrated</span>
            </div>

            {hasMismatchAlert && (
              <span className="animate-pulse inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300">
                <ShieldAlert className="w-3 h-3 mr-1 text-rose-600" />
                Alert Active
              </span>
            )}
          </div>

          {/* Right: Controls & Mode Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* Connect Phone Scanner Button (Opens QR pairing modal) */}
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenMobilePairing();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-emerald-300/80 bg-emerald-50 hover:bg-emerald-100/70 text-[#2E7D32] text-xs font-bold transition shadow-xs"
              title="Pair Smartphone via QR Code"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phone Scanner</span>
              <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            {/* Currency Switcher */}
            <button
              onClick={() => {
                soundFX.playClick();
                setCurrency(currency === 'INR' ? 'USD' : 'INR');
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition shadow-xs flex items-center space-x-1"
              title="Toggle Currency (₹ INR / $ USD)"
            >
              <span className="text-slate-400 font-normal">Cur:</span>
              <span className="text-[#00838F] font-bold">{currency === 'INR' ? '₹ INR' : '$ USD'}</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition shadow-xs ${
                soundEnabled 
                  ? 'bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32] hover:bg-[#C8E6C9]/40' 
                  : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
              }`}
              title={soundEnabled ? "Mute audio sound effects" : "Unmute audio sound effects"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Mode Switcher Toggle: Customer View vs Admin View vs Mobile Scanner */}
            <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-inner">
              <button
                id="mode-customer-btn"
                onClick={() => handleViewChange('customer')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  currentView === 'customer'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#00838F]" />
                <span>Customer</span>
              </button>

              <button
                id="mode-admin-btn"
                onClick={() => handleViewChange('admin')}
                className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  currentView === 'admin'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#7B1FA2]" />
                <span>Admin</span>
                {activeAlertCount > 0 && (
                  <span className="flex items-center justify-center ml-1 px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-rose-500 text-white animate-pulse">
                    {activeAlertCount}
                  </span>
                )}
              </button>

              <button
                id="mode-mobile-btn"
                onClick={() => handleViewChange('mobile')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  currentView === 'mobile'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Mobile Phone Simulator View"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Mobile UI</span>
              </button>
            </div>

            {/* LOGOUT / EXIT SESSION BUTTON (Prompt Requirement 3) */}
            <button
              id="logout-session-btn"
              onClick={handleLogoutClick}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition shadow-xs"
              title="Exit current session and return to Landing Page"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden md:inline">Exit Session</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
