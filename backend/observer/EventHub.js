//Broadcast stock updates to all connected browsers via SSE.
const { randomUUID } = require('crypto');

class EventHub {
  static #instance;
  static get instance() {
    if (!this.#instance) this.#instance = new EventHub();
    return this.#instance;
  }

  constructor() {
    this.clients = new Map(); 
  }

  subscribe(res) {
    const id = randomUUID();
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.write(`event: ready\ndata: ${JSON.stringify({ id, ok: true })}\n\n`);
    this.clients.set(id, { res });
    res.on('close', () => this.clients.delete(id));
    return id;
  }

  emit(event, data) {
    const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const { res } of this.clients.values()) {
      try { res.write(msg); } catch (_) {} // ignore broken pipes
    }
  }
}

module.exports = EventHub;