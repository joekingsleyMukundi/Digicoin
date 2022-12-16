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
    this.p2pserver.syncChains(this.wallet, this.transactionpool);
    this.transactionpool.clear(validTransactions);
    this.p2pserver.broadcastClearTransactions(validTransactions);
    return block;
  }
}
module.exports = Miner