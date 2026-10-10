import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Wifi, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  Radio, 
  Zap,
  Info
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function MobilePairingModal({ isOpen, onClose, isSocketConnected }) {
  const [copied, setCopied] = useState(false);
  const [localIp, setLocalIp] = useState('192.168.0.105');
  const [mobilePort, setMobilePort] = useState('5000');

  useEffect(() => {
    // If running in browser, determine host
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
        setLocalIp(hostname);
      }
    }

    // Try fetching detected IPs from backend server
    fetch('http://localhost:5000/api/status')
      .then(res => res.json())
      .then(data => {
        if (data.localIps && data.localIps.length > 0) {
          setLocalIp(data.localIps[0].address);
        }
      })
      .catch(() => {
        // Fallback to detected or 192.168.0.105
      });
  }, []);

  if (!isOpen) return null;

  const mobileUrl = `http://${localIp}:${mobilePort}/mobile-scan`;
  const viteMobileUrl = `http://${localIp}:5173/?mode=mobile`;

  const handleCopy = () => {
    soundFX.playClick();
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative animate-scale-up">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight font-['Outfit']">
                Connect Mobile Phone Scanner
              </h3>
              <p className="text-xs text-slate-300">
                Real-Time Socket.io Optical Bridge
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
        <div className="p-6 text-center">
          
          {/* Socket Connection Status */}
          <div className="mb-4 inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className={`w-2 h-2 rounded-full ${isSocketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span>Backend Bridge: <strong className={isSocketConnected ? 'text-emerald-700' : 'text-rose-700'}>
              {isSocketConnected ? 'Port 5000 Online' : 'Connecting to Port 5000...'}
            </strong></span>
          </div>

          {/* QR Code Container */}
          <div className="mx-auto w-52 h-52 p-3 bg-white border-2 border-slate-800/10 rounded-2xl shadow-inner flex flex-col items-center justify-center relative mb-4">
            <div className="w-full h-full bg-[#FAFAFA] rounded-xl flex flex-col items-center justify-center p-2 border border-slate-200 relative overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-40 h-40">
                {/* Standard QR Pattern Elements */}
                <rect x="0" y="0" width="30" height="30" fill="#00838F" rx="3" />
                <rect x="5" y="5" width="20" height="20" fill="#FFFFFF" rx="2" />
                <rect x="10" y="10" width="10" height="10" fill="#00838F" />

                <rect x="70" y="0" width="30" height="30" fill="#00838F" rx="3" />
                <rect x="75" y="5" width="20" height="20" fill="#FFFFFF" rx="2" />
                <rect x="80" y="10" width="10" height="10" fill="#00838F" />

                <rect x="0" y="70" width="30" height="30" fill="#00838F" rx="3" />
                <rect x="5" y="75" width="20" height="20" fill="#FFFFFF" rx="2" />
                <rect x="10" y="80" width="10" height="10" fill="#00838F" />

                {/* Data Matrix Dots */}
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
                <span className="p-1 bg-white rounded shadow text-[9px] font-black text-[#00838F]">SCAN ME</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 mb-3 font-medium">
            Scan this QR code with your phone camera or open the URL below:
          </p>

          {/* URL Box */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs font-mono mb-4 text-slate-800">
            <span className="truncate pr-2 font-bold text-[#00838F]">{mobileUrl}</span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition shrink-0"
              title="Copy Mobile URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Instructions checklist */}
          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-2xl text-left text-xs text-amber-800 space-y-1 mb-4">
            <p className="font-bold flex items-center gap-1 text-amber-900">
              <Wifi className="w-3.5 h-3.5" />
              Local Wi-Fi Connection Tip:
            </p>
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              Make sure both your smartphone and laptop are connected to the same Wi-Fi network. Scanned items sync instantly in &lt;200ms.
            </p>
          </div>

          {/* Direct Actions */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={mobileUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Scanner (Tab)</span>
            </a>

            <button
              onClick={onClose}
              className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
            >
              Done / Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
