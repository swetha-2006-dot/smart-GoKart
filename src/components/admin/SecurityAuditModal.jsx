import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Scale, 
  Camera, 
  Eye, 
  UserCheck, 
  UserX, 
  Radio, 
  Activity, 
  Volume2, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import { soundFX } from '../../utils/audio';

export default function SecurityAuditModal({
  isOpen,
  onClose,
  trolley,
  onApproveOverride,
  onTriggerSecurityLock
}) {
  const [overrideApproved, setOverrideApproved] = useState(false);
  const [criticalLockTriggered, setCriticalLockTriggered] = useState(false);

  if (!isOpen || !trolley) return null;

  const expectedWeight = trolley.weightExpected || 1400;
  const measuredWeight = trolley.weightMeasured || (expectedWeight + (trolley.mismatchDeviation || 120));
  const variance = measuredWeight - expectedWeight;

  const handleApprove = () => {
    soundFX.playCalibrate();
    setOverrideApproved(true);
    setTimeout(() => {
      onApproveOverride(trolley.id);
      onClose();
    }, 1000);
  };

  const handleLockdown = () => {
    soundFX.playAlert();
    setCriticalLockTriggered(true);
    onTriggerSecurityLock(trolley.id, `Floor staff dispatched to ${trolley.location || 'Retail Floor'}. Trolley wheel motors clamped.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-scale-up max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className={`p-5 text-white flex items-center justify-between shrink-0 transition-colors ${
          criticalLockTriggered 
            ? 'bg-rose-950 border-b-2 border-rose-500 animate-pulse' 
            : 'bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-2xl ${
              criticalLockTriggered ? 'bg-rose-600 animate-bounce' : 'bg-rose-500'
            }`}>
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-lg tracking-tight font-['Outfit']">
                  Security Audit & Override Console
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/30 text-rose-300 border border-rose-400/40">
                  CRITICAL MISMATCH
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                <span>{trolley.id}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  {trolley.location || 'Aisle 1 (Produce)'}
                </span>
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* CRITICAL WARNING STATUS BANNER */}
          {criticalLockTriggered ? (
            <div className="p-4 rounded-2xl bg-rose-100 border-2 border-rose-500 text-rose-900 animate-alert-banner">
              <div className="flex items-center space-x-2.5">
                <Lock className="w-5 h-5 text-rose-700 animate-bounce" />
                <h4 className="text-sm font-extrabold">EMERGENCY SECURITY LOCKDOWN ENGAGED</h4>
              </div>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                Trolley wheel solenoids locked in place. Siren broadcasted. Floor security personnel dispatched to <strong>{trolley.location || 'Retail Floor'}</strong>.
              </p>
            </div>
          ) : overrideApproved ? (
            <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-500 text-emerald-900">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <h4 className="text-sm font-extrabold">OVERRIDE APPROVED: TARE RECALIBRATED</h4>
              </div>
              <p className="text-xs text-emerald-800 mt-1">
                False alarm acknowledged by Admin. Trolley status restored to Balanced (Green).
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">
                  Anti-Theft Load-Cell Anomaly Flagged by Node HX711-A2
                </span>
              </div>
              <span className="font-mono text-[10px] bg-rose-200 px-2 py-0.5 rounded font-bold">
                +{variance}g Variance
              </span>
            </div>
          )}

          {/* 2-COLUMN: Vision Snapshot vs Weight Variance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* CAPTURED AI VISION SNAPSHOT */}
            <div className="p-3.5 rounded-2xl bg-slate-950 text-white border border-slate-800 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-2">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Camera className="w-3 h-3" />
                  CV SNAPSHOT #FREEZE-FRAME
                </span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>

              {/* Simulated camera capture graphic with frozen bounding box */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                {/* Background supermarket shelf silhouette */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]"></div>

                {/* Simulated Hand & Item silhouette */}
                <div className="relative flex flex-col items-center">
                  <span className="text-5xl mb-2 opacity-80">🥫</span>
                  <span className="text-[10px] text-slate-400 font-mono">Cart Basket Interior</span>
                </div>

                {/* Target Anomaly Bounding Box */}
                <div className="absolute inset-8 border-2 border-dashed border-rose-500 bg-rose-500/15 rounded-lg flex flex-col justify-between p-1.5 animate-pulse">
                  <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded self-start shadow">
                    UNREGISTERED ITEM (98.4%)
                  </span>
                  <span className="bg-slate-950/90 text-rose-300 text-[8px] font-mono px-1 rounded self-end border border-rose-500/40">
                    NO BARCODE TRIGGER
                  </span>
                </div>

                {/* Timestamp watermark */}
                <div className="absolute bottom-1.5 left-2 text-[9px] font-mono text-slate-400">
                  YOLOv9 Frame #88412
                </div>
              </div>

              <p className="text-[10px] text-slate-400 mt-2 font-mono">
                Optical inference confirmed deposit motion into basket without optical SKU barcode scan.
              </p>
            </div>

            {/* WEIGHT VARIANCE & LOAD CELL STATS */}
            <div className="space-y-3">
              
              {/* Variance Comparison Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Weight Telemetry Variance</span>
                  <span className="text-rose-600 font-mono font-extrabold text-xs">+{variance}g</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400">Expected</span>
                    <p className="text-base font-extrabold text-slate-800 font-mono">{expectedWeight}g</p>
                    <span className="text-[9px] text-slate-400">Scanned items</span>
                  </div>
                  <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200">
                    <span className="text-[10px] text-rose-600 font-bold">Measured</span>
                    <p className="text-base font-extrabold text-rose-700 font-mono">{measuredWeight}g</p>
                    <span className="text-[9px] text-rose-500">4-cell sensor</span>
                  </div>
                </div>

                {/* Suspected Reason */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Suspected Reason:
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    Un-scanned item dropped into trolley basket without barcode scan, or customer leaning heavily on cart handle (+{variance}g deviation).
                  </p>
                </div>
              </div>

              {/* 4-Corner Sensor Strain Gauge Map */}
              <div className="p-3 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 text-xs">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-2">
                  <span>HX711 4-POINT STRAIN GAUGE BRIDGE</span>
                  <span className="text-rose-400 font-bold">FR LOAD SPIKE</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                  <div className="p-1.5 bg-slate-800/80 rounded border border-slate-700 flex justify-between">
                    <span>Front Left:</span>
                    <span className="text-emerald-400 font-bold">{Math.round(measuredWeight * 0.22)}g</span>
                  </div>
                  <div className="p-1.5 bg-rose-950/60 rounded border border-rose-600 flex justify-between">
                    <span>Front Right:</span>
                    <span className="text-rose-400 font-bold">{Math.round(measuredWeight * 0.35)}g (Anomaly)</span>
                  </div>
                  <div className="p-1.5 bg-slate-800/80 rounded border border-slate-700 flex justify-between">
                    <span>Rear Left:</span>
                    <span className="text-emerald-400 font-bold">{Math.round(measuredWeight * 0.21)}g</span>
                  </div>
                  <div className="p-1.5 bg-slate-800/80 rounded border border-slate-700 flex justify-between">
                    <span>Rear Right:</span>
                    <span className="text-emerald-400 font-bold">{Math.round(measuredWeight * 0.22)}g</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* TWO REQUIRED ADMIN ACTION BUTTONS */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Admin Security Resolution Actions
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Action 1: "Approve Override / False Alarm" */}
              <button
                id="admin-approve-override-btn"
                onClick={handleApprove}
                disabled={overrideApproved}
                className="py-3 px-4 rounded-2xl bg-[#E8F5E9] hover:bg-[#C8E6C9] border border-[#C8E6C9] text-[#2E7D32] font-bold text-xs flex items-center justify-center space-x-2 transition shadow-xs active:scale-98"
                title="Acknowledge false alarm and restore trolley to green balanced state"
              >
                <UserCheck className="w-4 h-4" />
                <span>Approve Override / False Alarm</span>
              </button>

              {/* Action 2: "Trigger Security Lock / Alert Floor Staff" */}
              <button
                id="admin-security-lockdown-btn"
                onClick={handleLockdown}
                disabled={criticalLockTriggered}
                className="py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md shadow-rose-900/20 active:scale-98"
                title="Engage emergency electromagnetic brake and dispatch security"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Trigger Security Lock / Alert Floor Staff</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
