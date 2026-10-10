import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Enable CORS for all origins
app.use(cors({ origin: '*' }));
app.use(express.json());

// Initialize Socket.io with permissive CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Helper to get local IPv4 addresses
function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({ name, address: iface.address });
      }
    }
  }
  return addresses;
}

// In-Memory Mock Product Catalog matching standard barcodes
export const CATALOG = [
  {
    id: "item-milk",
    barcode: "8901030865421",
    name: "Amul Taaza Homogenised Milk (1L)",
    shortName: "Organic Milk 1L",
    category: "Dairy & Eggs",
    priceINR: 60,
    priceUSD: 0.75,
    weightGrams: 1000,
    icon: "🥛",
    confidenceScore: "99.4%",
    bbox: { x: "22%", y: "26%", width: "56%", height: "50%" }
  },
  {
    id: "item-bread",
    barcode: "8901491101235",
    name: "The Bakehouse Whole Wheat Sourdough (400g)",
    shortName: "Artisan Bread",
    category: "Bakery",
    priceINR: 40,
    priceUSD: 0.50,
    weightGrams: 400,
    icon: "🍞",
    confidenceScore: "98.7%",
    bbox: { x: "20%", y: "30%", width: "60%", height: "42%" }
  },
  {
    id: "item-cereal",
    barcode: "8901725181120",
    name: "Kellogg's Honey Almond Granola Cereal (500g)",
    shortName: "Honey Cereal",
    category: "Breakfast",
    priceINR: 250,
    priceUSD: 3.10,
    weightGrams: 500,
    icon: "🥣",
    confidenceScore: "99.1%",
    bbox: { x: "25%", y: "22%", width: "50%", height: "56%" }
  },
  {
    id: "item-apple",
    barcode: "8906001021456",
    name: "Crisp Royal Gala Apples (Pack of 4)",
    shortName: "Fuji Apples",
    category: "Produce",
    priceINR: 160,
    priceUSD: 1.95,
    weightGrams: 600,
    icon: "🍎",
    confidenceScore: "97.9%",
    bbox: { x: "28%", y: "32%", width: "44%", height: "44%" }
  },
  {
    id: "item-coffee",
    barcode: "8908002019912",
    name: "Blue Tokai Attikan Dark Roast Coffee (250g)",
    shortName: "Artisanal Coffee",
    category: "Beverages",
    priceINR: 380,
    priceUSD: 4.60,
    weightGrams: 250,
    icon: "☕",
    confidenceScore: "99.6%",
    bbox: { x: "26%", y: "24%", width: "48%", height: "52%" }
  },
  {
    id: "item-oliveoil",
    barcode: "8901234567890",
    name: "Borges Extra Virgin Cold Pressed Olive Oil (500ml)",
    shortName: "Olive Oil 500ml",
    category: "Pantry",
    priceINR: 550,
    priceUSD: 6.70,
    weightGrams: 500,
    icon: "🫒",
    confidenceScore: "98.2%",
    bbox: { x: "30%", y: "18%", width: "40%", height: "64%" }
  },
  {
    id: "item-cookies",
    barcode: "8909876543210",
    name: "Dark Chocolate Chunk Hazelnut Cookies (150g)",
    shortName: "Choco Cookies",
    category: "Snacks",
    priceINR: 120,
    priceUSD: 1.45,
    weightGrams: 150,
    icon: "🍪",
    confidenceScore: "99.0%",
    bbox: { x: "24%", y: "28%", width: "52%", height: "46%" }
  },
  {
    id: "item-yogurt",
    barcode: "8905544332211",
    name: "Epigamia Greek Wild Blueberry Yogurt (200g)",
    shortName: "Greek Yogurt",
    category: "Dairy & Eggs",
    priceINR: 95,
    priceUSD: 1.15,
    weightGrams: 200,
    icon: "🫐",
    confidenceScore: "98.5%",
    bbox: { x: "28%", y: "30%", width: "44%", height: "46%" }
  }
];

// In-Memory Trolleys Store
const trolleysState = {
  "trolley_04": {
    id: "trolley_04",
    displayName: "Trolley #04",
    cartItems: [
      { ...CATALOG[0], quantity: 1 }, // Milk: 1000g, ₹60
      { ...CATALOG[1], quantity: 1 }  // Bread: 400g, ₹40
    ],
    mismatchDeviation: 0,
    expectedWeight: 1400,
    measuredWeight: 1400,
    isBalanced: true,
    status: "Active",
    battery: 88,
    customer: "Guest-8821",
    location: "Aisle 2 (Dairy & Bakery)"
  },
  "trolley_01": {
    id: "trolley_01",
    displayName: "Trolley #01",
    cartItems: [
      { ...CATALOG[0], quantity: 1 },
      { ...CATALOG[4], quantity: 1 }
    ],
    mismatchDeviation: 0,
    expectedWeight: 1250,
    measuredWeight: 1250,
    isBalanced: true,
    status: "Active",
    battery: 92,
    customer: "Priya S.",
    location: "Aisle 3 (Beverages)"
  },
  "trolley_02": {
    id: "trolley_02",
    displayName: "Trolley #02",
    cartItems: [
      { ...CATALOG[0], quantity: 1 },
      { ...CATALOG[1], quantity: 1 }
    ],
    mismatchDeviation: 120,
    expectedWeight: 1400,
    measuredWeight: 1520,
    isBalanced: false,
    status: "Active",
    battery: 68,
    customer: "Rahul M.",
    location: "Aisle 1 (Produce)"
  }
};

