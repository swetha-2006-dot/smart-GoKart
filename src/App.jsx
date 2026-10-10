import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/landing/LandingPage';
import AuthModal from './components/auth/AuthModal';
import CustomerView from './components/customer/CustomerView';
import AdminDashboard from './components/admin/AdminDashboard';
import MobileScanView from './components/mobile/MobileScanView';
import MobilePairingModal from './components/MobilePairingModal';
import CheckoutModal from './components/customer/CheckoutModal';
import { MOCK_CATALOG, INITIAL_TROLLEYS, INITIAL_AUDIT_LOGS } from './data/mockCatalog';
import { soundFX } from './utils/audio';
import { 
  socket, 
  joinTrolleySession, 
  sendScannedItem, 
  sendWeightUpdate, 
  sendCalibrateReset,
  sendRemoveItem,
  sendUpdateQty,
  sendClearCart
} from './utils/socket';
import { 
  loadStoredCart, 
  saveStoredCart, 
  loadStoredMismatch, 
  saveStoredMismatch, 
  loadStoredTrolleys, 
  saveStoredTrolleys, 
  loadStoredLogs, 
  saveStoredLogs,
  clearAllStoredData
} from './utils/storage';
import { CheckCircle2, Sparkles, Smartphone, ShieldAlert, AlertTriangle, RotateCcw, LogOut } from 'lucide-react';

