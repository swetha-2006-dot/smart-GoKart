import { io } from 'socket.io-client';

// Determine Socket server host dynamically:
// If page is loaded on 192.168.0.105:5173, socket connects to 192.168.0.105:5000
const getSocketUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:5000';
  const hostname = window.location.hostname || 'localhost';
  return `http://${hostname}:5000`;
};

export const socket = io(getSocketUrl(), {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 15,
  reconnectionDelay: 1000,
  timeout: 5000
});

// Socket helper functions
export const joinTrolleySession = (trolleyId = 'trolley_04') => {
  if (socket.connected) {
    socket.emit('JOIN_SESSION', { trolleyId });
  }
};

export const sendScannedItem = (payload) => {
  socket.emit('ITEM_SCANNED', payload);
};

export const sendWeightUpdate = (payload) => {
  socket.emit('WEIGHT_UPDATE', payload);
};

export const sendCalibrateReset = (trolleyId = 'trolley_04') => {
  socket.emit('CALIBRATE_RESET', { trolleyId });
};

export const sendRemoveItem = (trolleyId, itemId) => {
  socket.emit('REMOVE_ITEM', { trolleyId, itemId });
};

export const sendUpdateQty = (trolleyId, itemId, quantity) => {
  socket.emit('UPDATE_ITEM_QTY', { trolleyId, itemId, quantity });
};

export const sendClearCart = (trolleyId = 'trolley_04') => {
  socket.emit('CLEAR_CART', { trolleyId });
};
