const Block = require('./block');
const { MINING_REWORD } = require('./config');
const TransactionPool = require('./transaction-pool');
const Wallet = require('./wallet/wallet');

class Blockchain {
  constructor(){
    this.chain = [Block.genesis()]
  }
  addBlock(data){
    const lastblock = this.chain[this.chain.length - 1];
    const block = Block.mineBlock(lastblock, data);
    this.chain.push(block);
    return block;
  }
  isValidChain(chain){
    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastblock = chain[i-1]
      
      if(block.lasthash !== lastblock.hash || block.hash !== Block.hashBlock(block)){
        return false;
      }
    }
    return true;
  }
  replaceChain (newChain, recipient, transactionPool){
    if(newChain.length<= this.chain.length){
      console.log("the chain is not longer than the existing chain");
      return;
    }else if(!this.isValidChain(newChain)){
      console.log('the cahin submitted is  invalid');
      return;
    }
    this.chain = newChain
    console.log('the new chain is submited');
    Wallet.createRewordTransaction(recipient, transactionPool);
  }
}

module.exports = Blockchain;