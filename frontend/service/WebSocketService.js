import { WS_BASE_URL } from './APIpath';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = [];
    this.currentSchedule = null;
    this.userId = null;
    this.reconnectDelay = 1000;
    this.forcedClose = false;
  }

  connect(scheduleId, userId) {
    this.currentSchedule = String(scheduleId);
    this.userId = userId;
    this.forcedClose = false;

    const url = `${WS_BASE_URL}/seats/${this.currentSchedule}`;

    if (this.ws) {
      try { this.ws.close(); } catch (e) {}
      this.ws = null;
    }

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected to', url);
      this.reconnectDelay = 1000;
    };

    this.ws.onmessage = (event) => {
      let data = event.data;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        // keep raw
      }
      this.listeners.forEach(listener => listener(data));
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = (ev) => {
      console.log('WebSocket disconnected', ev.code, ev.reason);
      this.ws = null;
      if (!this.forcedClose) {
        // reconnect with backoff
        setTimeout(() => this.connect(this.currentSchedule, this.userId), this.reconnectDelay);
        this.reconnectDelay = Math.min(30000, this.reconnectDelay * 1.5);
      }
    };
  }

  disconnect() {
    this.forcedClose = true;
    if (this.ws) {
      try { this.ws.close(); } catch (e) {}
      this.ws = null;
    }
    this.currentSchedule = null;
    this.userId = null;
  }

  send(obj) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const payload = typeof obj === 'string' ? obj : JSON.stringify(obj);
      this.ws.send(payload);
    } else {
      console.warn('WebSocket is not connected, cannot send', obj);
    }
  }

  lock(seatId, expires = 120) {
    this.send({ type: 'lock', seatId, userId: this.userId, expires });
  }

  unlock(seatId) {
    this.send({ type: 'unlock', seatId, userId: this.userId });
  }

  extend(seatId, extra = 60) {
    this.send({ type: 'extend', seatId, userId: this.userId, extra });
  }

  confirm(gheIds, phuong_thuc = 'WS', tong_gia = null) {
    const payload = { type: 'confirm', gheIds, userId: this.userId, phuong_thuc };
    if (tong_gia !== null) payload.tong_gia = tong_gia;
    this.send(payload);
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }
}

const wsService = new WebSocketService();
export default wsService;