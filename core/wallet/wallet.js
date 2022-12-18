const ChainUtil = require('../utils/chain-util')
const  { INITIAL_BALANCE, MINING_REWORD } = require('../config');
const Transaction = require('./transactions');

class Wallet {
  constructor(){
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }
  toString(){
    return `Wallet - 
    publicKey: ${this.publicKey.toString()}
    balance: ${this.balance}`
  }
  sign(data){
    return this.keyPair.sign(data);
  }
  createTransaction(recipient, amount, blockchain, transactionpool){
    this.balance = this.calculateBalance(blockchain, transactionpool)
    if(amount > this.balance){
      console.log('insufficient funds');
      return false;
    }
    let transaction;
    transaction = Transaction.newTransaction(this, recipient, amount);
    transactionpool.Addtransaction(transaction)
    this.balance -= amount
    return transaction;
  }
  calculateBalance(blockchain, pool){
    let balance = this.balance
    let transactionPool = pool.validTransactions();
    if(transactionPool.length > 0){
      transactionPool.forEach(transaction =>{
        let sender = transaction.input.address === this.publicKey;
        if(sender){
          balance -= transaction.outputs[1].amount;
        }
      })
    }
    let transactions = [];
    blockchain.chain.forEach(block => block.data.forEach(transaction => transactions.push(transaction)));
    const walletInputTs = transactions.filter(transaction=> transaction.input.address === this.publicKey);
    let startTime = 0;
    if (walletInputTs.length > 0){
      const recentInputTs = walletInputTs.reduce(
        (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
      );
      balance = recentInputTs.outputs.find(output => output.senderAddress === this.publicKey).amount;
      startTime = recentInputTs.input.timestamp;
    }
    transactions.forEach(transaction =>{
      if(transaction.input.timestamp >= startTime){
        transaction.outputs.find(output =>{
          if(output.recipientAddress === this.publicKey){
            balance += output.amount;
          }
        })
      }
    })
    return balance;
  }

  static blockchainWallet(){
    const blockchainWallet =  new this();
    blockchainWallet.balance = 18000000
    blockchainWallet.publicKey = 'blockchain-wallet';
    return blockchainWallet
  }
  static createRewordTransaction(recipient,transactionPool){
    const bcw = Wallet.blockchainWallet();
    const transaction = Transaction.rewordTransaction(recipient, bcw)
    transactionPool.transactions.push (transaction);
    bcw.balance -=MINING_REWORD;
    return transaction
  }
}
module.exports=Wallet