import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  Battery, 
  Wifi, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Volume2, 
  RotateCcw, 
  Scale, 
  User, 
  MapPin, 
  Cpu,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { soundFX } from '../../utils/audio';

export default function TrolleyInspectModal({
  trolley,
  onClose,
  currency,
  onResolveTrolleyMismatch
}) {
  const [remoteBuzzerActive, setRemoteBuzzerActive] = useState(false);
  const [wheelUnlocked, setWheelUnlocked] = useState(trolley?.isBalanced);

  if (!trolley) return null;

  const handlePingBuzzer = () => {
    soundFX.playAlert();
    setRemoteBuzzerActive(true);
    setTimeout(() => setRemoteBuzzerActive(false), 2000);
  };

  const handleToggleLock = () => {
    soundFX.playClick();
    setWheelUnlocked(!wheelUnlocked);
  };

  const handleResolveAlert = () => {
    soundFX.playCalibrate();
    setWheelUnlocked(true);
    if (onResolveTrolleyMismatch) {
      onResolveTrolleyMismatch(trolley.id);
    }
  };

  const formatPrice = (inr, usd) => {
    return currency === 'INR' ? `₹${inr}` : `$${usd.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative animate-scale-up max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
              🛒
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-lg tracking-tight font-['Outfit']">
                  {trolley.id} Telemetry Inspection
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  trolley.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
                }`}>
                  {trolley.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Location: {trolley.location || 'Retail Floor'}</span>
                <span>•</span>
                <span>Customer: {trolley.customer || 'Walk-in'}</span>
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

        {/* Modal Body: Scrollable content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Status Alert Banner if Mismatch */}
          {!trolley.isBalanced && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-800 flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0 mt-0.5 animate-pulse">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Anti-Theft Weight Deviation Active</h4>
                  <p className="text-xs text-rose-700 mt-0.5">
                    Measured: <strong>{trolley.weightMeasured}g</strong> | Expected: <strong>{trolley.weightExpected}g</strong> (Deviation: +{trolley.mismatchDeviation || 50}g).
                  </p>
                  <p className="text-[11px] text-rose-600 mt-1">
                    Auto-brake solenoids clamped. Associate intervention or manual calibration required.
                  </p>
                </div>
              </div>

              <button
                onClick={handleResolveAlert}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 shadow-sm transition"
              >
                Clear Alarm & Calibrate
              </button>
            </div>
          )}

          {/* Telemetry Hardware Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] mb-1">
                <Battery className="w-3.5 h-3.5 text-emerald-600" />
                <span>LiFePO4 Cell</span>
              </div>
              <div className="text-lg font-extrabold text-slate-800 font-mono">
                {trolley.battery}%
              </div>
              <span className="text-[10px] text-slate-400">12.6V • 42°C</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] mb-1">
                <Scale className="w-3.5 h-3.5 text-[#00838F]" />
                <span>Load Cells (x4)</span>
              </div>
              <div className="text-lg font-extrabold text-slate-800 font-mono">
                {trolley.weightMeasured}g
              </div>
              <span className="text-[10px] text-slate-400">HX711 24-bit ADC</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] mb-1">
                <Wifi className="w-3.5 h-3.5 text-blue-600" />
                <span>Mesh Link</span>
              </div>
              <div className="text-lg font-extrabold text-slate-800 font-mono">
                -52 dBm
              </div>
              <span className="text-[10px] text-slate-400">Latency: 11ms</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] mb-1">
                <Lock className="w-3.5 h-3.5 text-purple-600" />
                <span>Brake Solenoid</span>
              </div>
              <div className={`text-sm font-extrabold font-mono ${
                wheelUnlocked ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {wheelUnlocked ? 'DISENGAGED' : 'LOCKED'}
              </div>
              <span className="text-[10px] text-slate-400">Wheel Lock Servo</span>
            </div>
          </div>

          {/* Load Cell Sensor Raw Diagnostic Curve */}
          <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>LIVE LOAD-CELL STRAIN GAUGE GRAPH (4-CORNER BRIDGE)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Sample Rate: 80 Hz
              </span>
            </div>

            {/* Simulated live visual sensor bars */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400">Front Left</span>
                <p className="text-sm font-bold text-emerald-400 mt-1">
                  {Math.round(trolley.weightMeasured * 0.24)}g
                </p>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400">Front Right</span>
                <p className="text-sm font-bold text-emerald-400 mt-1">
                  {Math.round(trolley.weightMeasured * 0.26)}g
                </p>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '52%' }}></div>
                </div>
              </div>

              <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400">Rear Left</span>
                <p className="text-sm font-bold text-emerald-400 mt-1">
                  {Math.round(trolley.weightMeasured * 0.25)}g
                </p>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '48%' }}></div>
                </div>
              </div>

              <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400">Rear Right</span>
                <p className="text-sm font-bold text-emerald-400 mt-1">
                  {Math.round(trolley.weightMeasured * 0.25)}g
                </p>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '49%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Manifest in Trolley */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Itemized Manifest ({trolley.itemCount || 0} Items)
            </h4>
            
            {trolley.items && trolley.items.length > 0 ? (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                {trolley.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 px-3 flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">{it.name} (x{it.qty})</span>
                    <span className="font-mono text-slate-500">{it.weight}g</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl border border-slate-200">
                No active items currently in trolley manifest.
              </p>
            )}
          </div>

          {/* Remote Admin Intervention Controls */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Remote Hardware Command Actions
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                onClick={handlePingBuzzer}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                  remoteBuzzerActive
                    ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                <span>{remoteBuzzerActive ? 'Buzzer Ringing!' : 'Ping Audio Buzzer'}</span>
              </button>

              <button
                onClick={handleToggleLock}
                className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition"
              >
                {wheelUnlocked ? <Lock className="w-3.5 h-3.5 text-rose-600" /> : <Unlock className="w-3.5 h-3.5 text-emerald-600" />}
                <span>{wheelUnlocked ? 'Force Lock Wheels' : 'Unlock Wheels'}</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  onClose();
                }}
                className="col-span-2 sm:col-span-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition"
              >
                <span>Close Inspector</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
