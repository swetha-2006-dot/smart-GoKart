import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  KeyRound, 
  ShoppingCart, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { soundFX } from '../../utils/audio';

export default function AuthModal({
  isOpen,
  onClose,
  initialRole = 'customer', // 'customer' or 'admin'
  onLoginSuccess
}) {
  const [role, setRole] = useState(initialRole); // 'customer' or 'admin'
  
  // Customer Login State
  const [customerContact, setCustomerContact] = useState('');
  const [customerTrolley, setCustomerTrolley] = useState('trolley_04');

  // Admin Login State
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Pre-fill Customer Demo Credentials
  const fillCustomerDemo = () => {
    soundFX.playClick();
    setCustomerContact('9876543210');
    setCustomerTrolley('trolley_04');
    setErrorMsg('');
  };

  // Pre-fill Admin Demo Credentials
  const fillAdminDemo = () => {
    soundFX.playClick();
    setAdminUsername('admin@gokart.ai');
    setAdminPassword('admin123');
    setAdminPin('1234');
    setErrorMsg('');
  };

  // Handle Customer Form Submission
  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (!customerContact.trim()) {
      setErrorMsg('Please enter your mobile number or email address');
      return;
    }
    soundFX.playVerified();
    onLoginSuccess({
      role: 'customer',
      contact: customerContact,
      trolleyId: customerTrolley,
      trolleyName: customerTrolley === 'trolley_04' ? 'Trolley #04' : customerTrolley.replace('_', ' ').toUpperCase(),
      name: 'Customer Guest'
    });
  };

  // Handle Admin Form Submission
  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (!adminUsername.trim() || !adminPassword.trim() || !adminPin.trim()) {
      setErrorMsg('Please fill in your Admin ID, Password, and Manager PIN');
      return;
    }
    soundFX.playVerified();
    onLoginSuccess({
      role: 'admin',
      username: adminUsername,
      name: 'Store Manager (Admin)'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative animate-scale-up">
        
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl shadow-xs">
              🛒
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base tracking-tight font-['Outfit']">
                  Gokart AI Authentication
                </h3>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#E0F7FA] text-[#00838F]">
                  v2.4
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Choose your portal access role below
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* Dual-Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl mb-5">
            <button
              onClick={() => {
                soundFX.playClick();
                setRole('customer');
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                role === 'customer'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#00838F]" />
              <span>Customer Portal</span>
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setRole('admin');
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                role === 'admin'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#7B1FA2]" />
              <span>Admin Console</span>
            </button>
          </div>

          {/* Error Message notice if any */}
          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* 1. CUSTOMER LOGIN FORM */}
          {role === 'customer' ? (
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              
              {/* Pre-filled Quick Demo Credentials Badge (Prompt Requirement 2a) */}
              <div 
                onClick={fillCustomerDemo}
                className="p-3 rounded-2xl bg-[#E0F7FA]/70 hover:bg-[#E0F7FA] border border-[#B2EBF2] cursor-pointer transition flex items-center justify-between group"
                title="Click to auto-fill demo customer credentials"
              >
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-[#00838F] text-white">
                    <Zap className="w-3 h-3" />
                  </span>
                  <div className="text-left text-xs">
                    <span className="font-extrabold text-[#00838F] block">Quick Demo Credentials</span>
                    <span className="text-[11px] text-slate-600 font-mono">Phone: 9876543210 • Trolley #04</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#00838F] bg-white px-2 py-0.5 rounded-full border border-[#B2EBF2] group-hover:bg-[#00838F] group-hover:text-white transition">
                  Auto-Fill
                </span>
              </div>

              {/* Mobile / Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number / Email Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter phone e.g. 9876543210"
                    value={customerContact}
                    onChange={(e) => setCustomerContact(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00838F] font-medium"
                  />
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Trolley Selection Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Smart Trolley (Floor Unit)
                </label>
                <div className="relative">
                  <select
                    value={customerTrolley}
                    onChange={(e) => setCustomerTrolley(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00838F] font-bold text-slate-800"
                  >
                    <option value="trolley_04">Trolley #04 (Active Live Demo)</option>
                    <option value="trolley_01">Trolley #01 (Aisle 3 Beverages)</option>
                    <option value="trolley_02">Trolley #02 (Aisle 1 Produce)</option>
                    <option value="trolley_03">Trolley #03 (Dock Bay 2)</option>
                  </select>
                  <ShoppingCart className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Quick Login Button */}
              <button
                id="customer-login-btn"
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00838F] to-[#2E7D32] hover:brightness-105 active:scale-[0.99] text-white font-extrabold text-xs tracking-wide shadow-md transition flex items-center justify-center space-x-1.5"
              >
                <span>Start Shopping Session</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Instant self-checkout • Automated load-cell tare calibration
              </p>

            </form>
          ) : (
            /* 2. ADMIN LOGIN FORM */
            <form onSubmit={handleAdminSubmit} className="space-y-3.5">
              
              {/* Pre-filled Quick Demo Credentials Badge (Prompt Requirement 2b) */}
              <div 
                onClick={fillAdminDemo}
                className="p-3 rounded-2xl bg-[#F3E5F5]/70 hover:bg-[#F3E5F5] border border-[#E1BEE7] cursor-pointer transition flex items-center justify-between group"
                title="Click to auto-fill demo admin credentials"
              >
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-[#7B1FA2] text-white">
                    <Zap className="w-3 h-3" />
                  </span>
                  <div className="text-left text-xs">
                    <span className="font-extrabold text-[#7B1FA2] block">Quick Admin Credentials</span>
                    <span className="text-[11px] text-slate-600 font-mono">admin@gokart.ai • PIN: 1234</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#7B1FA2] bg-white px-2 py-0.5 rounded-full border border-[#E1BEE7] group-hover:bg-[#7B1FA2] group-hover:text-white transition">
                  Auto-Fill
                </span>
              </div>

              {/* Admin ID / Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin ID / Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. admin@gokart.ai"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B1FA2]"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter security password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B1FA2]"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Security PIN prompt for store managers */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Manager Security PIN (4-Digits)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="1234"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B1FA2]"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="admin-login-btn"
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-extrabold text-xs tracking-wide shadow-md transition flex items-center justify-center space-x-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Access Admin Analytics & Fleet</span>
              </button>

              <p className="text-[11px] text-center text-slate-400">
                256-Bit Encrypted Hardware Telemetry Dashboard
              </p>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
