import {EventEmitter} from 'events';

/* Sockets Interface Class */
class Socket {
  constructor(ws = new WebSocket('ws://echo.websocket.org'), ee = new EventEmitter()) {
    this.ws = ws;
    this.ee = ee;
    ws.onmessage = this.message.bind(this);
    ws.onopen = this.open.bind(this);
    ws.onclose = this.close.bind(this);
  }

  // Subscribe Method
  on(name, fn) {
    this.ee.on(name, fn);
  }

  // Unsubscribe Method
  off(name, fn) {
    this.ee.removeListener(name, fn);
  }

  // Emit Method)
  emit(name, data) {
    const message = JSON.stringify({name, data});
    this.ws.send(message);
  }

  // Message Method
  message(e) {
    try {
      const message = JSON.parse(e.data);
      this.ee.emit(message.name, message.data);
    } catch(err) {
      this.ee.emit('error', err);
    }
  }

  // Connection Event
  open() {
    this.ee.emit('connect');
  }

  // Disconnection Event
  close() {
    this.ee.emit('disconnect');
  }
}

export default Socket;
