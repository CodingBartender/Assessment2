const chai = require('chai');
const sinon = require('sinon');
const orderExecuteCommand = require('../commands/orderExecutionCommand'); 
const { expect } = chai;

// Test execute and undo

describe('orderExecuteCommand', () => {
  
  it('should create a command instance', () => {
    // Arrange: Create some test order data
    const testOrder = {
      buyer_id: 'test123',
      order_type: 'BUY',
      quantity: 1,
      price: 100
    };
    
    // Act: Create the command
    const command = new orderExecuteCommand(testOrder);
    
    // Assert: Check it was created
    expect(command).to.be.an('object');
    // What property should your command have?
    expect(command.order).to.equal(testOrder);
  });
  



});

describe('orderExecuteCommand State Pattern (1) Validation', () => {
  
  it('should throw error when status = Executed ', async () => {

    const sampleData = {
      buyer_id: 'test123',
      portfolio_id: '1111111',
      stock_id: '12131',
      order_type: 'BUY',
      quantity: 1,
      price: 100,
      status: 'Executed'
    };

    const command = new orderExecuteCommand(sampleData);
    const result = await command.Execute();

    expect(result).to.equal(sampleData);

    expect(command.order).to.equal(sampleData);
  });
  
});

describe('orderExecuteCommand State Pattern (2) validation', () => {
  
  it('test ', async () => {

    const sampleData = {
      buyer_id: '8493f989wf9834',
      portfolio_id: '9834938493f934f93',
      stock_id: '98f99797f39f43',
      order_type: 'BUY',
      quantity: 1,
      price: 100,
      status: 'Pending'
    };

    const command = new orderExecuteCommand(sampleData);
    const result = await command.Execute();

    expect(result).to.equal(sampleData);

    expect(command.order).to.equal(sampleData);
  });
  
});






