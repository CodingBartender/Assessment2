
const EventHub = require('../observer/EventHub');

exports.stream = (_req, res) => {
  EventHub.instance.subscribe(res);
}; 