const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const express = require('express');
const bodyParser = require('body-parser');
const stockController = require('../controllers/stockController');
const stockRepo = require('../repository/stockRepository');
const fs = require('fs');

const { expect } = chai;
chai.use(chaiHttp);

describe('Stock Controller', () => {
  let app;
  let sandbox;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    // Minimal routes for controller
    app.post('/addStock', stockController.createStock);
    app.get('/getAllStocks', stockController.getAllStocks);
    app.get('/stocks/:id', stockController.getStockById);
    app.put('/updateStock/:id', stockController.updateStock);
    app.delete('/delete/:id', stockController.deleteStock);
    app.get('/stocks/:id/orders/count', stockController.getOrderCount);
    app.get('/stocks/:id/orders', stockController.getOrdersForStock);
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createStock', () => {
    it('should create a stock and return 201', (done) => {
      const mockStock = { _id: '1', symbol: 'AAPL', company_name: 'Apple', current_price: 100, quantity: 10, type: 'EQUITY' };
      sandbox.stub(stockRepo, 'createStock').resolves(mockStock);
      chai.request(app)
        .post('/addStock')
        .send({ symbol: 'AAPL', company_name: 'Apple', current_price: 100, quantity: 10, type: 'EQUITY' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.deep.equal(mockStock);
          done();
        });
    });
    it('should return 400 on error', (done) => {
      sandbox.stub(stockRepo, 'createStock').rejects(new Error('Create error'));
      chai.request(app)
        .post('/addStock')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.equal('Create error');
          done();
        });
    });
  });

  describe('getAllStocks', () => {
    it('should return all stocks', (done) => {
      const mockStocks = [{ _id: '1', symbol: 'AAPL' }];
      sandbox.stub(stockRepo, 'getAllStocks').resolves(mockStocks);
      chai.request(app)
        .get('/getAllStocks')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal(mockStocks);
          done();
        });
    });
    it('should return 500 on error', (done) => {
      sandbox.stub(stockRepo, 'getAllStocks').rejects(new Error('DB error'));
      chai.request(app)
        .get('/getAllStocks')
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.error).to.equal('DB error');
          done();
        });
    });
  });

  describe('getStockById', () => {
    it('should return a stock by id', (done) => {
      const mockStock = { _id: '1', symbol: 'AAPL' };
      sandbox.stub(stockRepo, 'getStockById').resolves(mockStock);
      chai.request(app)
        .get('/stocks/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal(mockStock);
          done();
        });
    });
    it('should return 404 if not found', (done) => {
      sandbox.stub(stockRepo, 'getStockById').resolves(null);
      chai.request(app)
        .get('/stocks/2')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal('Stock not found');
          done();
        });
    });
    it('should return 500 on error', (done) => {
      sandbox.stub(stockRepo, 'getStockById').rejects(new Error('DB error'));
      chai.request(app)
        .get('/stocks/3')
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.error).to.equal('DB error');
          done();
        });
    });
  });

  describe('updateStock', () => {
    it('should update a stock', (done) => {
      const updated = { _id: '1', symbol: 'AAPL', current_price: 200 };
      sandbox.stub(stockRepo, 'updateStock').resolves(updated);
      chai.request(app)
        .put('/updateStock/1')
        .send({ current_price: 200 })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal(updated);
          done();
        });
    });
    it('should return 404 if not found', (done) => {
      sandbox.stub(stockRepo, 'updateStock').resolves(null);
      chai.request(app)
        .put('/updateStock/2')
        .send({ current_price: 200 })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal('Stock not found');
          done();
        });
    });
    it('should return 400 on error', (done) => {
      sandbox.stub(stockRepo, 'updateStock').rejects(new Error('Update error'));
      chai.request(app)
        .put('/updateStock/3')
        .send({ current_price: 200 })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.equal('Update error');
          done();
        });
    });
  });

  describe('deleteStock', () => {
    it('should delete a stock and return success', (done) => {
      const mockStock = { _id: '1', logo: null };
      sandbox.stub(stockRepo, 'getStockById').resolves(mockStock);
      sandbox.stub(stockRepo, 'deleteStock').resolves();
      sandbox.stub(fs, 'unlink').callsFake((path, cb) => cb && cb());
      chai.request(app)
        .delete('/delete/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Stock deleted successfully');
          done();
        });
    });
    it('should return 404 if stock not found', (done) => {
      sandbox.stub(stockRepo, 'getStockById').resolves(null);
      chai.request(app)
        .delete('/delete/2')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal('Stock not found');
          done();
        });
    });
    it('should return 500 on error', (done) => {
      sandbox.stub(stockRepo, 'getStockById').rejects(new Error('DB error'));
      chai.request(app)
        .delete('/delete/3')
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.error).to.equal('DB error');
          done();
        });
    });
  });

  describe('getOrderCount', () => {
    it('should return order count for a stock', (done) => {
      sandbox.stub(stockRepo, 'getOrderCount').resolves(5);
      chai.request(app)
        .get('/stocks/1/orders/count')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({ stock_id: '1', order_count: 5 });
          done();
        });
    });
    it('should return 500 on error', (done) => {
      sandbox.stub(stockRepo, 'getOrderCount').rejects(new Error('DB error'));
      chai.request(app)
        .get('/stocks/1/orders/count')
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.error).to.equal('DB error');
          done();
        });
    });
  });

  describe('getOrdersForStock', () => {
    it('should return orders for a stock', (done) => {
      const mockOrders = [{ _id: 'order1' }, { _id: 'order2' }];
      sandbox.stub(stockRepo, 'getOrdersForStock').resolves(mockOrders);
      chai.request(app)
        .get('/stocks/1/orders')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal(mockOrders);
          done();
        });
    });
    it('should return 500 on error', (done) => {
      sandbox.stub(stockRepo, 'getOrdersForStock').rejects(new Error('DB error'));
      chai.request(app)
        .get('/stocks/1/orders')
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.error).to.equal('DB error');
          done();
        });
    });
  });
});
