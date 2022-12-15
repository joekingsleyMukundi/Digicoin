const Transaction = require("./wallet/transactions");
const Wallet = require("./wallet/wallet");

class Miner {
  constructor(blockchain, transactionpool, wallet, p2pserver) {
    this.blockchain = blockchain;
    this.transactionpool = transactionpool;
    this.wallet = wallet;
    this.p2pserver = p2pserver;
  }
  mine(){
    const validTransactions = this.transactionpool.validTransactions();
    const block = this.blockchain.addBlock(validTransactions);
    //TODO :removed payment from  addBlock to block submitions
    validTransactions.push(Transaction.rewordTransaction(this.wallet, Wallet.blockchainWallet()));
    this.p2pserver.syncChains();
    this.transactionpool.clear();
    this.p2pserver.broadcastClearTransactions();
    return block;
  }
}
module.exports = Miner