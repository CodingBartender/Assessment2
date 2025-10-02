//FR 10 - OrderStatus




// Abstraction - OrderState as base class
class OrderState {
  constructor(order) { 
    this.order = order; 
  }
  execute() { 
    throw new Error("execute() must be implemented"); 
  }
}

//Polymorphism - each subclass overrides execute()

class PendingState extends OrderState {
  execute() { 
    this.order.status = "Pending"; 
    return this.order; 
  }
}

class ExecutedState extends OrderState {
  execute() { 
    this.order.status = "Executed"; 
    return this.order; 
  }
}

class CancelledState extends OrderState {
  execute() { 
    this.order.status = "Cancelled"; 
    return this.order; 
  }
}

class SoldState extends OrderState {
  execute() { 
    this.order.status = "Sold"; 
    return this.order; 
  }
}

module.exports = { PendingState, ExecutedState, CancelledState, SoldState };
