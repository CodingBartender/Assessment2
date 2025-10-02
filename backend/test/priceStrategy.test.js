const { expect } = require('chai');
const sinon = require('sinon');

const stockController = require('../controllers/stockController');
const stockRepo = require('../repository/stockRepository');
const EventHub = require('../observer/EventHub');
const pricing = require('../strategy/PricingStrategy');

describe('stockController + Price Strategy integration', () => {
  let sandbox;
  let res;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    res = { status: sandbox.stub().returnsThis(), json: sandbox.spy() };
    // do not actually write to SSE in tests
    sandbox.stub(EventHub.instance, 'emit');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('createStock: uses strategy.compute(signal) to set current_price', async () => {
    // Strategy returns a fixed price regardless of input
    const computeStub = sandbox.stub().returns(123.45);
    sandbox.stub(pricing, 'getPricingStrategy').returns({ compute: computeStub });

    const payload = {
      symbol: 'ABC',
      company_name: 'ABC Inc',
      current_price: 99, // signal provided by Trader
      quantity: 10,
    };

    // Echo what controller passes into repo and add _id
    sandbox.stub(stockRepo, 'createStock').callsFake(async (p) => ({
      ...p,
      _id: 's1',
    }));

    await stockController.createStock({ body: payload }, res);

    // Repo received computed price
    const repoArg = stockRepo.createStock.firstCall.args[0];
    expect(repoArg.current_price).to.equal(123.45);

    // Strategy called once with a shape { current, signal }
    expect(computeStub.calledOnce).to.equal(true);
    const [{ current, signal }] = computeStub.firstCall.args;
    expect(signal).to.equal(99);
    // current may be same as signal in manual mode
    expect(typeof current).to.equal('number');

    // Response OK and an emit happened
    expect(res.status.calledWith(201)).to.equal(true);
    expect(EventHub.instance.emit.calledWith('stock.updated')).to.equal(true);
  });

  it('updateStock: uses strategy.compute(current, signal)', async () => {
    // Strategy returns a fixed computed price
    const computeStub = sandbox.stub().returns(222.22);
    sandbox.stub(pricing, 'getPricingStrategy').returns({ compute: computeStub });

    // Controller reads existing stock to supply `current` to strategy
    sandbox.stub(stockRepo, 'getStockById').resolves({
      _id: 's1',
      symbol: 'ABC',
      company_name: 'ABC Inc',
      current_price: 100,
      quantity: 10,
    });

    // After computing price, controller persists via repo
    sandbox.stub(stockRepo, 'updateStock').resolves({
      _id: 's1',
      symbol: 'ABC',
      company_name: 'ABC Inc',
      current_price: 222.22,
      quantity: 10,
      last_updated: new Date(),
    });

    const req = { params: { id: 's1' }, body: { current_price: 200 } };
    await stockController.updateStock(req, res);

    // Strategy was called with current (from DB) and signal (from request)
    expect(computeStub.calledOnce).to.equal(true);
    const [{ current, signal }] = computeStub.firstCall.args;
    expect(current).to.equal(100);
    expect(signal).to.equal(200);

    // Emit payload carries the computed price
    const [evt, payload] = EventHub.instance.emit.firstCall.args;
    expect(evt).to.equal('stock.updated');
    expect(payload.current_price).to.equal(222.22);

    // Responded with updated doc
    expect(res.json.calledOnce).to.equal(true);
    expect(res.json.firstCall.args[0].current_price).to.equal(222.22);
  });
});