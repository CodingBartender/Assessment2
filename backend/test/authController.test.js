const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile
} = require('../controllers/authController');
const { expect } = chai;

describe('Auth Controller', () => {
  afterEach(() => sinon.restore());

  describe('registerUser', () => {
    it('should register a TRADER user', async () => {
      const req = { body: { name: 'Trader', email: 'trader@example.com', password: 'pass', role: 'TRADER' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves({
        _id: 'userId',
        id: 'userId',
        name: 'Trader',
        email: 'trader@example.com',
        role: 'TRADER',
      });
      sinon.stub(jwt, 'sign').returns('token');

      await registerUser(req, res);
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch({ name: 'Trader', role: 'TRADER', token: 'token' })).to.be.true;
    });

    it('should register a BUYER user and create portfolio', async () => {
      const req = { body: { name: 'Buyer', email: 'buyer@example.com', password: 'pass', role: 'BUYER' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves({
        _id: 'buyerId',
        id: 'buyerId',
        name: 'Buyer',
        email: 'buyer@example.com',
        role: 'BUYER',
      });
      sinon.stub(Portfolio, 'create').resolves({ buyer_id: 'buyerId', virtual_balance: 0 });
      sinon.stub(jwt, 'sign').returns('token');

      await registerUser(req, res);
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch({ name: 'Buyer', role: 'BUYER', token: 'token' })).to.be.true;
    });

    it('should register an ADMIN user', async () => {
      const req = { body: { name: 'Admin', email: 'admin@example.com', password: 'pass', role: 'ADMIN' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves({
        _id: 'adminId',
        id: 'adminId',
        name: 'Admin',
        email: 'admin@example.com',
        role: 'ADMIN',
      });
      sinon.stub(jwt, 'sign').returns('token');

      await registerUser(req, res);
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch({ name: 'Admin', role: 'ADMIN', token: 'token' })).to.be.true;
    });

    it('should not register if user exists', async () => {
      const req = { body: { name: 'User', email: 'exists@example.com', password: 'pass', role: 'TRADER' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      sinon.stub(User, 'findOne').resolves({});

      await registerUser(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'User already exists' })).to.be.true;
    });
  });

  describe('loginUser', () => {
    it('should login with correct credentials', async () => {
      const req = { body: { email: 'user@example.com', password: 'pass' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      sinon.stub(User, 'findOne').resolves({
        id: 'userId',
        name: 'User',
        email: 'user@example.com',
        role: 'TRADER',
        password: 'hashed',
      });
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('token');

      await loginUser(req, res);
      expect(res.json.calledWithMatch({ name: 'User', role: 'TRADER', token: 'token' })).to.be.true;
    });

    it('should not login with wrong credentials', async () => {
      const req = { body: { email: 'user@example.com', password: 'wrong' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      sinon.stub(User, 'findOne').resolves({
        id: 'userId',
        name: 'User',
        email: 'user@example.com',
        role: 'TRADER',
        password: 'hashed',
      });
      sinon.stub(bcrypt, 'compare').resolves(false);

      await loginUser(req, res);
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Invalid email or password' })).to.be.true;
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const req = { user: { id: 'userId' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      sinon.stub(User, 'findById').resolves({
        name: 'User',
        email: 'user@example.com',
        role: 'BUYER',
        id: 'userId',
        university: 'Uni',
      });
      await getProfile(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWithMatch({ name: 'User', email: 'user@example.com', role: 'BUYER', id: 'userId', university: 'Uni', })).to.be.true;
    });
    it('should return 404 if user not found', async () => {
      const req = { user: { id: 'userId' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      sinon.stub(User, 'findById').resolves(null);
      await getProfile(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'User not found' })).to.be.true;
    });
  });
});
