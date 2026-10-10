import React from 'react';
import { 
  Scale, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  HelpCircle,
  Activity,
  Sliders
} from 'lucide-react';
import { soundFX } from '../../utils/audio';

export default function WeightVerificationCard({
  expectedWeight,
  measuredWeight,
  mismatchDeviation,
  onTriggerMismatch,
  onCalibrateReset,
  hasMismatchAlert
}) {
  const tolerance = 15; // grams tolerance for sensor noise
  const deviation = measuredWeight - expectedWeight;
  const isBalanced = Math.abs(deviation) <= tolerance;

  // Gauge percentage calculation (center is 50%)
  // Range: -200g to +200g deviation
  const maxDeviationRange = 200;
  const clampedDev = Math.max(-maxDeviationRange, Math.min(maxDeviationRange, deviation));
  const gaugePercent = 50 + (clampedDev / (maxDeviationRange * 2)) * 100;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-slate-200/80 transition-all">
      
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-xl border transition-colors ${
            hasMismatchAlert 
              ? 'bg-rose-100 text-rose-700 border-rose-200' 
              : 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
          }`}>
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Load Cell Weight Verification
              </h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                HX711 24-Bit ADC
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Anti-Theft Real-Time Strain Gauge Mesh
            </p>
          </div>
        </div>

        {/* Lock / Security State indicator */}
        <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
          hasMismatchAlert
            ? 'bg-rose-50 text-rose-700 border-rose-300'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}>
          {hasMismatchAlert ? (
            <>
              <Lock className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>Brakes Engaged</span>
            </>
          ) : (
            <>
              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Trolley Unlocked</span>
            </>
          )}
        </div>
      </div>

      {/* WEIGHT DISPLAY COMPARISON BOX */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Expected Weight Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Expected</span>
            <span className="text-[10px] bg-slate-200/80 px-1.5 py-0.5 rounded font-mono">From Cart</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-mono tracking-tight">
              {expectedWeight}
            </span>
            <span className="text-xs font-bold text-slate-500">g</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Catalog items sum</p>
        </div>

        {/* Measured Weight Card */}
        <div className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
          hasMismatchAlert
            ? 'bg-rose-50 border-rose-300 shadow-sm'
            : 'bg-[#E8F5E9]/60 border-[#C8E6C9]'
        }`}>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Measured Weight</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
              hasMismatchAlert ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'
            }`}>
              4-Load Cells
            </span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
              hasMismatchAlert ? 'text-rose-600' : 'text-emerald-700'
            }`}>
              {measuredWeight}
            </span>
            <span className="text-xs font-bold text-slate-500">g</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {deviation === 0 ? 'Exact match' : `${deviation > 0 ? '+' : ''}${deviation}g deviation`}
          </p>
        </div>
      </div>

      {/* VISUAL WEIGHT GAUGE / PROGRESS BAR */}
      <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-slate-500" />
            Load Cell Balance Gauge
          </span>
          <span className={`font-bold font-mono text-[11px] ${
            hasMismatchAlert ? 'text-rose-600' : 'text-emerald-700'
          }`}>
            {hasMismatchAlert ? `Mismatch (Δ ${deviation > 0 ? '+' : ''}${deviation}g)` : 'Weight Balanced (Verified)'}
          </span>
        </div>

        {/* Visual Gauge Bar */}
        <div className="relative h-4 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
          {/* Safe green tolerance zone in middle */}
          <div className="absolute left-[45%] right-[45%] top-0 bottom-0 bg-emerald-300/40 border-x border-emerald-400 z-0"></div>

          {/* Current balance indicator needle/marker */}
          <div 
            className={`absolute top-0 bottom-0 w-3 rounded-full shadow-md transition-all duration-300 -translate-x-1/2 z-10 ${
              hasMismatchAlert ? 'bg-rose-500 shadow-rose-300' : 'bg-emerald-500 shadow-emerald-300'
            }`}
            style={{ left: `${gaugePercent}%` }}
          ></div>
        </div>

        {/* Gauge labels */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
          <span>-200g</span>
          <span className="text-emerald-600 font-bold">Target Zone (±15g)</span>
          <span>+200g</span>
        </div>
      </div>

      {/* RED SECURITY ALERT BANNER (When Weight Anomaly is Detected) */}
      {hasMismatchAlert && (
        <div className="mb-4 p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 shadow-alert-glow animate-alert-banner transition-all">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0 mt-0.5 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-rose-800 tracking-tight">
                  Weight Anomaly Detected! Security Alert
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-800">
                  CRITICAL
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                Measured weight differs by <strong className="font-bold">+{mismatchDeviation}g</strong> from scanned cart manifest. 
                Possible un-scanned item dropped into trolley!
              </p>
              <div className="mt-2.5 flex items-center space-x-2 text-[11px] font-medium text-rose-800 bg-white/70 px-3 py-1.5 rounded-xl border border-rose-200">
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span>Smart Brakes Engaged. Trolley wheels automatically locked.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANTI-THEFT TEST CONTROLS */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            Anti-Theft Simulation Controls
          </span>
          <span className="text-[11px] text-slate-400">Test security protocols</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* Primary requested test button: "+50g Mismatch" */}
          <button
            id="trigger-mismatch-50-btn"
            onClick={() => onTriggerMismatch(50)}
            className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition shadow-xs active:scale-95"
            title="Simulate un-scanned 50g item dropped into cart"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+50g Mismatch</span>
          </button>

          {/* Heavy item mismatch test button */}
          <button
            id="trigger-mismatch-150-btn"
            onClick={() => onTriggerMismatch(150)}
            className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition shadow-xs active:scale-95"
            title="Simulate un-scanned 150g item dropped into cart"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+150g Mismatch</span>
          </button>

          {/* Primary requested test button: "Calibrate / Reset" */}
          <button
            id="calibrate-reset-btn"
            onClick={onCalibrateReset}
            className="col-span-2 sm:col-span-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#E8F5E9] hover:bg-[#C8E6C9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold transition shadow-xs active:scale-95"
            title="Reset deviation to 0g and recalibrate load cell zero"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Calibrate / Reset</span>
          </button>
        </div>
      </div>

    </div>
  );
}
