const chai = require('chai');
const sinon = require('sinon');
const orderRepo = require('../repository/orderRepository');
const orderController = require('../controllers/orderController');
const { expect } = chai;

describe('Order Controller', () => {
  afterEach(() => sinon.restore());

  describe('createOrder', () => {
    // Basic test cases for createOrder
    it('should create an order and return 201', async () => {
      const req = { user: { id: 'buyer1' }, body: { portfolio_id: 'p1', price: 10, quantity: 2 } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      const fakeOrder = { _id: 'order1', ...req.body, buyer_id: 'buyer1' };
      sinon.stub(orderRepo, 'createOrder').resolves(fakeOrder);
      await orderController.createOrder(req, res);
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(fakeOrder)).to.be.true;
    });

    // Should return 400 if buyer_id is missing
    it('should return 400 if buyer_id is missing', async () => {
      const req = { body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await orderController.createOrder(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'buyer_id is required' })).to.be.true;
    });
    it('should handle repo error', async () => {
      const req = { user: { id: 'buyer1' }, body: { portfolio_id: 'p1', price: 10, quantity: 2 } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      sinon.stub(orderRepo, 'createOrder').rejects(new Error('fail'));
      await orderController.createOrder(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'fail' })).to.be.true;
    });
  });

  describe('getOrders', () => {
    it('should return orders for a user', async () => {
      const req = { params: { id: 'buyer1' } };
      const res = { json: sinon.spy() };
      const fakeOrders = [{ _id: 'o1' }, { _id: 'o2' }];
      sinon.stub(orderRepo, 'getOrdersByUser').resolves(fakeOrders);
      await orderController.getOrders(req, res);
      expect(res.json.calledWith(fakeOrders)).to.be.true;
    });
    it('should handle repo error', async () => {
      const req = { params: { id: 'buyer1' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      sinon.stub(orderRepo, 'getOrdersByUser').rejects(new Error('fail'));
      await orderController.getOrders(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'fail' })).to.be.true;
    });
  });

  describe('getOrderById', () => {
    it('should return an order if found', async () => {
      const req = { params: { id: 'order1' }, user: { id: 'buyer1' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      sinon.stub(orderRepo, 'getOrderById').resolves({ _id: 'order1' });
      await orderController.getOrderById(req, res);
      expect(res.json.calledWithMatch({ _id: 'order1' })).to.be.true;
    });
    it('should return 404 if not found', async () => {
      const req = { params: { id: 'order1' }, user: { id: 'buyer1' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      sinon.stub(orderRepo, 'getOrderById').resolves(null);
      await orderController.getOrderById(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'Order not found' })).to.be.true;
    });
  });

  describe('updateOrder', () => {
    it('should update and return the order', async () => {
      const req = { params: { id: 'order1' }, user: { id: 'buyer1' }, body: { quantity: 5 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      sinon.stub(orderRepo, 'updateOrder').resolves({ _id: 'order1', quantity: 5 });
      await orderController.updateOrder(req, res);
      expect(res.json.calledWithMatch({ _id: 'order1', quantity: 5 })).to.be.true;
    });
    it('should return 404 if not found', async () => {
      const req = { params: { id: 'order1' }, user: { id: 'buyer1' }, body: { quantity: 5 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      sinon.stub(orderRepo, 'updateOrder').resolves(null);
      await orderController.updateOrder(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'Order not found or not yours' })).to.be.true;
    });
    it('should handle repo error', async () => {
      const req = { params: { id: 'order1' }, user: { id: 'buyer1' }, body: { quantity: 5 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      sinon.stub(orderRepo, 'updateOrder').rejects(new Error('fail'));
      await orderController.updateOrder(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'fail' })).to.be.true;
    });
  });


  describe('deleteOrder', () => {
    it('should delete and return success', async () => {
      const req = { params: { id: 'order1' }, body: { user_id: 'buyer1' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      sinon.stub(orderRepo, 'deleteOrder').resolves({ _id: 'order1' });
      await orderController.deleteOrder(req, res);
      expect(res.json.calledWithMatch({ message: 'Order deleted successfully' })).to.be.true;
    });

    it('should return 404 if not found', async () => {
      const req = { params: { id: 'order1' }, body: { user_id: 'buyer1' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      sinon.stub(orderRepo, 'deleteOrder').resolves(null);
      await orderController.deleteOrder(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'Order not found or not yours' })).to.be.true;
    });
    it('should handle repo error', async () => {
      const req = { params: { id: 'order1' }, body: { user_id: 'buyer1' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      sinon.stub(orderRepo, 'deleteOrder').rejects(new Error('fail'));
      await orderController.deleteOrder(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'fail' })).to.be.true;
    });
  });

  describe('cancelOrder', () => {
    it('should cancel and return the order', async () => {
      const req = { params: { id: 'order1' }, user: { id: 'buyer1' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      sinon.stub(orderRepo, 'cancelOrder').resolves({ _id: 'order1', status: 'Cancelled' });
      await orderController.cancelOrder(req, res);
      expect(res.json.calledWithMatch({ _id: 'order1', status: 'Cancelled' })).to.be.true;
    });
    it('should return 404 if not found', async () => {
      const req = { params: { id: 'order1' }, user: { id: 'buyer1' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      sinon.stub(orderRepo, 'cancelOrder').resolves(null);
      await orderController.cancelOrder(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'Order not found or not yours' })).to.be.true;
    });

    it('should handle repo error', async () => {
      const req = { params: { id: 'order1' }, user: { id: 'buyer1' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      sinon.stub(orderRepo, 'cancelOrder').rejects(new Error('fail'));
      await orderController.cancelOrder(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'fail' })).to.be.true;
    });
  });
});