export default function App() {
  // Determine initial view from URL query params or path (e.g. ?mode=mobile or /mobile-scan)
  const getInitialView = () => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const path = window.location.pathname;
      if (search.includes('mode=mobile') || path.includes('/mobile-scan')) {
        return 'mobile';
      }
    }
    // Prompt Requirement 3: Default to Landing Page on launch
    return 'landing';
  };

  const [currentView, setCurrentView] = useState(getInitialView); // 'landing', 'customer', 'admin', 'mobile'
  const [currentUser, setCurrentUser] = useState(null); // { role, name, trolleyId }
  const [currency, setCurrency] = useState('INR'); // 'INR' or 'USD'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalRole, setAuthModalRole] = useState('customer'); // 'customer' or 'admin'

  // Socket Connection State & Modals
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [showMobilePairingModal, setShowMobilePairingModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Floating Toast Notification State
  const [toastNotification, setToastNotification] = useState(null);

  // Default initial cart items
  const defaultInitialCart = [
    { ...MOCK_CATALOG[0], quantity: 1 }, // Milk: 1000g, ₹60
    { ...MOCK_CATALOG[1], quantity: 1 }  // Bread: 400g, ₹40
  ];

  // Cart Items with LocalStorage persistence
  const [cartItems, setCartItems] = useState(() => loadStoredCart(defaultInitialCart));

  // Load cell weight deviation simulation with LocalStorage persistence
  const [mismatchDeviation, setMismatchDeviation] = useState(() => loadStoredMismatch(0));
  
  // AI CV Verification animation state
  const [lastScannedItem, setLastScannedItem] = useState(MOCK_CATALOG[0]);
  const [verificationFlash, setVerificationFlash] = useState(false);

  // Admin Fleet Trolleys State with LocalStorage persistence
  const [trolleys, setTrolleys] = useState(() => loadStoredTrolleys(INITIAL_TROLLEYS));
  
  // Audit Logs State with LocalStorage persistence
  const [logs, setLogs] = useState(() => loadStoredLogs(INITIAL_AUDIT_LOGS));

  // Inspection modal state
  const [inspectedTrolley, setInspectedTrolley] = useState(null);

  // Computed weights for Trolley #04
  const expectedWeight = cartItems.reduce((acc, item) => acc + (item.weightGrams * item.quantity), 0);
  const measuredWeight = expectedWeight + mismatchDeviation;
  const hasMismatchAlert = Math.abs(mismatchDeviation) > 15;

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Helper to trigger floating toast notification
  const triggerToast = (title, subtitle, type = 'success') => {
    setToastNotification({ title, subtitle, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 3400);
  };

  // -------------------------------------------------------------
  // AUTHENTICATION LOGIC (Prompt Requirement 2 & 3)
  // -------------------------------------------------------------
  const handleOpenAuth = (targetRole = 'customer') => {
    setAuthModalRole(targetRole);
    setShowAuthModal(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowAuthModal(false);

    if (user.role === 'customer') {
      setCurrentView('customer');
      triggerToast(
        "Welcome to Smart Shopping!",
        `Authenticated as Guest. Paired with ${user.trolleyName || 'Trolley #04'}.`
      );
    } else {
      setCurrentView('admin');
      triggerToast(
        "Admin Console Authenticated",
        `Welcome, Store Manager! Live fleet telemetry unlocked.`
      );
    }
  };

  const handleLogout = () => {
    soundFX.playClick();
    setCurrentUser(null);
    setCurrentView('landing');
    triggerToast(
      "Session Ended",
      "Returned to Gokart AI Public Landing Page."
    );
  };

  // -------------------------------------------------------------
  // LOCALSTORAGE PERSISTENCE SYNC
  // -------------------------------------------------------------
  useEffect(() => {
    saveStoredCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    saveStoredMismatch(mismatchDeviation);
  }, [mismatchDeviation]);

  useEffect(() => {
    saveStoredTrolleys(trolleys);
  }, [trolleys]);

  useEffect(() => {
    saveStoredLogs(logs);
  }, [logs]);

  // -------------------------------------------------------------
  // REAL-TIME SOCKET.IO BRIDGE INTEGRATION
  // -------------------------------------------------------------
  useEffect(() => {
    const onConnect = () => {
      setIsSocketConnected(true);
      joinTrolleySession('trolley_04');
    };

    const onDisconnect = () => {
      setIsSocketConnected(false);
    };

    // When CART_UPDATED arrives from mobile phone scanner in <200ms:
    const onCartUpdated = (data) => {
      if (data.trolleyId === 'trolley_04' || data.displayName === 'Trolley #04') {
        if (data.cartItems) {
          setCartItems(data.cartItems);
        }
        if (data.mismatchDeviation !== undefined) {
          setMismatchDeviation(data.mismatchDeviation);
        }

        // If a new item was scanned from the mobile phone
        if (data.lastItem) {
          setLastScannedItem(data.lastItem);
          setVerificationFlash(true);
          soundFX.playVerified();

          // Smooth Toast Notification for successful item addition
          triggerToast(
            "AI Computer Vision & Barcode Verified",
            `${data.lastItem.shortName || data.lastItem.name} (${data.lastItem.weightGrams}g) added via Mobile Bridge`
          );

          setTimeout(() => {
            setVerificationFlash(false);
          }, 2800);
        }
      }

      // Update fleet trolleys in real-time
      setTrolleys(prev => prev.map(t => {
        const normId = t.id.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
        if (normId === data.trolleyId || t.id === data.displayName) {
          return {
            ...t,
            itemCount: data.cartItems ? data.cartItems.reduce((acc, i) => acc + i.quantity, 0) : t.itemCount,
            totalINR: data.totalINR !== undefined ? data.totalINR : t.totalINR,
            totalUSD: data.totalUSD !== undefined ? data.totalUSD : t.totalUSD,
            weightExpected: data.expectedWeight !== undefined ? data.expectedWeight : t.weightExpected,
            weightMeasured: data.measuredWeight !== undefined ? data.measuredWeight : t.weightMeasured,
            isBalanced: data.isBalanced !== undefined ? data.isBalanced : t.isBalanced,
            mismatchDeviation: data.mismatchDeviation !== undefined ? data.mismatchDeviation : t.mismatchDeviation
          };
        }
        return t;
      }));
    };

    // When TELEMETRY_ALERT arrives:
    const onTelemetryAlert = (alertData) => {
      soundFX.playAlert();
      triggerToast(
        "Security Alert: Weight Anomaly",
        alertData.message,
        'danger'
      );
    };

    // When TELEMETRY_LOG arrives:
    const onTelemetryLog = (logEntry) => {
      setLogs(prev => [logEntry, ...prev]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('CART_UPDATED', onCartUpdated);
    socket.on('TELEMETRY_ALERT', onTelemetryAlert);
    socket.on('TELEMETRY_LOG', onTelemetryLog);

    setIsSocketConnected(socket.connected);
    if (socket.connected) {
      joinTrolleySession('trolley_04');
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('CART_UPDATED', onCartUpdated);
      socket.off('TELEMETRY_ALERT', onTelemetryAlert);
      socket.off('TELEMETRY_LOG', onTelemetryLog);
    };
  }, []);

  // Synchronize Trolley #04 in Admin Fleet when cart items or weight changes locally
  useEffect(() => {
    const totalINR = cartItems.reduce((acc, item) => acc + (item.priceINR * item.quantity), 0);
    const totalUSD = cartItems.reduce((acc, item) => acc + (item.priceUSD * item.quantity), 0);
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    setTrolleys(prev => prev.map(t => {
      if (t.id === 'Trolley #04') {
        return {
          ...t,
          itemCount: count,
          totalINR,
          totalUSD,
          weightExpected: expectedWeight,
          weightMeasured: measuredWeight,
          isBalanced: !hasMismatchAlert,
          mismatchDeviation: mismatchDeviation,
          items: cartItems.map(i => ({ name: i.shortName, qty: i.quantity, weight: i.weightGrams * i.quantity }))
        };
      }
      return t;
    }));
  }, [cartItems, expectedWeight, measuredWeight, hasMismatchAlert, mismatchDeviation]);

  // Handle Scanning an Item locally on Laptop (Emits to Socket for all viewers)
  const handleItemScanned = (catalogItem) => {
    setLastScannedItem(catalogItem);
    setVerificationFlash(true);
    soundFX.playVerified();

    triggerToast(
      "AI Computer Vision & Barcode Verified",
      `${catalogItem.shortName} (${catalogItem.weightGrams}g) matched and deposited.`
    );

    sendScannedItem({
      trolleyId: 'trolley_04',
      barcode: catalogItem.barcode,
      itemName: catalogItem.name || catalogItem.shortName,
      price: catalogItem.priceINR,
      weight: catalogItem.weightGrams,
      timestamp: getTimestamp()
    });

    setTimeout(() => {
      setVerificationFlash(false);
    }, 2800);
  };

  // Anti-Theft Mismatch Simulation
  const handleTriggerMismatch = (addedGrams = 50) => {
    soundFX.playAlert();
    setMismatchDeviation(addedGrams);

    triggerToast(
      "Security Alert: Weight Anomaly Detected",
      `Measured load deviation +${addedGrams}g. Smart wheel brakes clamped!`,
      'danger'
    );

    sendWeightUpdate({
      trolleyId: 'trolley_04',
      mismatchDeviation: addedGrams,
      status: "mismatch_triggered"
    });
  };

  // Calibrate & Reset Weight Balance
  const handleCalibrateReset = () => {
    soundFX.playCalibrate();
    setMismatchDeviation(0);

    triggerToast(
      "Load Cell Tare Recalibrated",
      "Sensor zero balanced to 0.0g. Trolley brakes disengaged."
    );

    sendCalibrateReset('trolley_04');
  };

  // Update item quantity in cart
  const handleUpdateQty = (itemId, newQty) => {
    sendUpdateQty('trolley_04', itemId, newQty);
  };

  // Remove single item from cart
  const handleRemoveItem = (itemId) => {
    sendRemoveItem('trolley_04', itemId);
  };

  // Empty cart
  const handleClearCart = () => {
    sendClearCart('trolley_04');
  };

  // Reset session after successful payment checkout
  const handleSuccessfulPayment = (paymentData) => {
    setCartItems([]);
    setMismatchDeviation(0);
    sendClearCart('trolley_04');

    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: getTimestamp(),
      trolleyId: "Trolley #04",
      type: "CHECKOUT",
      message: `Checkout Complete (${paymentData.method}). Paid ₹${paymentData.amountINR}. TXN: ${paymentData.transactionId}. Gate exit pass armed.`,
      severity: "success"
    };
    setLogs(prev => [newLog, ...prev]);

    triggerToast(
      "Payment Verified ✓ - Checkout Complete",
      `Transaction ${paymentData.transactionId} authorized. Cart reset for next customer.`
    );
  };

  // Admin action: Resolve mismatch on any trolley (Action 1: Approve Override)
  const handleResolveTrolleyMismatch = (trolleyId) => {
    const normId = trolleyId.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    
    if (trolleyId === 'Trolley #04') {
      handleCalibrateReset();
    } else {
      setTrolleys(prev => prev.map(t => {
        if (t.id === trolleyId || t.id.toLowerCase().replace(/[^a-z0-9]/g, '_') === normId) {
          return {
            ...t,
            isBalanced: true,
            weightMeasured: t.weightExpected,
            mismatchDeviation: 0
          };
        }
        return t;
      }));

      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: getTimestamp(),
        trolleyId,
        type: "SYSTEM",
        message: `Admin Override Approved for ${trolleyId}. False alarm cleared & load cell tare restored.`,
        severity: "neutral"
      };
      setLogs(prev => [newLog, ...prev]);
    }

    triggerToast(
      "Override Approved: False Alarm Cleared",
      `${trolleyId} restored to Green Balanced state. Brakes released.`
    );

    sendCalibrateReset(normId);

    if (inspectedTrolley && inspectedTrolley.id === trolleyId) {
      setInspectedTrolley(prev => ({
        ...prev,
        isBalanced: true,
        weightMeasured: prev.weightExpected,
        mismatchDeviation: 0
      }));
    }
  };

  // Admin action: Trigger Security Lockdown & Alert Floor Staff (Action 2)
  const handleTriggerSecurityLock = (trolleyId, reason) => {
    soundFX.playAlert();

    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: getTimestamp(),
      trolleyId,
      type: "ALERT",
      message: `CRITICAL SECURITY LOCKDOWN triggered for ${trolleyId}! Electromagnetic wheel brakes clamped. Floor staff alerted: ${reason}`,
      severity: "danger"
    };
    setLogs(prev => [newLog, ...prev]);

    triggerToast(
      "Security Lockdown Triggered",
      `${trolleyId} wheel solenoids locked. Floor security dispatched!`,
      'danger'
    );
  };

  // Admin action: Simulate live fleet packet updates
  const handleSimulateFleetActivity = () => {
    const randomItems = [
      { name: "Epigamia Greek Yogurt", barcode: "8905544332211", weight: 200, price: 95 },
      { name: "Dark Roast Coffee", barcode: "8908002019912", weight: 250, price: 380 },
      { name: "Artisan Sourdough", barcode: "8901491101235", weight: 400, price: 40 }
    ];
    const pickedItem = randomItems[Math.floor(Math.random() * randomItems.length)];
    const targetTrolleys = ['trolley_01', 'trolley_05'];
    const chosenTrolley = targetTrolleys[Math.floor(Math.random() * targetTrolleys.length)];

    sendScannedItem({
      trolleyId: chosenTrolley,
      barcode: pickedItem.barcode,
      itemName: pickedItem.name,
      price: pickedItem.price,
      weight: pickedItem.weight,
      timestamp: getTimestamp()
    });
  };

  // Presenter utility: Reset all demo data to default clean slate
  const handleResetDemoData = () => {
    soundFX.playClick();
    clearAllStoredData();
    setCartItems(defaultInitialCart);
    setMismatchDeviation(0);
    setTrolleys(INITIAL_TROLLEYS);
    setLogs(INITIAL_AUDIT_LOGS);
    triggerToast("Demo State Reset", "LocalStorage wiped and restored to default initial state.");
  };

  const activeAlertCount = trolleys.filter(t => !t.isBalanced).length;

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-['Plus_Jakarta_Sans'] text-slate-800 relative">
      
      {/* FLOATING NOTIFICATION TOAST (<200ms real-time feedback) */}
      {toastNotification && (
        <div className="fixed top-20 right-6 z-50 animate-bounce transition-all">
          <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center space-x-3 max-w-sm ${
            toastNotification.type === 'danger'
              ? 'bg-rose-950/95 text-white border-rose-500 shadow-rose-900/40'
              : 'bg-slate-900/95 text-white border-emerald-500 shadow-emerald-900/30'
          }`}>
            <div className={`p-2 rounded-xl shrink-0 ${
              toastNotification.type === 'danger' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
            }`}>
              {toastNotification.type === 'danger' ? <ShieldAlert className="w-5 h-5" /> : <Sparkles className="w-5 h-5 text-white" />}
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                {toastNotification.title}
              </h5>
              <p className="text-xs text-slate-200 mt-0.5 leading-snug">
                {toastNotification.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main App View Routing */}
      {currentView === 'landing' ? (
        /* 1. PUBLIC PASTEL LANDING PAGE (Prompt Requirement 1) */
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onDirectEnterCustomer={() => handleLoginSuccess({ role: 'customer', name: 'Guest', trolleyId: 'trolley_04', trolleyName: 'Trolley #04' })}
          onDirectEnterAdmin={() => handleLoginSuccess({ role: 'admin', name: 'Store Manager', username: 'admin@gokart.ai' })}
        />
      ) : (
        /* Authenticated Views (Customer, Admin, Mobile) */
        <>
          {/* Top Navigation Bar with Exit Session button */}
          <Navbar
            currentView={currentView}
            setCurrentView={setCurrentView}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            currency={currency}
            setCurrency={setCurrency}
            hasMismatchAlert={hasMismatchAlert}
            activeAlertCount={activeAlertCount}
            isSocketConnected={isSocketConnected}
            onOpenMobilePairing={() => setShowMobilePairingModal(true)}
            currentUser={currentUser}
            onLogout={handleLogout}
          />

          {/* Main App Content View */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {currentView === 'customer' ? (
              <CustomerView
                cartItems={cartItems}
                onItemScanned={handleItemScanned}
                lastScannedItem={lastScannedItem}
                verificationFlash={verificationFlash}
                expectedWeight={expectedWeight}
                measuredWeight={measuredWeight}
                mismatchDeviation={mismatchDeviation}
                onTriggerMismatch={handleTriggerMismatch}
                onCalibrateReset={handleCalibrateReset}
                hasMismatchAlert={hasMismatchAlert}
                onUpdateQty={handleUpdateQty}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                onResetSession={handleSuccessfulPayment}
                onOpenCheckoutModal={() => setShowCheckoutModal(true)}
                currency={currency}
              />
            ) : currentView === 'admin' ? (
              <AdminDashboard
                trolleys={trolleys}
                logs={logs}
                onClearLogs={() => setLogs([])}
                currency={currency}
                onInspectTrolley={(t) => setInspectedTrolley(t)}
                inspectedTrolley={inspectedTrolley}
                onCloseInspect={() => setInspectedTrolley(null)}
                onResolveTrolleyMismatch={handleResolveTrolleyMismatch}
                onTriggerSecurityLock={handleTriggerSecurityLock}
                onSimulateFleetActivity={handleSimulateFleetActivity}
              />
            ) : (
              <MobileScanView onReturnToDashboard={() => setCurrentView('customer')} />
            )}
          </main>

          {/* Full-Screen Pastel Checkout & Payment Modal */}
          <CheckoutModal
            isOpen={showCheckoutModal}
            onClose={() => setShowCheckoutModal(false)}
            cartItems={cartItems}
            currency={currency}
            onSuccessfulPayment={handleSuccessfulPayment}
          />

          {/* Mobile Pairing QR Modal */}
          <MobilePairingModal
            isOpen={showMobilePairingModal}
            onClose={() => setShowMobilePairingModal(false)}
            isSocketConnected={isSocketConnected}
          />

          {/* Modern Footer with LocalStorage Demo Reset Tool */}
          <footer className="mt-auto py-6 border-t border-slate-200/80 bg-white/70 backdrop-blur-sm text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-700 font-['Outfit']">Gokart AI</span>
                <span>• Next-Gen Autonomous Retail Architecture</span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                <button
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-rose-600 flex items-center gap-1 transition"
                  title="Return to Landing Page"
                >
                  <LogOut className="w-3 h-3 text-rose-500" />
                  <span>Exit Session</span>
                </button>
                <span>•</span>
                <button
                  onClick={handleResetDemoData}
                  className="text-slate-500 hover:text-slate-800 underline flex items-center gap-1 transition"
                  title="Reset LocalStorage and reload initial state"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Demo State</span>
                </button>
                <span>•</span>
                <span>NPCI UPI 2.0 Ready</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* DUAL-ROLE AUTHENTICATION MODAL (Prompt Requirement 2) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialRole={authModalRole}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
