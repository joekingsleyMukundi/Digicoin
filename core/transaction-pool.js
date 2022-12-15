const Transaction = require("./wallet/transactions");

class TransactionPool {
  constructor(){
    this.transactions = [];
  }

  Addtransaction(transaction){
    this.transactions.push(transaction)
  }
  validTransactions(){
    return this.transactions.filter(transaction =>{
      const outputTotal = transaction.outputs.reduce((total, output)=>{
        return total+output.amount;
      }, 0);
      if(transaction.input.amount !== outputTotal){
        console.log(`invalid transaction from address ${transaction.input.address}`);
        return false;
      };
      if(!Transaction.verifyTransaction(transaction)){
        console.log(`invalid signature from ${transaction.input.address}`);
        return false;
      }
      return  transaction
    })
  }
  clear(){
    //TODO #8 : Clear Invalid transactions  and transactions that have been mined
    this.transactions=[];
  }
}

module.exports=TransactionPool