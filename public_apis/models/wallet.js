const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  publicKey : {
    type: String,
    required: true,
    unique: true
  },
  user_id : {
    type: String,
  }
},
{ timestamps: true })

const WalletModel = new mongoose.model('Wallet', walletSchema)
module.exports = WalletModel;