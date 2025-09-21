import { WS_BASE_URL } from './APIpath';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = [];
  }

  connect() {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(WS_BASE_URL);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      // Gửi message chào mừng nếu cần
      this.sendMessage('Hello from React Native!');
    };

    this.ws.onmessage = (event) => {
      console.log('Received:', event.data);
      // Thông báo cho các listener
      this.listeners.forEach(listener => listener(event.data));
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Tự động reconnect nếu cần
      setTimeout(() => this.connect(), 5000);
    };
  }

  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

const wsService = new WebSocketService();
export default wsService;