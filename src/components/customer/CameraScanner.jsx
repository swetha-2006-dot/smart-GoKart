import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  CameraOff, 
  Scan, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Plus, 
  Layers, 
  Zap,
  Info
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { soundFX } from '../../utils/audio';
import { MOCK_CATALOG } from '../../data/mockCatalog';

export default function CameraScanner({
  onItemScanned,
  lastScannedItem,
  verificationFlash,
  currency,
  hasMismatchAlert
}) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState(null);
  const [customBarcode, setCustomBarcode] = useState('');
  const [cameraLoading, setCameraLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' or 'library'
  const html5QrCodeRef = useRef(null);
  const videoElemRef = useRef(null);
  const streamRef = useRef(null);

  // Start webcam feed with WebRTC or html5-qrcode
  const startCamera = async () => {
    setCameraLoading(true);
    setCameraPermissionError(null);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoElemRef.current) {
          videoElemRef.current.srcObject = stream;
          await videoElemRef.current.play();
        }
        setCameraActive(true);

        // Also attempt html5-qrcode scanning on container if supported
        try {
          const qrScanner = new Html5Qrcode("reader");
          html5QrCodeRef.current = qrScanner;
          await qrScanner.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 180 },
              aspectRatio: 1.333334
            },
            (decodedText) => {
              handleBarcodeDetected(decodedText);
            },
            (errorMessage) => {
              // Ignore scan frame misses
            }
          );
        } catch (e) {
          // html5-qrcode couldn't attach to reader, standard video stream still plays!
          console.log("HTML5Qrcode fallback to raw stream:", e);
        }
      } else {
        throw new Error("Camera API not supported in this browser");
      }
    } catch (err) {
      console.warn("Camera access error:", err);
      setCameraPermissionError("Camera access unavailable or blocked. You can still test with the simulated feed or quick scan buttons below.");
      setCameraActive(false);
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (e) {
        console.warn("Stop scanner error", e);
      }
      html5QrCodeRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoElemRef.current) {
      videoElemRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleBarcodeDetected = (code) => {
    const matched = MOCK_CATALOG.find(item => item.barcode === code.trim());
    if (matched) {
      onItemScanned(matched);
    } else {
      // Mock generated fallback if arbitrary barcode is scanned
      onItemScanned({
        id: `item-${Date.now()}`,
        barcode: code,
        name: `Scanned Item #${code.slice(-4)}`,
        shortName: `Item #${code.slice(-4)}`,
        category: "General Grocery",
        priceINR: 150,
        priceUSD: 1.80,
        weightGrams: 350,
        icon: "📦",
        badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
        confidenceScore: "96.5%",
        bbox: { x: "25%", y: "25%", width: "50%", height: "50%" }
      });
    }
  };

  const handleQuickScan = (catalogItem) => {
    soundFX.playScanBeep();
    onItemScanned(catalogItem);
  };

  const handleManualBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!customBarcode.trim()) return;
    handleBarcodeDetected(customBarcode);
    setCustomBarcode('');
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-slate-200/80 transition-all">
      
      {/* Scanner Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#E0F7FA] text-[#00838F] border border-[#B2EBF2]">
            <Scan className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Live Vision & Barcode Scanner
            </h2>
            <p className="text-xs text-slate-500">
              Dual AI optical recognition & item-motion validation
            </p>
          </div>
        </div>

        {/* Camera toggle pill */}
        <button
          onClick={cameraActive ? stopCamera : startCamera}
          disabled={cameraLoading}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
            cameraActive
              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              : 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9] hover:bg-[#C8E6C9]/40'
          }`}
        >
          {cameraActive ? (
            <>
              <CameraOff className="w-3.5 h-3.5" />
              <span>Turn Off Cam</span>
            </>
          ) : (
            <>
              <Camera className="w-3.5 h-3.5" />
              <span>{cameraLoading ? 'Starting...' : 'Enable Webcam'}</span>
            </>
          )}
        </button>
      </div>

      {/* Camera Viewport Container */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-inner flex items-center justify-center group">
        
        {/* Real video element */}
        <video
          ref={videoElemRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            cameraActive ? 'opacity-100 z-10' : 'opacity-0 -z-10'
          }`}
        />

        {/* Hidden div for html5-qrcode hook */}
        <div 
          id="reader" 
          className={`absolute inset-0 w-full h-full object-cover ${
            cameraActive ? 'opacity-0 pointer-events-none' : 'hidden'
          }`}
        ></div>

        {/* Simulated High-Tech Camera View (when webcam is off or denied) */}
        {!cameraActive && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center z-0">
            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="relative z-10 flex flex-col items-center max-w-xs">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mb-3 shadow-lg group-hover:scale-105 transition-transform">
                <Camera className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">
                AI Vision Feed Standby
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Click &ldquo;Enable Webcam&rdquo; for live barcode scanning, or click any quick mock item button below.
              </p>
              <button
                onClick={startCamera}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00838F] to-[#2E7D32] text-white text-xs font-semibold shadow-md hover:brightness-110 active:scale-95 transition"
              >
                <Camera className="w-4 h-4" />
                <span>Launch Live Camera</span>
              </button>
            </div>
          </div>
        )}

        {/* Scanner HUD Overlay (Active always to provide authentic smart cart experience) */}
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4">
          
          {/* Top HUD elements */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>CV-NODE #04 // LIVE</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-mono text-slate-300">
              FPS: 30 • 1080p
            </div>
          </div>

          {/* Central Target Reticle */}
          <div className="relative mx-auto w-48 h-36 sm:w-56 sm:h-44 border border-dashed border-emerald-400/40 rounded-xl flex items-center justify-center">
            {/* Corner brackets */}
            <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></span>
            <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></span>
            <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></span>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></span>

            {/* Moving Laser Scan Line */}
            <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-scanner"></div>

            <div className="text-[10px] text-emerald-300/80 font-mono tracking-wider">
              ALIGN BARCODE / PRODUCT
            </div>
          </div>

          {/* Bottom HUD: Live Status */}
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-slate-400 bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded font-mono">
              AI Vision Model: SmartCart-YOLOv9
            </div>
            <div className="text-[10px] text-emerald-400 bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded font-mono">
              Confidence Floor: 95%
            </div>
          </div>
        </div>

        {/* AI COMPUTER VISION VERIFICATION BADGE & BOUNDING BOX OVERLAY */}
        {verificationFlash && lastScannedItem && (
          <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center p-4">
            
            {/* Visual Bounding Box simulating real-time object detection */}
            <div 
              className="absolute border-2 border-emerald-400 bg-emerald-400/15 rounded-xl animate-bbox transition-all duration-300 flex flex-col justify-between p-2"
              style={{
                left: lastScannedItem.bbox?.x || '22%',
                top: lastScannedItem.bbox?.y || '25%',
                width: lastScannedItem.bbox?.width || '55%',
                height: lastScannedItem.bbox?.height || '50%'
              }}
            >
              {/* Detection Tag */}
              <div className="self-start -mt-5 -ml-1 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-md flex items-center space-x-1">
                <span>{lastScannedItem.shortName}</span>
                <span className="bg-emerald-800/80 text-[10px] px-1 rounded">
                  {lastScannedItem.confidenceScore}
                </span>
              </div>

              {/* Hand Motion Vector */}
              <div className="self-end -mb-5 bg-slate-900/90 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/50 shadow flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Deposit Gesture Confirmed</span>
              </div>
            </div>

            {/* Prominent Verification Status Badge Overlay */}
            <div className="relative mt-auto mb-6 bg-emerald-950/90 backdrop-blur-md border border-emerald-400 text-white px-4 py-2 rounded-2xl shadow-2xl flex items-center space-x-2.5 animate-bounce">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  AI Computer Vision Verification
                </p>
                <p className="text-xs font-semibold text-white">
                  Hand Gesture & Item Match Verified ✓
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Permission message notice if any */}
      {cameraPermissionError && (
        <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start space-x-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>{cameraPermissionError}</p>
        </div>
      )}

      {/* QUICK MOCK BUTTONS UNDER CAMERA */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Quick Mock Scanners (Manual Simulation)
          </span>
          <span className="text-[11px] text-slate-400">Click to instantly scan</span>
        </div>

        {/* Primary requested mock buttons: Scan Milk, Scan Bread, Scan Cereal */}
        <div className="grid grid-cols-3 gap-2.5 mb-2.5">
          <button
            id="scan-milk-btn"
            onClick={() => handleQuickScan(MOCK_CATALOG[0])}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#E0F7FA]/70 hover:bg-[#E0F7FA] border border-[#B2EBF2] text-slate-800 transition transform hover:-translate-y-0.5 active:translate-y-0 shadow-xs group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🥛</span>
            <span className="text-xs font-bold text-slate-800">Scan Milk</span>
            <span className="text-[10px] text-slate-500 font-medium">1030g • {currency === 'INR' ? '₹68' : '$0.85'}</span>
          </button>

          <button
            id="scan-bread-btn"
            onClick={() => handleQuickScan(MOCK_CATALOG[1])}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#FFF3E0]/70 hover:bg-[#FFF3E0] border border-[#FFE0B2] text-slate-800 transition transform hover:-translate-y-0.5 active:translate-y-0 shadow-xs group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🍞</span>
            <span className="text-xs font-bold text-slate-800">Scan Bread</span>
            <span className="text-[10px] text-slate-500 font-medium">420g • {currency === 'INR' ? '₹55' : '$0.70'}</span>
          </button>

          <button
            id="scan-cereal-btn"
            onClick={() => handleQuickScan(MOCK_CATALOG[2])}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F3E5F5]/70 hover:bg-[#F3E5F5] border border-[#E1BEE7] text-slate-800 transition transform hover:-translate-y-0.5 active:translate-y-0 shadow-xs group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🥣</span>
            <span className="text-xs font-bold text-slate-800">Scan Cereal</span>
            <span className="text-[10px] text-slate-500 font-medium">540g • {currency === 'INR' ? '₹240' : '$2.95'}</span>
          </button>
        </div>

        {/* Secondary quick mock items for rich grocery variety */}
        <div className="grid grid-cols-4 gap-2">
          {MOCK_CATALOG.slice(3, 7).map((item) => (
            <button
              key={item.id}
              onClick={() => handleQuickScan(item)}
              className="flex items-center space-x-1.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition hover:border-slate-300"
              title={`Scan ${item.name}`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="truncate">{item.shortName}</span>
            </button>
          ))}
        </div>

        {/* Manual Barcode Search or custom scanner input */}
        <form onSubmit={handleManualBarcodeSubmit} className="mt-3 flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Or enter Barcode (e.g., 8901030865421)..."
              value={customBarcode}
              onChange={(e) => setCustomBarcode(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00838F] focus:border-transparent transition"
            />
            <Scan className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition"
          >
            Scan Code
          </button>
        </form>

      </div>

    </div>
  );
}