// Calculate weights and totals for a trolley
function recomputeTrolley(trolley) {
  const expWeight = trolley.cartItems.reduce((acc, it) => acc + (it.weightGrams * it.quantity), 0);
  trolley.expectedWeight = expWeight;
  trolley.measuredWeight = expWeight + (trolley.mismatchDeviation || 0);
  trolley.isBalanced = Math.abs(trolley.mismatchDeviation || 0) <= 15;
  trolley.totalINR = trolley.cartItems.reduce((acc, it) => acc + (it.priceINR * it.quantity), 0);
  trolley.totalUSD = trolley.cartItems.reduce((acc, it) => acc + (it.priceUSD * it.quantity), 0);
  trolley.itemCount = trolley.cartItems.reduce((acc, it) => acc + it.quantity, 0);
}

// Recompute initial states
Object.values(trolleysState).forEach(recomputeTrolley);

// Normalize trolley ID (e.g. "Trolley #04" -> "trolley_04")
function normalizeTrolleyId(id) {
  if (!id) return "trolley_04";
  return id.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

// REST Endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Gokart AI IoT Bridge',
    time: new Date().toISOString(),
    localIps: getLocalIpAddresses(),
    activeSockets: io.engine.clientsCount,
    trolleys: Object.keys(trolleysState).map(k => ({
      id: k,
      displayName: trolleysState[k].displayName,
      items: trolleysState[k].cartItems.length,
      isBalanced: trolleysState[k].isBalanced
    }))
  });
});

app.get('/api/catalog', (req, res) => {
  res.json(CATALOG);
});

app.get('/api/trolley/:id', (req, res) => {
  const normId = normalizeTrolleyId(req.params.id);
  const trolley = trolleysState[normId];
  if (!trolley) {
    return res.status(404).json({ error: 'Trolley not found' });
  }
  res.json(trolley);
});

