const { expect } = require('chai');
const sinon = require('sinon');

const stockController = require('../controllers/stockController');
const stockRepo = require('../repository/stockRepository');
const EventHub = require('../observer/EventHub');
const pricing = require('../strategy/PricingStrategy'); // module object

describe('stockController FR6 emits', () => {
  let sandbox;
  let res;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };
    // Don’t actually push to SSE in tests
    sandbox.stub(EventHub.instance, 'emit');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('createStock emits stock.updated with snapshot', async () => {
    // Strategy deterministic: echo signal (manual)
    sandbox.stub(pricing, 'getPricingStrategy').returns({
      compute: ({ current, signal }) =>
        typeof signal === 'number' ? signal : Number(current) || 0,
    });

    // Repo: echo payload and assign _id
    sandbox.stub(stockRepo, 'createStock').callsFake(async (doc) => ({
      ...doc,
      _id: 's1',
    }));

    const req = {
      body: {
        symbol: 'AAPL',
        company_name: 'Apple',
        current_price: 150,
        quantity: 8,
      },
    };

    await stockController.createStock(req, res);

    // Response was 201 + body sent
    expect(res.status.calledWith(201)).to.equal(true);
    expect(res.json.calledOnce).to.equal(true);

    // Emit happened with stock.updated and snapshot
    expect(EventHub.instance.emit.calledOnce).to.equal(true);
    const [evt, payload] = EventHub.instance.emit.firstCall.args;
    expect(evt).to.equal('stock.updated');
    expect(payload).to.include({
      _id: 's1',
      symbol: 'AAPL',
      company_name: 'Apple',
      current_price: 150,
      quantity: 8,
    });
  });

  it('updateStock emits stock.updated', async () => {
    // Strategy deterministic: return fixed 175 to prove it was used
    sandbox.stub(pricing, 'getPricingStrategy').returns({
      compute: () => 175,
    });

    // Controller reads current before computing next -> stub ONCE here
    sandbox.stub(stockRepo, 'getStockById').resolves({
      _id: 's1',
      symbol: 'AAPL',
      company_name: 'Apple',
      current_price: 160,
      quantity: 8,
    });

    sandbox.stub(stockRepo, 'updateStock').resolves({
      _id: 's1',
      symbol: 'AAPL',
      company_name: 'Apple',
      current_price: 175,
      quantity: 8,
      last_updated: new Date(),
    });

    const req = { params: { id: 's1' }, body: { current_price: 170 } };
    await stockController.updateStock(req, res);

    expect(EventHub.instance.emit.calledOnce).to.equal(true);
    const [evt, payload] = EventHub.instance.emit.firstCall.args;
    expect(evt).to.equal('stock.updated');
    expect(payload.current_price).to.equal(175);
    expect(res.json.calledOnce).to.equal(true);
  });

  it('deleteStock emits stock.deleted', async () => {
    // Stub current value so controller can include symbol in delete event
    sandbox.stub(stockRepo, 'getStockById').resolves({
      _id: 's1',
      symbol: 'AAPL',
      company_name: 'Apple',
      current_price: 150,
      quantity: 8,
    });
    sandbox.stub(stockRepo, 'deleteStock').resolves(true);

    const req = { params: { id: 's1' } };
    await stockController.deleteStock(req, res);

    expect(EventHub.instance.emit.calledOnce).to.equal(true);
    const [evt, payload] = EventHub.instance.emit.firstCall.args;
    expect(evt).to.equal('stock.deleted');
    expect(payload).to.deep.equal({ _id: 's1', symbol: 'AAPL' });

    expect(res.json.calledOnce).to.equal(true);
  });
});