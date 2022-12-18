const moment = require('moment')
const { TOTAL_TO_SUPPLY } = require("../core/config");
const { blockchainWallet } = require("../core/wallet/wallet");
class Statistics{
  constructor(bc, tp,){
    this.blockchain= bc;
    this.transactionpool = tp;
    this.digicoinInSupply = 0;
  }
  bitprice(){
    const chainlength = this.blockchain.chain.length();
    const poolLength = this.transactionpool.transactions.length();
    this.digicoinInSupply = TOTAL_TO_SUPPLY - blockchainWallet().calculateBalance;
    const lastBlockdifficulty = this.blockchain.chain[chainlength-1].difficulty;
    const price = ((chainlength+poolLength/digicoinInSupply))*1/lastBlockdifficulty;
    return price
  }
  marketCap(){
    return this.bitprice()*(TOTAL_TO_SUPPLY - blockchainWallet().calculateBalance);
  }
  fullyDilluted(){
    return TOTAL_TO_SUPPLY * this.bitprice();
  }
  volume(coinsTradedToday){
    return coinsTradedToday * this.bitprice;
  }
  supply(){
    return TOTAL_TO_SUPPLY - blockchainWallet().calculateBalance;
  }
}

module.exports = Statistics