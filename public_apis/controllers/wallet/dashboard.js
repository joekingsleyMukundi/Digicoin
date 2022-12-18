const Blockchain = require("../../../core/blockchain");
const TransactionPool = require("../../../core/transaction-pool");
const Wallet = require("../../../core/wallet/wallet");
const Statistics = require("../../../internal_apis/wallet_apis");
const { Unauthorised, InternalServerError } = require("../../Error_handlers/customerrors");
const WalletModel = require("../../models/wallet");

exports.dashboard = async(req, res, next)=>{
  let balance, marketcap, volume, supply, fullydiluted
  const userData = req.user;
  if(!userData){
    throw Unauthorised('User is not Authorised')
  }
  try {
    const walletData = await WalletModel.findOne({user_id: userData.id});
    const wallet = new Wallet();
    wallet.publicKey = walletData.publicKey;
    balance = wallet.balance();
    const bc = new Blockchain();
    const tp = new TransactionPool()
    const stats = new Statistics(bc, tp)
    marketcap = stats.marketCap();
    volume = stats.volume(10);
    supply = stats.supply()
    fullydiluted = stats.fullyDilluted()
    res.status(200).json({
      data:{
        balance,
        marketcap,
        volume,
        supply,
        fullydiluted,
      }
    })
  } catch (error) {
    console.log(error);
    throw InternalServerError('internal server error');

  }
}