// LocalStorage Persistence Utility for Gokart AI Demo Sessions
const STORAGE_KEYS = {
  CART: 'gokart_cart_items_v2',
  MISMATCH: 'gokart_mismatch_deviation_v2',
  TROLLEYS: 'gokart_fleet_trolleys_v2',
  LOGS: 'gokart_activity_logs_v2',
  CURRENCY: 'gokart_currency_pref_v2'
};

export const loadStoredCart = (defaultItems) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Error loading stored cart:", e);
  }
  return defaultItems;
};

export const saveStoredCart = (items) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  } catch (e) {
    console.warn("Error saving cart:", e);
  }
};

export const loadStoredMismatch = (defaultVal = 0) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MISMATCH);
    if (raw !== null) return JSON.parse(raw);
  } catch (e) {
    console.warn("Error loading stored mismatch:", e);
  }
  return defaultVal;
};

export const saveStoredMismatch = (deviation) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MISMATCH, JSON.stringify(deviation));
  } catch (e) {
    console.warn("Error saving mismatch:", e);
  }
};

export const loadStoredTrolleys = (defaultTrolleys) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TROLLEYS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Error loading stored trolleys:", e);
  }
  return defaultTrolleys;
};

export const saveStoredTrolleys = (trolleys) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TROLLEYS, JSON.stringify(trolleys));
  } catch (e) {
    console.warn("Error saving trolleys:", e);
  }
};

export const loadStoredLogs = (defaultLogs) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Error loading stored logs:", e);
  }
  return defaultLogs;
};

export const saveStoredLogs = (logs) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs.slice(0, 50))); // Keep last 50
  } catch (e) {
    console.warn("Error saving logs:", e);
  }
};

export const clearAllStoredData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.warn("Error clearing storage:", e);
  }
};
