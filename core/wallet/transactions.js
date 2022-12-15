const { MINING_REWORD } = require('../config');
const ChainUtil = require('../utils/chain-util');

class Transaction{
  constructor(){
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  static transactionWithOutputs(senderWallet, outputs){
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }
  static newTransaction(senderWallet, recipient, amount){
    if(amount> senderWallet.balance){
      console.log(`inssuficient balance to transact amount: ${amount} `);
      return;
    }
    const outputData = [
      {amount: senderWallet.balance-amount, senderAddress: senderWallet.publicKey},
      {amount, recipientAddress: recipient}
    ]
    return Transaction.transactionWithOutputs(senderWallet, outputData)
  }
  static rewordTransaction(minerWallet, blockchainWallet){
    const outputData = [
      {amount: MINING_REWORD, recipientAddress: minerWallet.publicKey}
    ]
    return Transaction.transactionWithOutputs(blockchainWallet, outputData)
  }
  static signTransaction (transaction, senderWallet){
    transaction.input={
      timestamp: Date.now(),
      address: senderWallet.publicKey,
      amount: senderWallet.balance,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
    }
  }
  static verifyTransaction (transaction){
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    )
  }
}

module.exports=Transaction;