import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  ShieldAlert, 
  ShieldCheck,
  Cpu, 
  Battery, 
  Scale, 
  ShoppingCart, 
  Search, 
  Eye, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Activity,
  Layers,
  Sliders,
  Lock,
  ArrowRight
} from 'lucide-react';
import { soundFX } from '../../utils/audio';
import ActivityAuditLog from './ActivityAuditLog';
import TrolleyInspectModal from './TrolleyInspectModal';
import SecurityAuditModal from './SecurityAuditModal';

export default function AdminDashboard({
  trolleys,
  logs,
  onClearLogs,
  currency,
  onInspectTrolley,
  inspectedTrolley,
  onCloseInspect,
  onResolveTrolleyMismatch,
  onSimulateFleetActivity,
  onTriggerSecurityLock
}) {
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'ALERTS'
  const [auditingTrolley, setAuditingTrolley] = useState(null);

  const activeTrolleysCount = trolleys.filter(t => t.status === 'Active').length;
  const totalFleetCount = trolleys.length;
  
  const totalRevenueINR = trolleys.reduce((acc, t) => acc + (t.totalINR || 0), 48500);
  const totalRevenueUSD = trolleys.reduce((acc, t) => acc + (t.totalUSD || 0), 610.50);

  const activeAlertsCount = trolleys.filter(t => !t.isBalanced).length;

  const formatPrice = (inr, usd) => {
    return currency === 'INR' ? `₹${inr.toLocaleString()}` : `$${usd.toFixed(2)}`;
  };

  const filteredTrolleys = trolleys.filter(t => {
    if (selectedFilter === 'ACTIVE') return t.status === 'Active';
    if (selectedFilter === 'ALERTS') return !t.isBalanced;
    return true;
  });

  const handleOpenAudit = (trolley) => {
    soundFX.playClick();
    setAuditingTrolley(trolley);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. KEY METRICS DASHBOARD CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Active Trolleys */}
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-200/80 hover:shadow-soft-lg transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Trolleys
            </span>
            <div className="p-2 rounded-2xl bg-[#E0F7FA] text-[#00838F] border border-[#B2EBF2] group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
              {activeTrolleysCount}/{totalFleetCount + 4}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              40% Floor Load
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>{totalFleetCount - activeTrolleysCount} Docked & Idle</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#00838F] font-semibold">10 Bays Total</span>
          </div>
        </div>

        {/* Metric 2: Today's Total Revenue */}
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-200/80 hover:shadow-soft-lg transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today&apos;s Total Revenue
            </span>
            <div className="p-2 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900 font-mono tracking-tight text-emerald-800">
              {formatPrice(totalRevenueINR, totalRevenueUSD)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span className="text-emerald-600 font-semibold">+18.4% vs Yesterday</span>
            <span className="text-slate-300">•</span>
            <span>142 Checkouts</span>
          </div>
        </div>

        {/* Metric 3: Active Theft / Weight Mismatch Alerts (INTERACTIVE CLICKABLE) */}
        <div 
          onClick={() => {
            if (activeAlertsCount > 0) {
              const alerted = trolleys.find(t => !t.isBalanced);
              if (alerted) handleOpenAudit(alerted);
            }
          }}
          className={`rounded-3xl p-5 shadow-soft border transition-all group cursor-pointer ${
            activeAlertsCount > 0 
              ? 'bg-rose-50/80 border-rose-400 shadow-alert-glow hover:bg-rose-100/80' 
              : 'bg-white border-slate-200/80'
          }`}
          title={activeAlertsCount > 0 ? "Click to open Security Audit & Override Console" : "Zero active alerts"}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-bold uppercase tracking-wider ${
              activeAlertsCount > 0 ? 'text-rose-700' : 'text-slate-500'
            }`}>
              Active Theft Alerts
            </span>
            <div className={`p-2 rounded-2xl border transition-colors group-hover:scale-110 ${
              activeAlertsCount > 0 
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse' 
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-3xl font-black font-mono tracking-tight ${
              activeAlertsCount > 0 ? 'text-rose-600' : 'text-slate-900'
            }`}>
              {activeAlertsCount}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              activeAlertsCount > 0 ? 'bg-rose-200 text-rose-800' : 'bg-emerald-50 text-emerald-700'
            }`}>
              {activeAlertsCount > 0 ? 'Click to Audit' : '0 Anomalies'}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
            {activeAlertsCount > 0 ? (
              <>
                <span className="text-rose-600 font-bold truncate">Trolley #02 Mismatch (+120g)</span>
                <span className="text-rose-700 text-[10px] font-bold underline shrink-0">Open Audit →</span>
              </>
            ) : (
              <span>All load cell thresholds balanced</span>
            )}
          </div>
        </div>

        {/* Metric 4: System Status */}
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-200/80 hover:shadow-soft-lg transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              System Status
            </span>
            <div className="p-2 rounded-2xl bg-[#F3E5F5] text-[#7B1FA2] border border-[#E1BEE7] group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              Mesh 99.98%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>YOLOv9 CV Core</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-600 font-bold">Operational</span>
          </div>
        </div>

      </div>

      {/* 2. REAL-TIME TROLLEY GRID (TROLLEY #01 THROUGH #06) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-slate-200/80 transition-all">
        
        {/* Section Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#E0F7FA] text-[#00838F] border border-[#B2EBF2]">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Real-Time Trolley Fleet Grid
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live telemetry monitoring for autonomous shopping carts #01 through #06
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            {/* Filter buttons */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setSelectedFilter('ALL')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  selectedFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All (6)
              </button>
              <button
                onClick={() => setSelectedFilter('ACTIVE')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  selectedFilter === 'ACTIVE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setSelectedFilter('ALERTS')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  selectedFilter === 'ALERTS' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Alerts ({activeAlertsCount})
              </button>
            </div>

            {/* Simulate Fleet Activity */}
            <button
              onClick={() => {
                soundFX.playClick();
                onSimulateFleetActivity();
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition flex items-center space-x-1"
              title="Simulate random fleet sensor packet update"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Simulate Packet</span>
            </button>
          </div>
        </div>

        {/* TROLLEYS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {filteredTrolleys.map((trolley) => {
            const hasMismatch = !trolley.isBalanced;

            return (
              <div
                key={trolley.id}
                className={`rounded-2xl p-4.5 border transition-all duration-200 relative flex flex-col justify-between ${
                  hasMismatch
                    ? 'bg-rose-50/70 border-rose-300 shadow-alert-glow'
                    : trolley.isCurrentTrolley
                    ? 'bg-[#E0F7FA]/30 border-[#80DEEA] shadow-xs'
                    : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200/80 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Current trolley indicator badge */}
                {trolley.isCurrentTrolley && (
                  <div className="absolute -top-2.5 right-4 bg-[#00838F] text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                    Current Demo Session
                  </div>
                )}

                {/* Card Top: Trolley ID, Battery, Status */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🛒</span>
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-['Outfit']">
                          {trolley.id}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {trolley.customer || 'Unassigned'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Battery Badge */}
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold ${
                        trolley.battery < 30 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Battery className="w-3 h-3 text-emerald-600" />
                        <span>{trolley.battery}%</span>
                      </span>

                      {/* Status Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        trolley.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {trolley.status}
                      </span>
                    </div>
                  </div>

                  {/* Trolley Telemetry Row: Items, Total, Location */}
                  <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-white/80 border border-slate-200/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Live Items</span>
                      <p className="font-extrabold text-slate-800 mt-0.5">
                        {trolley.itemCount} items ({trolley.weightMeasured}g)
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Cart Total</span>
                      <p className="font-extrabold text-slate-900 font-mono mt-0.5">
                        {formatPrice(trolley.totalINR, trolley.totalUSD)}
                      </p>
                    </div>
                  </div>

                  {/* Load Cell Balance Status: Interactive for Mismatch alerts */}
                  <div 
                    onClick={() => {
                      if (hasMismatch) handleOpenAudit(trolley);
                    }}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between mb-4 transition ${
                      hasMismatch
                        ? 'bg-rose-100 border-rose-300 text-rose-800 cursor-pointer hover:bg-rose-200/80 shadow-xs'
                        : 'bg-[#E8F5E9]/80 border-[#C8E6C9] text-[#2E7D32]'
                    }`}
                    title={hasMismatch ? "Click to open Audit & Override Modal" : "Weight balanced"}
                  >
                    <div className="flex items-center space-x-1.5">
                      {hasMismatch ? (
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 animate-pulse" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0" />
                      )}
                      <span className="font-bold">
                        {hasMismatch ? 'Mismatch Alert (Click to Audit)' : 'Weight Balanced'}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] font-semibold">
                      {hasMismatch ? `+${trolley.mismatchDeviation || 120}g deviation` : 'Verified ±0g'}
                    </span>
                  </div>
                </div>

                {/* Card Actions: Primary Inspect + Dedicated Audit & Override when red */}
                <div className="space-y-2">
                  {hasMismatch ? (
                    <button
                      id={`audit-${trolley.id.replace(/[^a-zA-Z0-9]/g, '')}`}
                      onClick={() => handleOpenAudit(trolley)}
                      className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm animate-pulse"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Audit & Override Anomaly</span>
                    </button>
                  ) : null}

                  <button
                    id={`inspect-${trolley.id.replace(/[^a-zA-Z0-9]/g, '')}`}
                    onClick={() => {
                      soundFX.playClick();
                      onInspectTrolley(trolley);
                    }}
                    className="w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-xs bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Trolley Telemetry</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 3. LIVE SECURITY & ACTIVITY LOG */}
      <ActivityAuditLog logs={logs} onClearLogs={onClearLogs} />

      {/* TROLLEY TELEMETRY INSPECTION MODAL */}
      {inspectedTrolley && (
        <TrolleyInspectModal
          trolley={inspectedTrolley}
          onClose={onCloseInspect}
          currency={currency}
          onResolveTrolleyMismatch={onResolveTrolleyMismatch}
        />
      )}

      {/* ADMIN SECURITY AUDIT & OVERRIDE MODAL (Requirement 2) */}
      <SecurityAuditModal
        isOpen={Boolean(auditingTrolley)}
        trolley={auditingTrolley}
        onClose={() => setAuditingTrolley(null)}
        onApproveOverride={(trolleyId) => {
          onResolveTrolleyMismatch(trolleyId);
        }}
        onTriggerSecurityLock={(trolleyId, reason) => {
          if (onTriggerSecurityLock) {
            onTriggerSecurityLock(trolleyId, reason);
          }
        }}
      />

    </div>
  );
}
