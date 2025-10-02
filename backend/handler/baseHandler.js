// Abstract Handler -> create handler file
// Base case
class Handler {
    
   // Link one handler -> next handler
   setNext(handler) {
      // Storing handler in this.nextHandler
      this.nextHandler = handler;
      // enables chaining / building chain -> return handler
      return handler;
   };

   handle(request) {

      if (this.nextHandler) {
         return this.nextHandler.handle(request);
      } 
      return null;
   };
};

module.exports = Handler;
