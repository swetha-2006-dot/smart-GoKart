import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  CameraOff, 
  Scan, 
  Zap, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Layers, 
  CheckCircle2, 
  Scale, 
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Barcode
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { soundFX } from '../../utils/audio';
import { socket, sendScannedItem, sendWeightUpdate, sendCalibrateReset } from '../../utils/socket';
import { MOCK_CATALOG } from '../../data/mockCatalog';

// 4 One-Tap Demo Barcodes (Safety Net Presets)
const ONE_TAP_DEMO_BARCODES = [
  {
    id: "demo-cadbury",
    barcode: "8901030384501",
    name: "Cadbury Dairy Milk",
    shortName: "Cadbury Dairy Milk",
    category: "Chocolates",
    priceINR: 60,
    priceUSD: 0.75,
    weightGrams: 100,
    icon: "🍫",
    confidenceScore: "99.8%"
  },
  {
    id: "demo-bread",
    barcode: "8901262010014",
    name: "Whole Wheat Bread",
    shortName: "Whole Wheat Bread",
    category: "Bakery",
    priceINR: 40,
    priceUSD: 0.50,
    weightGrams: 400,
    icon: "🍞",
    confidenceScore: "99.5%"
  },
  {
    id: "demo-milk",
    barcode: "8901491123456",
    name: "Organic Milk 1L",
    shortName: "Organic Milk 1L",
    category: "Dairy",
    priceINR: 60,
    priceUSD: 0.75,
    weightGrams: 1000,
    icon: "🥛",
    confidenceScore: "99.6%"
  },
  {
    id: "demo-cereal",
    barcode: "8901234567890",
    name: "Breakfast Cereal",
    shortName: "Breakfast Cereal",
    category: "Breakfast",
    priceINR: 250,
    priceUSD: 3.10,
    weightGrams: 500,
    icon: "🥣",
    confidenceScore: "99.2%"
  }
];

