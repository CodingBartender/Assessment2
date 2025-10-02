const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const express = require('express');
const bodyParser = require('body-parser')
const orderRepo = require("../repository/orderRepository");
const orderStatusController = require("../controllers/orderStatusController");

const { expect } = chai;
chai.use(chaiHttp);
function mockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; }
  };
}


describe("FR-10: Order State Tracking", () => {
  afterEach(() => sinon.restore()); 

  it("should update status to Executed (State Pattern)", async () => {
    
    const testOrder = { _id: "order1", status: "Pending", save: sinon.stub().resolves() };
    sinon.stub(orderRepo, "getOrderById").resolves(testOrder);

    const req = { params: { id: "order1" }, body: { status: "Executed", user_id: "buyer1" } };
    const res = mockRes();

    
    await orderStatusController.updateOrderStatus(req, res);
    
    expect(res.statusCode).to.equal(200);
    expect(testOrder.status).to.equal("Executed"); 
  });

  it("should return 404 if order not found", async () => {
    sinon.stub(orderRepo, "getOrderById").resolves(null);

    const req = { params: { id: "order404" }, body: { status: "Executed", user_id: "buyer1" } };
    const res = mockRes();

    await orderStatusController.updateOrderStatus(req, res);

    expect(res.statusCode).to.equal(404);
    expect(res.body).to.have.property("error");
  });

  it("should return 400 for invalid status", async () => {
    const testOrder = { _id: "order2", status: "Pending", save: sinon.stub().resolves() };
    sinon.stub(orderRepo, "getOrderById").resolves(testOrder);

    const req = { params: { id: "order2" }, body: { status: "WrongState", user_id: "buyer1" } };
    const res = mockRes();

    await orderStatusController.updateOrderStatus(req, res);

    expect(res.statusCode).to.equal(400);
    expect(res.body).to.have.property("error");
  });
});