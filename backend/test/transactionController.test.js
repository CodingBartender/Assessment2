// backend/test/transactionController.test.js
// ---------------- Transaction Controller Unit Tests ----------------

const chai = require('chai');
const sinon = require('sinon');
const transactionRepo = require('../repository/transactionRepository');
const transactionController = require('../controllers/transactionController');
const { expect } = chai;


describe('AddTransaction Function Test', () => {
  // Should create a new transaction successfully
  it('should create a new transaction successfully', async () => {
    const req = { body: { order_id: 'o1', buyer_id: 'b1', portfolio_id: 'p1', stock_id: 's1', transaction_type: 'BUY', quantity: 2, price: 100 } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    const fakeTransaction = { _id: 't1', ...req.body };
    const addStub = sinon.stub(transactionRepo, 'addTransaction').resolves(fakeTransaction);
    await transactionController.addTransaction(req, res);
    expect(addStub.calledOnceWith(req.body)).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(fakeTransaction)).to.be.true;
    addStub.restore();
  });

  // Should return 400 if repo throws error
  it('should return 400 if an error occurs', async () => {
    const req = { body: { order_id: 'o1' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    const addStub = sinon.stub(transactionRepo, 'addTransaction').throws(new Error('DB Error'));
    await transactionController.addTransaction(req, res);
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWithMatch({ error: 'DB Error' })).to.be.true;
    addStub.restore();
  });
});


describe('GetTransactionsByBuyer Function Test', () => {
  // Should return transactions for a buyer
  it('should return transactions for a buyer', async () => {
    const req = { params: { buyerId: 'b1' } };
    const res = { json: sinon.spy() };
    const fakeTxs = [{ _id: 't1' }, { _id: 't2' }];
    const getStub = sinon.stub(transactionRepo, 'getTransactionsByBuyer').resolves(fakeTxs);
    await transactionController.getTransactionsByBuyer(req, res);
    expect(getStub.calledOnceWith('b1')).to.be.true;
    expect(res.json.calledWith(fakeTxs)).to.be.true;
    getStub.restore();
  });

  // Should return 500 if repo throws error
  it('should return 500 if an error occurs', async () => {
    const req = { params: { buyerId: 'b1' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    const getStub = sinon.stub(transactionRepo, 'getTransactionsByBuyer').throws(new Error('DB Error'));
    await transactionController.getTransactionsByBuyer(req, res);
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ error: 'DB Error' })).to.be.true;
    getStub.restore();
  });
});


describe('GetTransactionsByStock Function Test', () => {
  // Should return transactions for a stock
  it('should return transactions for a stock', async () => {
    const req = { params: { stockId: 's1' } };
    const res = { json: sinon.spy() };
    const fakeTxs = [{ _id: 't1' }, { _id: 't2' }];
    const getStub = sinon.stub(transactionRepo, 'getTransactionsByStock').resolves(fakeTxs);
    await transactionController.getTransactionsByStock(req, res);
    expect(getStub.calledOnceWith('s1')).to.be.true;
    expect(res.json.calledWith(fakeTxs)).to.be.true;
    getStub.restore();
  });

  // Should return 500 if repo throws error
  it('should return 500 if an error occurs', async () => {
    const req = { params: { stockId: 's1' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    const getStub = sinon.stub(transactionRepo, 'getTransactionsByStock').throws(new Error('DB Error'));
    await transactionController.getTransactionsByStock(req, res);
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ error: 'DB Error' })).to.be.true;
    getStub.restore();
  });
});
