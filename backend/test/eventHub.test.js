const { expect } = require('chai');
const sinon = require('sinon');
const EventHub = require('../observer/EventHub');

describe('EventHub (Observer + Singleton)', () => {
  afterEach(() => {
    for (const { res } of EventHub.instance.clients.values()) {
      try { res.end && res.end(); } catch (_) {}
    }
    EventHub.instance.clients.clear();
    sinon.restore();
  });

  it('subscribes a client and sends ready event with SSE headers', () => {
    const res = {
      writeHead: sinon.spy(),
      write: sinon.spy(),
      end: sinon.spy(),
      on: (evt, cb) => { if (evt === 'close') res._onClose = cb; },
    };

    const id = EventHub.instance.subscribe(res);
    expect(id).to.be.a('string');
    expect(res.writeHead.calledOnce).to.equal(true);
    const [status, headers] = res.writeHead.firstCall.args;
    expect(status).to.equal(200);
    expect(headers['Content-Type']).to.equal('text/event-stream');
    expect(res.write.called).to.equal(true);
    expect(res.write.firstCall.args[0]).to.match(/^event: ready\n/);

    res._onClose && res._onClose();
    expect(EventHub.instance.clients.size).to.equal(0);
  });

  it('emits an event payload to all clients', () => {
  const res1 = { writeHead(){}, write: sinon.spy(), on(){} };
  const res2 = { writeHead(){}, write: sinon.spy(), on(){} };
  EventHub.instance.subscribe(res1);
  EventHub.instance.subscribe(res2);

  const payload = { hello: 'world' };
  EventHub.instance.emit('stock.updated', payload);

  const calls1 = res1.write.getCalls().map(c => String(c.args[0]));
  const calls2 = res2.write.getCalls().map(c => String(c.args[0]));
  expect(calls1.some(m => m.includes('event: stock.updated'))).to.equal(true);
  expect(calls1.some(m => m.includes(JSON.stringify(payload)))).to.equal(true);
  expect(calls2.some(m => m.includes('event: stock.updated'))).to.equal(true);
});
});