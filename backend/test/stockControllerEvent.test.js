const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const stockController = require('../controllers/stockController');
const stockRepo = require('../repository/stockRepository');
const EventHub = require('../observer/EventHub');

describe('stockController FR6 emits', () => {
  let res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    res = { status: sandbox.stub().returnsThis(), json: sandbox.spy() };
  });

  afterEach(() => sandbox.restore());

  it('createStock emits stock.updated with snapshot', async () => {
    const mock = { _id: '1', symbol: 'AAPL', company_name: 'Apple', current_price: 123, quantity: 10, last_updated: new Date() };
    sandbox.stub(stockRepo, 'createStock').resolves(mock);
    const emit = sandbox.stub(EventHub.instance, 'emit');

    const req = { body: { symbol: 'AAPL', company_name: 'Apple', current_price: 123, quantity: 10 } };
    await stockController.createStock(req, res);

    expect(emit.calledOnce).to.equal(true);
    const [event, payload] = emit.firstCall.args;
    expect(event).to.equal('stock.updated');
    expect(payload.symbol).to.equal('AAPL');
    expect(res.status.calledWith(201)).to.equal(true);
  });

  it('updateStock emits stock.updated', async () => {
    const updated = { _id: '1', symbol: 'AAPL', company_name: 'Apple', current_price: 150, quantity: 8, last_updated: new Date() };
    sandbox.stub(stockRepo, 'updateStock').resolves(updated);
    const emit = sandbox.stub(EventHub.instance, 'emit');

    const req = { params: { id: '1' }, body: { current_price: 150 } };
    await stockController.updateStock(req, res);

    expect(emit.calledOnce).to.equal(true);
    expect(emit.firstCall.args[0]).to.equal('stock.updated');
    expect(emit.firstCall.args[1].current_price).to.equal(150);
  });

  it('deleteStock emits stock.deleted', async () => {
    const existing = { _id: '1', symbol: 'AAPL', logo: null };
    sandbox.stub(stockRepo, 'getStockById').resolves(existing);
    sandbox.stub(stockRepo, 'deleteStock').resolves();
    sandbox.stub(fs, 'unlink').callsFake((_, cb) => cb && cb());
    const emit = sandbox.stub(EventHub.instance, 'emit');

    const req = { params: { id: '1' } };
    await stockController.deleteStock(req, res);

    expect(emit.calledOnce).to.equal(true);
    const [event, payload] = emit.firstCall.args;
    expect(event).to.equal('stock.deleted');
    expect(payload._id).to.equal('1');
  });
});