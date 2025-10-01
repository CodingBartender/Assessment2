const { expect } = require('chai');
const sinon = require('sinon');
const transactionRepo = require('../repository/transactionRepository');
const transactionController = require('../controllers/transactionController');
const Stock = require('../models/Stock');
const EventHub = require('../observer/EventHub');

describe('transactionController FR6 emits & qty update', () => {
  let sandbox;

  beforeEach(() => { sandbox = sinon.createSandbox(); });
  afterEach(() => { sandbox.restore(); });

  it('BUY decreases stock.quantity, emits stock.traded and stock.updated', async () => {
    const tx = { _id: 't1', stock_id: 's1', transaction_type: 'BUY', quantity: 2, price: 100 };
    sandbox.stub(transactionRepo, 'addTransaction').resolves(tx);

    const stockDoc = { _id: 's1', symbol: 'AAPL', company_name: 'Apple', current_price: 100, quantity: 10, last_updated: null, save: sandbox.stub().resolvesThis() };
    sandbox.stub(Stock, 'findById').resolves(stockDoc);

    const emit = sandbox.stub(EventHub.instance, 'emit');

    const req = { body: tx };
    const res = { status: sandbox.stub().returnsThis(), json: sandbox.spy() };
    await transactionController.addTransaction(req, res);

    expect(stockDoc.quantity).to.equal(8);     // 10 - 2
    expect(emit.calledTwice).to.equal(true);   // traded + updated
    expect(emit.firstCall.args[0]).to.equal('stock.traded');
    expect(emit.secondCall.args[0]).to.equal('stock.updated');
    expect(res.status.calledWith(201)).to.equal(true);
  });

  it('SELL increases stock.quantity, emits stock.traded and stock.updated', async () => {
    const tx = { _id: 't2', stock_id: 's1', transaction_type: 'SELL', quantity: 3, price: 100 };
    sandbox.stub(transactionRepo, 'addTransaction').resolves(tx);

    const stockDoc = { _id: 's1', symbol: 'AAPL', company_name: 'Apple', current_price: 100, quantity: 5, last_updated: null, save: sandbox.stub().resolvesThis() };
    sandbox.stub(Stock, 'findById').resolves(stockDoc);

    const emit = sandbox.stub(EventHub.instance, 'emit');

    const req = { body: tx };
    const res = { status: sandbox.stub().returnsThis(), json: sandbox.spy() };
    await transactionController.addTransaction(req, res);

    expect(stockDoc.quantity).to.equal(8);     // 5 + 3
    expect(emit.calledTwice).to.equal(true);
    expect(emit.firstCall.args[0]).to.equal('stock.traded');
    expect(emit.secondCall.args[0]).to.equal('stock.updated');
  });
});