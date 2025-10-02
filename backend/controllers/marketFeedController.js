
const EventHub = require('../observer/EventHub');

// Facade: expose SSE subscription as a single method.
exports.stream = (_req, res) => {
  EventHub.instance.subscribe(res);
}; 