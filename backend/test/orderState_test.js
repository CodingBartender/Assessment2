const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../server.js');
chai.use(chaiHttp);
const { expect } = chai;

let token;
let orderId;

describe('FR-10 Order State Tracking API', () => {

  before(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    // login and register
    await chai.request(app)
      .post('/api/auth/register')
      .send({ name: 'OrderUser', email: 'demo2@gmail.com', password: 'demo2' });

    const res = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: 'demo2@gmail.com', password: 'demo2' });

    token = res.body.token;
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('T001 - should place a new order (status New)', async () => {
    const res = await chai.request(app)
      .post('/api/orderstate')
      .set('Authorization', `Bearer ${token}`)
      .send({ stockName: 'DELL', shares: 5, unitPrice: 150, type: 'Buy' });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('status', 'New');
    orderId = res.body._id;
  });

  it('T002 - should fetch all orders for user', async () => {
    const res = await chai.request(app)
      .get('/api/orderstate')
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  it('T003 - should update order status to Executed', async () => {
    const res = await chai.request(app)
      .put(`/api/orderstate/${orderId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Executed' });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('status', 'Executed');
    expect(res.body).to.have.property('executedAt');
  });

  it('T004 - should return 404 for invalid order ID', async () => {
    const res = await chai.request(app)
      .put(`/api/orderstate/123notvalidorderid/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Cancelled' });

    expect(res).to.have.status(404);
  });
});
