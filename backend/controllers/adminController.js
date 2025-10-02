// FR-13: Administrative Control 


const User = require("../models/User");
const Stock = require("../models/Stock");

class AdminController {
  static instance;

  constructor() {

    // Singleton
    if (AdminController.instance) return AdminController.instance;
    AdminController.instance = this;


  }

  // Factory methods 
  async createUser({ name, email, password, role }) {

    // Factory - builds a User object from params
    return await User.create({ name, email, password, role });
  }


  // user management 
  async getAllUsers() {
    return await User.find();
  }

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }

  // stock management
  async getAllStocks() {
    return await Stock.find();
  }

  async deleteStock(stockId) {
    return await Stock.findByIdAndDelete(stockId);
  }


}

module.exports = new AdminController(); // Singleton instance