// Standalone Mobile Scanner HTML served directly on /mobile-scan
app.get('/mobile-scan', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Gokart AI — Mobile Scanner Bridge</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="/socket.io/socket.io.js"></script>
  <script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    h1, h2, h3 { font-family: 'Outfit', sans-serif; }
    .scan-laser {
      position: absolute;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, transparent, #10B981, transparent);
      box-shadow: 0 0 15px #10B981;
      animation: sweep 2s ease-in-out infinite;
    }
    @keyframes sweep {
      0%, 100% { top: 10%; }
      50% { top: 90%; }
    }
    @keyframes flashGreen {
      0% { opacity: 0; }
      20% { opacity: 0.85; }
      100% { opacity: 0; }
    }
    .flash-overlay {
      animation: flashGreen 0.7s ease-out forwards;
    }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col justify-between selection:bg-emerald-500">
  
  <!-- Success Green Flash Overlay -->
  <div id="flash-effect" class="fixed inset-0 bg-emerald-500 pointer-events-none z-50 opacity-0"></div>

  <!-- Header -->
  <header class="p-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 flex items-center justify-between">
    <div class="flex items-center space-x-2.5">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00838F] to-[#2E7D32] flex items-center justify-center text-lg shadow-md">
        🛒
      </div>
      <div>
        <div class="flex items-center space-x-1.5">
          <span class="text-base font-extrabold text-white">Gokart</span>
          <span class="text-base font-extrabold text-emerald-400">AI</span>
          <span class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">MOBILE</span>
        </div>
        <p class="text-[11px] text-slate-400">Wireless Optical Scanner Bridge</p>
      </div>
    </div>

    <!-- Live Socket Indicator -->
    <div id="connection-pill" class="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800">
      <span class="w-2 h-2 rounded-full bg-rose-500"></span>
      <span id="connection-text">Connecting...</span>
    </div>
  </header>

  <!-- Main Scanner Area -->
  <main class="flex-1 p-4 flex flex-col space-y-4 max-w-md mx-auto w-full">
    
    <!-- Trolley Selector & Stats Pill -->
    <div class="p-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl flex items-center justify-between text-xs">
      <div class="flex items-center space-x-2">
        <span class="text-slate-400">Trolley:</span>
        <select id="trolley-select" class="bg-slate-900 text-emerald-400 font-bold border border-slate-700 rounded-lg px-2 py-1 focus:outline-none">
          <option value="trolley_04" selected>Trolley #04 (Demo)</option>
          <option value="trolley_01">Trolley #01</option>
          <option value="trolley_02">Trolley #02</option>
        </select>
      </div>

      <div id="cart-counter" class="text-slate-300 font-mono text-[11px] bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-700">
        Items: <span id="cart-item-count" class="font-bold text-white">--</span> | <span id="cart-weight-total" class="font-bold text-emerald-400">--g</span>
      </div>
    </div>

    <!-- Camera Viewport Card -->
    <div class="relative bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl aspect-[4/3] flex items-center justify-center">
      
      <!-- Video Element Container for HTML5 QR Code -->
      <div id="qr-reader" class="w-full h-full object-cover"></div>

      <!-- Laser scan line -->
      <div class="scan-laser pointer-events-none z-20"></div>

      <!-- Scanner Reticle Corners -->
      <div class="absolute inset-6 border border-dashed border-emerald-400/50 rounded-2xl pointer-events-none z-10 flex items-center justify-center">
        <span class="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-emerald-400"></span>
        <span class="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-emerald-400"></span>
        <span class="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-emerald-400"></span>
        <span class="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-emerald-400"></span>
        
        <p class="text-[11px] text-emerald-300/80 font-mono tracking-wider bg-slate-900/80 px-2 py-0.5 rounded">
          POINT AT BARCODE
        </p>
      </div>

      <!-- Camera Start/Stop overlay if needed -->
      <button id="cam-toggle-btn" class="absolute bottom-3 right-3 z-30 px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 text-[11px] font-semibold text-slate-200 border border-slate-700 rounded-xl backdrop-blur-md">
        Restart Cam
      </button>
    </div>

    <!-- One-Tap Demo Barcodes (Safety Net Section) -->
    <div class="bg-slate-900/95 border border-slate-800 rounded-3xl p-3.5 shadow-lg">
      <div class="flex items-center justify-between mb-2.5">
        <div class="flex items-center space-x-2">
          <span class="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">
            🏷️
          </span>
          <div>
            <span class="text-xs font-bold text-white block leading-tight">
              One-Tap Demo Barcodes
            </span>
            <span class="text-[10px] text-slate-400">
              Instant fallback safety net • Tap to emit
            </span>
          </div>
        </div>
        <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 font-bold">
          4 PRESETS
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <button id="demo-cadbury-btn" class="p-2.5 rounded-2xl bg-slate-950/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 active:scale-95 transition-all text-left flex flex-col justify-between group shadow-sm">
          <div class="flex items-start justify-between mb-1.5">
            <span class="text-2xl group-hover:scale-110 transition-transform">🍫</span>
            <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400 border border-slate-700 group-hover:text-emerald-300 transition">TAP</span>
          </div>
          <div>
            <h5 class="text-xs font-bold text-slate-200 group-hover:text-white truncate">Cadbury Dairy Milk</h5>
            <div class="text-[10px] font-mono text-slate-400 mt-0.5 truncate">8901030384501</div>
          </div>
          <div class="flex items-center justify-between text-[11px] font-mono mt-2 pt-1.5 border-t border-slate-800/80">
            <span class="font-extrabold text-emerald-400">₹60</span>
            <span class="text-slate-400 text-[10px]">100g</span>
          </div>
        </button>

        <button id="demo-bread-btn" class="p-2.5 rounded-2xl bg-slate-950/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 active:scale-95 transition-all text-left flex flex-col justify-between group shadow-sm">
          <div class="flex items-start justify-between mb-1.5">
            <span class="text-2xl group-hover:scale-110 transition-transform">🍞</span>
            <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400 border border-slate-700 group-hover:text-emerald-300 transition">TAP</span>
          </div>
          <div>
            <h5 class="text-xs font-bold text-slate-200 group-hover:text-white truncate">Whole Wheat Bread</h5>
            <div class="text-[10px] font-mono text-slate-400 mt-0.5 truncate">8901262010014</div>
          </div>
          <div class="flex items-center justify-between text-[11px] font-mono mt-2 pt-1.5 border-t border-slate-800/80">
            <span class="font-extrabold text-emerald-400">₹40</span>
            <span class="text-slate-400 text-[10px]">400g</span>
          </div>
        </button>

        <button id="demo-milk-btn" class="p-2.5 rounded-2xl bg-slate-950/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 active:scale-95 transition-all text-left flex flex-col justify-between group shadow-sm">
          <div class="flex items-start justify-between mb-1.5">
            <span class="text-2xl group-hover:scale-110 transition-transform">🥛</span>
            <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400 border border-slate-700 group-hover:text-emerald-300 transition">TAP</span>
          </div>
          <div>
            <h5 class="text-xs font-bold text-slate-200 group-hover:text-white truncate">Organic Milk 1L</h5>
            <div class="text-[10px] font-mono text-slate-400 mt-0.5 truncate">8901491123456</div>
          </div>
          <div class="flex items-center justify-between text-[11px] font-mono mt-2 pt-1.5 border-t border-slate-800/80">
            <span class="font-extrabold text-emerald-400">₹60</span>
            <span class="text-slate-400 text-[10px]">1000g</span>
          </div>
        </button>

        <button id="demo-cereal-btn" class="p-2.5 rounded-2xl bg-slate-950/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 active:scale-95 transition-all text-left flex flex-col justify-between group shadow-sm">
          <div class="flex items-start justify-between mb-1.5">
            <span class="text-2xl group-hover:scale-110 transition-transform">🥣</span>
            <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400 border border-slate-700 group-hover:text-emerald-300 transition">TAP</span>
          </div>
          <div>
            <h5 class="text-xs font-bold text-slate-200 group-hover:text-white truncate">Breakfast Cereal</h5>
            <div class="text-[10px] font-mono text-slate-400 mt-0.5 truncate">8901234567890</div>
          </div>
          <div class="flex items-center justify-between text-[11px] font-mono mt-2 pt-1.5 border-t border-slate-800/80">
            <span class="font-extrabold text-emerald-400">₹250</span>
            <span class="text-slate-400 text-[10px]">500g</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Recent Scanned Toast Feedback -->
    <div id="recent-item-card" class="p-3 bg-slate-800/90 border border-slate-700 rounded-2xl flex items-center space-x-3 transition-all">
      <div id="recent-icon" class="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-xl shrink-0">
        📦
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h4 id="recent-title" class="text-xs font-bold text-white truncate">Ready to scan</h4>
          <span id="recent-badge" class="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 font-mono">STANDBY</span>
        </div>
        <p id="recent-sub" class="text-[11px] text-slate-400 mt-0.5">Point camera at item or tap mock buttons below</p>
      </div>
    </div>

    <!-- Quick Mock Scan Buttons (Requested in Prompt) -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">
          ⚡ 3 Quick Mock Buttons (Instant Test)
        </span>
        <span class="text-[10px] text-slate-500">Zero physical barcode needed</span>
      </div>

      <div class="grid grid-cols-3 gap-2.5">
        <button id="mock-milk-btn" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/60 active:scale-95 transition text-center group">
          <span class="text-2xl mb-1 group-hover:scale-110 transition-transform">🥛</span>
          <span class="text-xs font-bold text-cyan-200">Scan Milk</span>
          <span class="text-[10px] text-slate-400 mt-0.5">1000g • ₹60</span>
        </button>

        <button id="mock-bread-btn" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/60 active:scale-95 transition text-center group">
          <span class="text-2xl mb-1 group-hover:scale-110 transition-transform">🍞</span>
          <span class="text-xs font-bold text-amber-200">Scan Bread</span>
          <span class="text-[10px] text-slate-400 mt-0.5">400g • ₹40</span>
        </button>

        <button id="mock-cereal-btn" class="flex flex-col items-center justify-center p-3 rounded-2xl bg-orange-950/60 hover:bg-orange-900/80 border border-orange-800/60 active:scale-95 transition text-center group">
          <span class="text-2xl mb-1 group-hover:scale-110 transition-transform">🥣</span>
          <span class="text-xs font-bold text-orange-200">Scan Cereal</span>
          <span class="text-[10px] text-slate-400 mt-0.5">500g • ₹250</span>
        </button>
      </div>
    </div>

    <!-- Secondary mock items -->
    <div class="grid grid-cols-4 gap-2 text-center text-xs">
      <button id="mock-apple-btn" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 active:scale-95 transition">
        🍎 Apples
      </button>
      <button id="mock-coffee-btn" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 active:scale-95 transition">
        ☕ Coffee
      </button>
      <button id="mock-olive-btn" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 active:scale-95 transition">
        🫒 Olive Oil
      </button>
      <button id="mock-cookies-btn" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 active:scale-95 transition">
        🍪 Cookies
      </button>
    </div>

    <!-- Anti-Theft Testing Controls from Mobile -->
    <div class="p-3 bg-slate-800/50 border border-slate-800 rounded-2xl">
      <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
        Load Cell Anomaly Bridge
      </div>
      <div class="grid grid-cols-2 gap-2">
        <button id="trigger-mismatch-btn" class="py-2 px-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold active:scale-95 transition">
          ⚠️ +50g Mismatch
        </button>
        <button id="calibrate-tare-btn" class="py-2 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-bold active:scale-95 transition">
          ⚖️ Calibrate Tare
        </button>
      </div>
    </div>

  </main>

  <!-- Footer -->
  <footer class="p-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-500">
    Gokart AI Mobile Optical Bridge • WebSocket Latency: <span id="ping-text" class="text-emerald-400 font-mono">--ms</span>
  </footer>

  <!-- Mobile Scanner Logic Script -->
  <script>
    const socket = io();
    let currentTrolleyId = "trolley_04";
    let html5QrScanner = null;
    let audioCtx = null;

    // Audio synthesizer for scan beep
    function playBeep() {
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1850, now);
        osc.frequency.exponentialRampToValueAtTime(2100, now + 0.08);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
      } catch(e) {
        console.warn('Audio play error:', e);
      }
    }

    // Haptic feedback & Visual Green Flash
    function triggerSuccessFeedback(itemName) {
      // 1. Tactile vibration
      if (navigator.vibrate) {
        navigator.vibrate([60, 40, 60]);
      }

      // 2. Audio beep
      playBeep();

      // 3. Green flash overlay
      const flash = document.getElementById('flash-effect');
      flash.classList.remove('flash-overlay');
      void flash.offsetWidth; // trigger reflow
      flash.classList.add('flash-overlay');
    }

    // Socket Connection events
    socket.on('connect', () => {
      const connPill = document.getElementById('connection-pill');
      const connText = document.getElementById('connection-text');
      connPill.className = "flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800";
      connPill.querySelector('span').className = "w-2 h-2 rounded-full bg-emerald-400 animate-pulse";
      connText.innerText = "Linked: " + currentTrolleyId;

      // Join room for this trolley
      socket.emit('JOIN_SESSION', { trolleyId: currentTrolleyId });
    });

    socket.on('disconnect', () => {
      const connPill = document.getElementById('connection-pill');
      const connText = document.getElementById('connection-text');
      connPill.className = "flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800";
      connPill.querySelector('span').className = "w-2 h-2 rounded-full bg-rose-500";
      connText.innerText = "Disconnected";
    });

    // Receive CART_UPDATED from server
    socket.on('CART_UPDATED', (payload) => {
      if (payload.trolleyId === currentTrolleyId) {
        const count = payload.cartItems ? payload.cartItems.reduce((acc, i) => acc + i.quantity, 0) : 0;
        document.getElementById('cart-item-count').innerText = count;
        document.getElementById('cart-weight-total').innerText = (payload.measuredWeight || payload.expectedWeight || 0) + 'g';

        if (payload.lastItem) {
          document.getElementById('recent-icon').innerText = payload.lastItem.icon || '📦';
          document.getElementById('recent-title').innerText = payload.lastItem.name || payload.lastItem.shortName;
          document.getElementById('recent-badge').innerText = 'VERIFIED';
          document.getElementById('recent-badge').className = 'text-[10px] px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-300 font-mono font-bold';
          document.getElementById('recent-sub').innerText = payload.lastItem.weightGrams + 'g • ₹' + payload.lastItem.priceINR + ' • Synced with Laptop Dashboard in <100ms';
        }
      }
    });

    // Trolley Selection changed
    document.getElementById('trolley-select').addEventListener('change', (e) => {
      currentTrolleyId = e.target.value;
      socket.emit('JOIN_SESSION', { trolleyId: currentTrolleyId });
      document.getElementById('connection-text').innerText = "Linked: " + currentTrolleyId;
    });

    // Scan an item helper
    function scanItem(itemPayload) {
      triggerSuccessFeedback(itemPayload.shortName || itemPayload.itemName);

      const packet = {
        trolleyId: currentTrolleyId,
        barcode: itemPayload.barcode,
        itemName: itemPayload.name || itemPayload.shortName,
        price: itemPayload.priceINR,
        weight: itemPayload.weightGrams,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      socket.emit('ITEM_SCANNED', packet);
    }

    // Catalog lookup dictionary
    const MOCK_ITEMS = {
      milk: { barcode: "8901030865421", name: "Amul Taaza Full Cream Milk (1L)", shortName: "Organic Milk 1L", priceINR: 60, weightGrams: 1000, icon: "🥛" },
      bread: { barcode: "8901491101235", name: "The Bakehouse Whole Wheat Sourdough", shortName: "Artisan Bread", priceINR: 40, weightGrams: 400, icon: "🍞" },
      cereal: { barcode: "8901725181120", name: "Kellogg's Honey Almond Granola (500g)", shortName: "Honey Cereal", priceINR: 250, weightGrams: 500, icon: "🥣" },
      apple: { barcode: "8906001021456", name: "Crisp Royal Gala Apples (4 pack)", shortName: "Fuji Apples", priceINR: 160, weightGrams: 600, icon: "🍎" },
      coffee: { barcode: "8908002019912", name: "Blue Tokai Dark Roast Coffee (250g)", shortName: "Artisanal Coffee", priceINR: 380, weightGrams: 250, icon: "☕" },
      olive: { barcode: "8901234567890", name: "Borges Extra Virgin Olive Oil (500ml)", shortName: "Olive Oil 500ml", priceINR: 550, weightGrams: 500, icon: "🫒" },
      cookies: { barcode: "8909876543210", name: "Dark Chocolate Chunk Cookies (150g)", shortName: "Choco Cookies", priceINR: 120, weightGrams: 150, icon: "🍪" },
      demoCadbury: { barcode: "8901030384501", name: "Cadbury Dairy Milk", shortName: "Cadbury Dairy Milk", priceINR: 60, weightGrams: 100, icon: "🍫" },
      demoBread: { barcode: "8901262010014", name: "Whole Wheat Bread", shortName: "Whole Wheat Bread", priceINR: 40, weightGrams: 400, icon: "🍞" },
      demoMilk: { barcode: "8901491123456", name: "Organic Milk 1L", shortName: "Organic Milk 1L", priceINR: 60, weightGrams: 1000, icon: "🥛" },
      demoCereal: { barcode: "8901234567890", name: "Breakfast Cereal", shortName: "Breakfast Cereal", priceINR: 250, weightGrams: 500, icon: "🥣" }
    };

    // Attach 4 One-Tap Demo Barcodes
    document.getElementById('demo-cadbury-btn').addEventListener('click', () => scanItem(MOCK_ITEMS.demoCadbury));
    document.getElementById('demo-bread-btn').addEventListener('click', () => scanItem(MOCK_ITEMS.demoBread));
    document.getElementById('demo-milk-btn').addEventListener('click', () => scanItem(MOCK_ITEMS.demoMilk));
    document.getElementById('demo-cereal-btn').addEventListener('click', () => scanItem(MOCK_ITEMS.demoCereal));

    // Attach 3 requested buttons: Scan Milk, Scan Bread, Scan Cereal
    document.getElementById('mock-milk-btn').addEventListener('click', () => scanItem(MOCK_ITEMS.milk));
    document.getElementById('mock-bread-btn').addEventListener('click', () => scanItem(MOCK_ITEMS.bread));
    document.getElementById('mock-cereal-btn').addEventListener('click', () => scanItem(MOCK_ITEMS.cereal));

    // Secondary items
    document.getElementById('mock-apple-btn').addEventListener('click', () => scanItem(MOCK_ITEMS.apple));
    document.getElementById('mock-coffee-btn').addEventListener('click', () => scanItem(MOCK_ITEMS.coffee));
    document.getElementById('mock-olive-btn').addEventListener('click', () => scanItem(MOCK_ITEMS.olive));
    document.getElementById('mock-cookies-btn').addEventListener('click', () => scanItem(MOCK_ITEMS.cookies));

    // Anti-theft triggers
    document.getElementById('trigger-mismatch-btn').addEventListener('click', () => {
      socket.emit('WEIGHT_UPDATE', {
        trolleyId: currentTrolleyId,
        mismatchDeviation: 50,
        status: "mismatch_triggered"
      });
      if (navigator.vibrate) navigator.vibrate([150, 100, 150]);
    });

    document.getElementById('calibrate-tare-btn').addEventListener('click', () => {
      socket.emit('CALIBRATE_RESET', { trolleyId: currentTrolleyId });
      if (navigator.vibrate) navigator.vibrate(80);
    });

    // Camera initialization using html5-qrcode
    function startCamera() {
      try {
        if (typeof Html5Qrcode !== 'undefined') {
          html5QrScanner = new Html5Qrcode("qr-reader");
          html5QrScanner.start(
            { facingMode: "environment" },
            {
              fps: 12,
              qrbox: { width: 220, height: 160 }
            },
            (decodedText) => {
              // Throttle repeat scans
              const now = Date.now();
              if (window.lastScanTime && now - window.lastScanTime < 1800) return;
              window.lastScanTime = now;

              // Check if decoded text matches known item
              let matched = Object.values(MOCK_ITEMS).find(i => i.barcode === decodedText.trim());
              if (!matched) {
                matched = {
                  barcode: decodedText,
                  name: "Scanned Item #" + decodedText.slice(-4),
                  shortName: "Item #" + decodedText.slice(-4),
                  priceINR: 120,
                  weightGrams: 350,
                  icon: "📦"
                };
              }
              scanItem(matched);
            },
            () => {}
          ).catch((e) => {
            console.log("Camera init fallback:", e);
          });
        }
      } catch (err) {
        console.warn("Camera start exception:", err);
      }
    }

    document.getElementById('cam-toggle-btn').addEventListener('click', () => {
      if (html5QrScanner) {
        html5QrScanner.stop().then(startCamera).catch(startCamera);
      } else {
        startCamera();
      }
    });

    // Start on user interaction or load
    window.addEventListener('load', () => {
      startCamera();
      // Periodically measure latency
      setInterval(() => {
        const start = Date.now();
        socket.emit('PING', () => {
          const latency = Date.now() - start;
          document.getElementById('ping-text').innerText = latency + 'ms';
        });
      }, 4000);
    });
  </script>
</body>
</html>`);
});

// Socket.io Connection & Real-Time Event Handlers
io.on('connection', (socket) => {
  console.log(`[Socket.io] New client connected: ${socket.id}`);

  // Ping latency check
  socket.on('PING', (callback) => {
    if (typeof callback === 'function') callback();
  });

  // JOIN_SESSION: Client joins a specific trolley room (e.g. "trolley_04")
  socket.on('JOIN_SESSION', ({ trolleyId }) => {
    const normId = normalizeTrolleyId(trolleyId);
    socket.join(normId);
    console.log(`[Socket.io] Client ${socket.id} joined trolley room: ${normId}`);

    // If trolley exists, send current snapshot to this client
    if (trolleysState[normId]) {
      const trolley = trolleysState[normId];
      socket.emit('CART_UPDATED', {
        trolleyId: normId,
        displayName: trolley.displayName,
        cartItems: trolley.cartItems,
        expectedWeight: trolley.expectedWeight,
        measuredWeight: trolley.measuredWeight,
        mismatchDeviation: trolley.mismatchDeviation,
        isBalanced: trolley.isBalanced,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  });

  // ITEM_SCANNED: Receives barcode scan from mobile phone
  socket.on('ITEM_SCANNED', (data) => {
    const normId = normalizeTrolleyId(data.trolleyId);
    console.log(`[Socket.io] ITEM_SCANNED received for ${normId}:`, data.barcode, data.itemName);

    let trolley = trolleysState[normId];
    if (!trolley) {
      trolley = {
        id: normId,
        displayName: normId.replace('_', ' ').toUpperCase(),
        cartItems: [],
        mismatchDeviation: 0,
        expectedWeight: 0,
        measuredWeight: 0,
        isBalanced: true,
        status: "Active",
        battery: 90
      };
      trolleysState[normId] = trolley;
    }

    // Find in catalog or build item from payload
    const catalogItem = CATALOG.find(it => it.barcode === data.barcode) || {
      id: `item-${Date.now()}`,
      barcode: data.barcode,
      name: data.itemName || `Item #${data.barcode.slice(-4)}`,
      shortName: data.itemName || `Item #${data.barcode.slice(-4)}`,
      category: "Grocery",
      priceINR: data.price || 100,
      priceUSD: (data.price || 100) / 80,
      weightGrams: data.weight || 300,
      icon: "📦",
      confidenceScore: "99.2%",
      bbox: { x: "25%", y: "25%", width: "50%", height: "50%" }
    };

    // Check if item already in cart
    const existingIndex = trolley.cartItems.findIndex(i => i.barcode === catalogItem.barcode);
    if (existingIndex >= 0) {
      trolley.cartItems[existingIndex].quantity += 1;
    } else {
      trolley.cartItems.unshift({ ...catalogItem, quantity: 1 });
    }

    // Recompute weights
    recomputeTrolley(trolley);

    const timestamp = data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Broadcast CART_UPDATED instantly (<200ms) to all clients and room
    const updatePayload = {
      trolleyId: normId,
      displayName: trolley.displayName,
      cartItems: trolley.cartItems,
      expectedWeight: trolley.expectedWeight,
      measuredWeight: trolley.measuredWeight,
      mismatchDeviation: trolley.mismatchDeviation,
      isBalanced: trolley.isBalanced,
      lastItem: catalogItem,
      totalINR: trolley.totalINR,
      totalUSD: trolley.totalUSD,
      timestamp
    };

    io.to(normId).emit('CART_UPDATED', updatePayload);
    io.emit('CART_UPDATED', updatePayload); // Also broadcast to laptop admin & customer dashboards

    // Telemetry log event for live security & activity audit log
    const logEvent = {
      id: `log-${Date.now()}`,
      timestamp,
      trolleyId: trolley.displayName,
      type: "SCAN",
      message: `${catalogItem.shortName} (${catalogItem.weightGrams}g) scanned via Mobile Bridge. CV gesture & weight verified.`,
      severity: "success"
    };

    io.emit('TELEMETRY_LOG', logEvent);
  });

  // WEIGHT_UPDATE: Real-time load cell sensor telemetry or anomaly trigger
  socket.on('WEIGHT_UPDATE', (data) => {
    const normId = normalizeTrolleyId(data.trolleyId);
    const trolley = trolleysState[normId];
    if (!trolley) return;

    if (data.mismatchDeviation !== undefined) {
      trolley.mismatchDeviation = data.mismatchDeviation;
    } else if (data.measuredWeight !== undefined) {
      trolley.mismatchDeviation = data.measuredWeight - trolley.expectedWeight;
    }

    recomputeTrolley(trolley);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const updatePayload = {
      trolleyId: normId,
      displayName: trolley.displayName,
      cartItems: trolley.cartItems,
      expectedWeight: trolley.expectedWeight,
      measuredWeight: trolley.measuredWeight,
      mismatchDeviation: trolley.mismatchDeviation,
      isBalanced: trolley.isBalanced,
      totalINR: trolley.totalINR,
      totalUSD: trolley.totalUSD,
      timestamp
    };

    io.to(normId).emit('CART_UPDATED', updatePayload);
    io.emit('CART_UPDATED', updatePayload);

    // If anomaly triggered, broadcast TELEMETRY_ALERT
    if (!trolley.isBalanced) {
      const alertPayload = {
        id: `alert-${Date.now()}`,
        timestamp,
        trolleyId: trolley.displayName,
        type: "ALERT",
        message: `Weight Anomaly Detected (+${trolley.mismatchDeviation}g un-scanned load)! Smart brakes locked.`,
        deviation: trolley.mismatchDeviation,
        severity: "danger"
      };
      io.emit('TELEMETRY_ALERT', alertPayload);
      io.emit('TELEMETRY_LOG', alertPayload);
    }
  });

  // CALIBRATE_RESET: Resets load cell tare to 0g
  socket.on('CALIBRATE_RESET', (data) => {
    const normId = normalizeTrolleyId(data.trolleyId);
    const trolley = trolleysState[normId];
    if (!trolley) return;

    trolley.mismatchDeviation = 0;
    recomputeTrolley(trolley);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const updatePayload = {
      trolleyId: normId,
      displayName: trolley.displayName,
      cartItems: trolley.cartItems,
      expectedWeight: trolley.expectedWeight,
      measuredWeight: trolley.measuredWeight,
      mismatchDeviation: 0,
      isBalanced: true,
      totalINR: trolley.totalINR,
      totalUSD: trolley.totalUSD,
      timestamp
    };

    io.to(normId).emit('CART_UPDATED', updatePayload);
    io.emit('CART_UPDATED', updatePayload);

    const logEvent = {
      id: `log-${Date.now()}`,
      timestamp,
      trolleyId: trolley.displayName,
      type: "SYSTEM",
      message: `Load cell tare zero balanced via Mobile/Laptop signal. Brakes released.`,
      severity: "neutral"
    };
    io.emit('TELEMETRY_LOG', logEvent);
  });

  // REMOVE_ITEM from cart
  socket.on('REMOVE_ITEM', ({ trolleyId, itemId }) => {
    const normId = normalizeTrolleyId(trolleyId);
    const trolley = trolleysState[normId];
    if (!trolley) return;

    trolley.cartItems = trolley.cartItems.filter(i => i.id !== itemId && i.barcode !== itemId);
    recomputeTrolley(trolley);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const updatePayload = {
      trolleyId: normId,
      displayName: trolley.displayName,
      cartItems: trolley.cartItems,
      expectedWeight: trolley.expectedWeight,
      measuredWeight: trolley.measuredWeight,
      mismatchDeviation: trolley.mismatchDeviation,
      isBalanced: trolley.isBalanced,
      totalINR: trolley.totalINR,
      totalUSD: trolley.totalUSD,
      timestamp
    };

    io.to(normId).emit('CART_UPDATED', updatePayload);
    io.emit('CART_UPDATED', updatePayload);
  });

  // UPDATE_ITEM_QTY in cart
  socket.on('UPDATE_ITEM_QTY', ({ trolleyId, itemId, quantity }) => {
    const normId = normalizeTrolleyId(trolleyId);
    const trolley = trolleysState[normId];
    if (!trolley) return;

    if (quantity <= 0) {
      trolley.cartItems = trolley.cartItems.filter(i => i.id !== itemId && i.barcode !== itemId);
    } else {
      const item = trolley.cartItems.find(i => i.id === itemId || i.barcode === itemId);
      if (item) item.quantity = quantity;
    }

    recomputeTrolley(trolley);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const updatePayload = {
      trolleyId: normId,
      displayName: trolley.displayName,
      cartItems: trolley.cartItems,
      expectedWeight: trolley.expectedWeight,
      measuredWeight: trolley.measuredWeight,
      mismatchDeviation: trolley.mismatchDeviation,
      isBalanced: trolley.isBalanced,
      totalINR: trolley.totalINR,
      totalUSD: trolley.totalUSD,
      timestamp
    };

    io.to(normId).emit('CART_UPDATED', updatePayload);
    io.emit('CART_UPDATED', updatePayload);
  });

  // CLEAR_CART: Empties cart
  socket.on('CLEAR_CART', ({ trolleyId }) => {
    const normId = normalizeTrolleyId(trolleyId);
    const trolley = trolleysState[normId];
    if (!trolley) return;

    trolley.cartItems = [];
    trolley.mismatchDeviation = 0;
    recomputeTrolley(trolley);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const updatePayload = {
      trolleyId: normId,
      displayName: trolley.displayName,
      cartItems: [],
      expectedWeight: 0,
      measuredWeight: 0,
      mismatchDeviation: 0,
      isBalanced: true,
      totalINR: 0,
      totalUSD: 0,
      timestamp
    };

    io.to(normId).emit('CART_UPDATED', updatePayload);
    io.emit('CART_UPDATED', updatePayload);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Start Express and Socket.io server on 0.0.0.0
server.listen(PORT, '0.0.0.0', () => {
  const localIps = getLocalIpAddresses();
  console.log(`\n======================================================`);
  console.log(`🚀 Gokart AI Backend & Mobile Bridge Server Running!`);
  console.log(`📡 Local Port: ${PORT}`);
  console.log(`🌐 Localhost:  http://127.0.0.1:${PORT}`);
  console.log(`📱 Mobile Scanner URLs (on same Wi-Fi):`);
  localIps.forEach(ip => {
    console.log(`   ➜ [${ip.name}] http://${ip.address}:${PORT}/mobile-scan`);
  });
  console.log(`======================================================\n`);
});
