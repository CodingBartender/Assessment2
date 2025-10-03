const chai = require("chai");
const sinon = require("sinon");
const { expect } = chai;

const AdminController = require("../controllers/adminController");
const User = require("../models/User");
const Stock = require("../models/Stock");

describe("FR-13: AdminController", function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should be a singleton ", () => {
    const instance1 = require("../controllers/adminController");
    const instance2 = require("../controllers/adminController");
    expect(instance1).to.equal(instance2);
  });

  it("should create a user ", async () => {
    const adminTestUser = { name: "Alice", email: "a@test.com", role: "BUYER" };
    sandbox.stub(User, "create").resolves(adminTestUser);

    const result = await AdminController.createUser(adminTestUser);
    expect(User.create.calledOnce).to.be.true;
    expect(result).to.equal(adminTestUser);
  });

  it("should fetch all users", async () => {
    const adminTestUsers = [{ name: "Bob" }, { name: "Charlie" }];
    sandbox.stub(User, "find").resolves(adminTestUsers);

    const result = await AdminController.getAllUsers();
    expect(User.find.calledOnce).to.be.true;
    expect(result).to.equal(adminTestUsers);
  });

  it("should delete a user", async () => {
    const adminTestDeleted = { _id: "123", name: "Bob" };
    sandbox.stub(User, "findByIdAndDelete").resolves(adminTestDeleted);

    const result = await AdminController.deleteUser("123");
    expect(User.findByIdAndDelete.calledOnceWith("123")).to.be.true;
    expect(result).to.equal(adminTestDeleted);
  });

  it("should fetch all stocks", async () => {
    const adminTestStocks = [{ symbol: "AAPL" }, { symbol: "TSLA" }];
    sandbox.stub(Stock, "find").resolves(adminTestStocks);

    const result = await AdminController.getAllStocks();
    expect(Stock.find.calledOnce).to.be.true;
    expect(result).to.equal(adminTestStocks);
  });

  it("should delete a stock", async () => {
    const adminTestDeleted = { _id: "456", symbol: "AAPL" };
    sandbox.stub(Stock, "findByIdAndDelete").resolves(adminTestDeleted);

    const result = await AdminController.deleteStock("456");
    expect(Stock.findByIdAndDelete.calledOnceWith("456")).to.be.true;
    expect(result).to.equal(adminTestDeleted);
  });
});