export default function MobileScanView({ onReturnToDashboard }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedTrolley, setSelectedTrolley] = useState('trolley_04');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastScanned, setLastScanned] = useState(null);
  const [flashGreen, setFlashGreen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartWeight, setCartWeight] = useState(0);
  const [latency, setLatency] = useState(null);

  const qrScannerRef = useRef(null);

  // Trigger feedback: Haptic Vibration + Audio Beep + Screen Flash
  const triggerScanFeedback = (item) => {
    // 1. Tactile vibration
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([60, 40, 60]);
    }

    // 2. Audio beep
    soundFX.playScanBeep();

    // 3. Green flash animation
    setFlashGreen(true);
    setTimeout(() => setFlashGreen(false), 600);
  };

  // Emit ITEM_SCANNED over Socket.io
  const handleScanItem = (catalogItem) => {
    triggerScanFeedback(catalogItem);
    setLastScanned(catalogItem);

    const payload = {
      trolleyId: selectedTrolley,
      barcode: catalogItem.barcode,
      itemName: catalogItem.name || catalogItem.shortName,
      price: catalogItem.priceINR,
      weight: catalogItem.weightGrams,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    sendScannedItem(payload);
  };

  // Start Camera
  const startCamera = async () => {
    try {
      if (qrScannerRef.current) {
        await qrScannerRef.current.stop();
        qrScannerRef.current.clear();
      }

      const qrScanner = new Html5Qrcode("mobile-camera-reader");
      qrScannerRef.current = qrScanner;

      await qrScanner.start(
        { facingMode: "environment" },
        { fps: 12, qrbox: { width: 240, height: 180 } },
        (decodedText) => {
          const now = Date.now();
          if (window.lastMobileScanTime && now - window.lastMobileScanTime < 1800) return;
          window.lastMobileScanTime = now;

          const matched = MOCK_CATALOG.find(i => i.barcode === decodedText.trim()) || {
            id: `item-${Date.now()}`,
            barcode: decodedText,
            name: `Scanned Item #${decodedText.slice(-4)}`,
            shortName: `Item #${decodedText.slice(-4)}`,
            category: "Grocery",
            priceINR: 100,
            priceUSD: 1.25,
            weightGrams: 350,
            icon: "📦"
          };

          handleScanItem(matched);
        },
        () => {}
      );
      setCameraActive(true);
    } catch (e) {
      console.warn("Mobile camera launch error:", e);
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.stop();
        qrScannerRef.current.clear();
      } catch (e) {
        console.warn(e);
      }
      qrScannerRef.current = null;
    }
    setCameraActive(false);
  };

  // Socket listener setup
  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      socket.emit('JOIN_SESSION', { trolleyId: selectedTrolley });
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onCartUpdated = (data) => {
      if (data.trolleyId === selectedTrolley) {
        const totalQty = data.cartItems ? data.cartItems.reduce((acc, i) => acc + i.quantity, 0) : 0;
        setCartCount(totalQty);
        setCartWeight(data.measuredWeight || data.expectedWeight || 0);
        if (data.lastItem) {
          setLastScanned(data.lastItem);
        }
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('CART_UPDATED', onCartUpdated);

    setIsConnected(socket.connected);
    if (socket.connected) {
      socket.emit('JOIN_SESSION', { trolleyId: selectedTrolley });
    }

    // Measure latency ping
    const pingInterval = setInterval(() => {
      if (socket.connected) {
        const start = Date.now();
        socket.emit('PING', () => {
          setLatency(Date.now() - start);
        });
      }
    }, 3500);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('CART_UPDATED', onCartUpdated);
      clearInterval(pingInterval);
      stopCamera();
    };
  }, [selectedTrolley]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 font-['Plus_Jakarta_Sans'] relative overflow-x-hidden">
      
      {/* Visual Green Flash on Successful Scan */}
      <div 
        className={`fixed inset-0 bg-emerald-500/80 pointer-events-none z-50 transition-opacity duration-300 ${
          flashGreen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Top Mobile App Header */}
      <header className="p-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {onReturnToDashboard && (
            <button
              onClick={onReturnToDashboard}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition mr-1"
              title="Return to Main Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00838F] to-[#2E7D32] flex items-center justify-center text-lg shadow-md">
            🛒
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-extrabold text-white font-['Outfit']">Gokart</span>
              <span className="text-base font-extrabold text-emerald-400 font-['Outfit']">AI</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                MOBILE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Wireless Optical Scanner Bridge</p>
          </div>
        </div>

        {/* Live Socket Connection Badge */}
        <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
          isConnected 
            ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
            : 'bg-rose-950 text-rose-300 border-rose-800'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-[11px] font-mono">
            {isConnected ? `Linked (${latency ? `${latency}ms` : 'Sync'})` : 'Offline'}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 flex flex-col space-y-4 max-w-md mx-auto w-full">
        
        {/* Trolley Pairing & Real-Time Stats Bar */}
        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between text-xs shadow-md">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Trolley:</span>
            <select
              value={selectedTrolley}
              onChange={(e) => setSelectedTrolley(e.target.value)}
              className="bg-slate-950 text-emerald-400 font-bold border border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none"
            >
              <option value="trolley_04">Trolley #04 (Active)</option>
              <option value="trolley_01">Trolley #01</option>
              <option value="trolley_02">Trolley #02</option>
            </select>
          </div>

          <div className="text-slate-300 font-mono text-[11px] bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <span>Items: <strong className="text-white">{cartCount}</strong></span>
            <span className="text-slate-600">•</span>
            <span>Weight: <strong className="text-emerald-400">{cartWeight}g</strong></span>
          </div>
        </div>

        {/* Live Camera Viewport Container */}
        <div className="relative bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl aspect-[4/3] flex items-center justify-center group">
          
          {/* HTML5 QR Code Container */}
          <div id="mobile-camera-reader" className="w-full h-full object-cover"></div>

          {/* Scanner Overlay UI */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-20">
            <div className="flex justify-between items-center text-[10px] font-mono text-emerald-400 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 self-start">
              <span>CAMERA OPTICAL SENSOR // ACTIVE</span>
            </div>

            {/* Target Reticle Frame with Moving Laser */}
            <div className="relative mx-auto w-48 h-36 border border-dashed border-emerald-400/50 rounded-2xl flex items-center justify-center">
              <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></span>
              <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></span>
              <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></span>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></span>

              {/* Sweeping Laser Line */}
              <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-scanner"></div>

              <div className="text-[10px] text-emerald-300/80 font-mono tracking-wider bg-slate-950/70 px-2 py-0.5 rounded">
                AIM AT BARCODE
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono self-end bg-slate-950/80 px-2 py-0.5 rounded">
              AUTO-SYNC &lt;100MS
            </div>
          </div>

          {/* Camera Controls Toggle */}
          <button
            onClick={cameraActive ? stopCamera : startCamera}
            className="absolute bottom-3 right-3 z-30 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 rounded-xl backdrop-blur-md shadow-lg flex items-center space-x-1.5 transition"
          >
            {cameraActive ? <CameraOff className="w-3.5 h-3.5 text-rose-400" /> : <Camera className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{cameraActive ? 'Stop Cam' : 'Start Cam'}</span>
          </button>
        </div>

        {/* ONE-TAP DEMO BARCODES (Safety Net Section) */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-3.5 shadow-lg">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Barcode className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="text-xs font-bold text-white block leading-tight">
                  One-Tap Demo Barcodes
                </span>
                <span className="text-[10px] text-slate-400">
                  Instant fallback • Tap to scan & sync
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 font-bold">
              4 PRESETS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {ONE_TAP_DEMO_BARCODES.map((item) => (
              <button
                key={item.id}
                id={`demo-tap-${item.id}`}
                onClick={() => handleScanItem(item)}
                className="p-2.5 rounded-2xl bg-slate-950/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 active:scale-95 transition-all text-left flex flex-col justify-between group shadow-sm"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400 border border-slate-700 group-hover:border-emerald-500/50 group-hover:text-emerald-300 transition">
                    TAP
                  </span>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                    {item.name}
                  </h5>
                  <div className="flex items-center space-x-1 text-[10px] font-mono text-slate-400 mt-0.5">
                    <Barcode className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate text-slate-300">{item.barcode}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono mt-2 pt-1.5 border-t border-slate-800/80">
                  <span className="font-extrabold text-emerald-400">
                    ₹{item.priceINR}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {item.weightGrams}g
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Scan Feedback Card */}
        <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center space-x-3 transition-all shadow-md">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shrink-0">
            {lastScanned ? lastScanned.icon || '📦' : '📱'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white truncate">
                {lastScanned ? lastScanned.shortName || lastScanned.name : 'Mobile Scanner Ready'}
              </h4>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                lastScanned ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
              }`}>
                {lastScanned ? 'VERIFIED' : 'IDLE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {lastScanned 
                ? `${lastScanned.weightGrams}g • ₹${lastScanned.priceINR} • Synced to Laptop Dashboard` 
                : 'Tap quick mock buttons below or scan physical barcode'}
            </p>
          </div>
        </div>

        {/* 3 QUICK TEST BUTTONS (Prompt Requirement 2) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              3 Quick Test Buttons (Instant Fallback)
            </span>
            <span className="text-[10px] text-slate-500">Tap to simulate</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              id="mobile-scan-milk"
              onClick={() => handleScanItem(MOCK_CATALOG[0])}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#00838F]/15 hover:bg-[#00838F]/25 border border-[#00838F]/40 active:scale-95 transition text-center group"
            >
              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🥛</span>
              <span className="text-xs font-bold text-cyan-200">Scan Milk</span>
              <span className="text-[10px] text-slate-400 mt-0.5">1000g • ₹60</span>
            </button>

            <button
              id="mobile-scan-bread"
              onClick={() => handleScanItem(MOCK_CATALOG[1])}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 active:scale-95 transition text-center group"
            >
              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🍞</span>
              <span className="text-xs font-bold text-amber-200">Scan Bread</span>
              <span className="text-[10px] text-slate-400 mt-0.5">400g • ₹40</span>
            </button>

            <button
              id="mobile-scan-cereal"
              onClick={() => handleScanItem(MOCK_CATALOG[2])}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 active:scale-95 transition text-center group"
            >
              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🥣</span>
              <span className="text-xs font-bold text-orange-200">Scan Cereal</span>
              <span className="text-[10px] text-slate-400 mt-0.5">500g • ₹250</span>
            </button>
          </div>
        </div>

        {/* Secondary Mock Items */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {MOCK_CATALOG.slice(3, 7).map((item) => (
            <button
              key={item.id}
              onClick={() => handleScanItem(item)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 active:scale-95 transition truncate"
            >
              <span className="text-base block mb-0.5">{item.icon}</span>
              <span className="text-[10px]">{item.shortName}</span>
            </button>
          ))}
        </div>

        {/* Anti-Theft Testing Controls from Mobile */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Anti-Theft Load Cell Bridge</span>
            <span className="text-slate-500">Live Socket Emit</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
                  window.navigator.vibrate([150, 100, 150]);
                }
                sendWeightUpdate({
                  trolleyId: selectedTrolley,
                  mismatchDeviation: 50,
                  status: "mismatch_triggered"
                });
              }}
              className="py-2 px-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold active:scale-95 transition flex items-center justify-center space-x-1"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>+50g Mismatch</span>
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
                  window.navigator.vibrate(80);
                }
                sendCalibrateReset(selectedTrolley);
              }}
              className="py-2 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-bold active:scale-95 transition flex items-center justify-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Calibrate Tare</span>
            </button>
          </div>
        </div>

      </main>

      {/* Mobile Footer */}
      <footer className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-500">
        Gokart AI Mobile Bridge • Connected to Port 5000 via Socket.io
      </footer>

    </div>
  );
}
