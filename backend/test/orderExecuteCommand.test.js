const chai = require("chai");
const sinon = require("sinon");
const { expect } = chai;

const orderExecuteCommand = require("../commands/orderExecutionCommand");
const User = require("../models/User");
const Portfolio = require("../models/Portfolio");
const Stock = require("../models/Stock");

describe("orderExecuteCommand", function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // prevent real DB queries
    sandbox.stub(User, "findById").resolves({ _id: "test01User" });
    sandbox.stub(Portfolio, "findById").resolves({ _id: "test01Portfolio" });
    sandbox.stub(Stock, "findById").resolves({ _id: "test01Stock" });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create a command instance", () => {
    const testOrder = { buyer_id: "test123", order_type: "BUY", quantity: 1, price: 100, status: "Pending" };
    const command = new orderExecuteCommand(testOrder);
    expect(command.order).to.equal(testOrder);
  });

 it("should execute successfully when status is Pending", async () => {
  const sampleOrder = { buyer_id: "test123", order_type: "BUY", quantity: 1, price: 100, status: "Pending" };

  sinon.stub(orderExecuteCommand.prototype, "Execute").resolves(sampleOrder);

  const command = new orderExecuteCommand(sampleOrder);
  const result = await command.Execute();

  expect(result).to.equal(sampleOrder);

  
  orderExecuteCommand.prototype.Execute.restore();
});
  it("should throw error when order is not Pending", async () => {
    const sampleOrder = { buyer_id: "test123", order_type: "BUY", quantity: 1, price: 100, status: "Executed" };
    const command = new orderExecuteCommand(sampleOrder);
    try {
      await command.Execute();
      throw new Error("Expected error");
    } catch (err) {
      expect(err.message).to.match(/pending/i);
    }
  });
});
