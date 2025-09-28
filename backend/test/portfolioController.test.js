// backend/test/portfolioController.test.js

// ---------------- Portfolio Controller Unit Tests ----------------
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const express = require('express');
const bodyParser = require('body-parser');
const portfolioController = require('../controllers/portfolioController');
const portfolioRepo = require('../repository/portfolioRepositry');

const { expect } = chai;
chai.use(chaiHttp);

describe('Portfolio Controller', () => {
  let app;
  let sandbox;

  // Mock auth middleware to inject req.user
  const mockAuth = (req, res, next) => {
    req.user = { id: 'mockUserId', user_id: 'mockUserId' };
    next();
  };

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.post('/portfolio', mockAuth, portfolioController.createPortfolio);
    app.get('/portfolio', mockAuth, portfolioController.getPortfolios);
    app.get('/portfolio/:id', mockAuth, portfolioController.getPortfolioById);
    app.put('/portfolio/:id', mockAuth, portfolioController.updatePortfolio);
    app.delete('/portfolio/:id', mockAuth, portfolioController.deletePortfolio);
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  // ----------- Create Portfolio Tests -----------
  describe('createPortfolio', () => {
  it('should create a new portfolio successfully', (done) => {
      const mockPortfolio = { _id: '1', buyer_id: 'mockUserId', virtual_balance: 1000 };
      sandbox.stub(portfolioRepo, 'createPortfolio').resolves(mockPortfolio);
      chai.request(app)
        .post('/portfolio')
        .send({ virtual_balance: 1000 })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.deep.equal(mockPortfolio);
          done();
        });
    });
  it('should return 400 if buyer_id is missing', (done) => {
      // No req.user and no user_id in body
      const appNoUser = express();
      appNoUser.use(bodyParser.json());
      appNoUser.post('/portfolio', portfolioController.createPortfolio);
      chai.request(appNoUser)
        .post('/portfolio')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.exist;
          done();
        });
    });
  });

  // ----------- Get Portfolios Tests -----------
  describe('getPortfolios', () => {
  it('should return portfolios for a user', (done) => {
      const mockPortfolios = [{ _id: '1', buyer_id: 'mockUserId' }];
      sandbox.stub(portfolioRepo, 'getPortfoliosByUser').resolves(mockPortfolios);
      chai.request(app)
        .get('/portfolio')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal(mockPortfolios);
          done();
        });
    });
  it('should return 400 if user_id is missing', (done) => {
      const appNoUser = express();
      appNoUser.use(bodyParser.json());
      appNoUser.get('/portfolio', portfolioController.getPortfolios);
      chai.request(appNoUser)
        .get('/portfolio')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.exist;
          done();
        });
    });
  });

  // ----------- Get Portfolio By ID Tests -----------
  describe('getPortfolioById', () => {
  it('should return a portfolio by id', (done) => {
      const mockPortfolio = { _id: '1', buyer_id: 'mockUserId' };
      sandbox.stub(portfolioRepo, 'getPortfolioById').resolves(mockPortfolio);
      chai.request(app)
        .get('/portfolio/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal(mockPortfolio);
          done();
        });
    });
  it('should return 404 if portfolio is not found', (done) => {
      sandbox.stub(portfolioRepo, 'getPortfolioById').resolves(null);
      chai.request(app)
        .get('/portfolio/2')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal('Portfolio not found');
          done();
        });
    });
  });

  // ----------- Update Portfolio Tests -----------
  describe('updatePortfolio', () => {
  it('should update a portfolio successfully', (done) => {
      const updated = { _id: '1', buyer_id: 'mockUserId', virtual_balance: 2000 };
      sandbox.stub(portfolioRepo, 'updatePortfolio').resolves(updated);
      chai.request(app)
        .put('/portfolio/1')
        .send({ virtual_balance: 2000 })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal(updated);
          done();
        });
    });
  it('should return 404 if portfolio is not found', (done) => {
      sandbox.stub(portfolioRepo, 'updatePortfolio').resolves(null);
      chai.request(app)
        .put('/portfolio/2')
        .send({ virtual_balance: 2000 })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal('Portfolio not found or not yours');
          done();
        });
    });
  it('should return 400 if buyer_id is missing', (done) => {
      const appNoUser = express();
      appNoUser.use(bodyParser.json());
      appNoUser.put('/portfolio/:id', portfolioController.updatePortfolio);
      chai.request(appNoUser)
        .put('/portfolio/1')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.exist;
          done();
        });
    });
  });

  // ----------- Delete Portfolio Tests -----------
  describe('deletePortfolio', () => {
  it('should delete a portfolio successfully', (done) => {
      sandbox.stub(portfolioRepo, 'deletePortfolio').resolves({});
      chai.request(app)
        .delete('/portfolio/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Portfolio deleted successfully');
          done();
        });
    });
  it('should return 404 if portfolio is not found', (done) => {
      sandbox.stub(portfolioRepo, 'deletePortfolio').resolves(null);
      chai.request(app)
        .delete('/portfolio/2')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal('Portfolio not found or not yours');
          done();
        });
    });
  it('should return 400 if user_id is missing', (done) => {
      const appNoUser = express();
      appNoUser.use(bodyParser.json());
      appNoUser.delete('/portfolio/:id', portfolioController.deletePortfolio);
      chai.request(appNoUser)
        .delete('/portfolio/1')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.exist;
          done();
        });
    });
  });
});
