const { MINING_REWORD } = require('../config');
const Transaction = require('./transactions')
const Wallet = require('./wallet');

describe('TRansaction',()=>{
  let transactions, wallet, recipient, amount;

  beforeEach(()=>{
    wallet = new Wallet();
    amount = 50;
    recipient= "fiytfiUYAGYDFUZ";
    transactions = Transaction.newTransaction(wallet, recipient, amount);
  })

  it('outputs  the `amount` subtracted from the wallet balance', ()=>{
    expect(transactions.outputs.find(output => output.senderAddress === wallet.publicKey).amount).toEqual(wallet.balance - amount);
  })
  it('outputs the amount added to recipient',()=>{
    expect(transactions.outputs.find(output => output.recipientAddress === recipient).amount).toEqual(amount);
  })
  it('inputs the balance of the object',()=>{
    expect(transactions.input.amount).toEqual(wallet.balance)
  })
  it('validates a valid transaction',()=>{
    expect(Transaction.verifyTransaction(transactions)).toBe(true)
  })
  it('invalidates a invalid transaction',()=>{
    transactions.outputs[0].amount = 30000;
    expect(Transaction.verifyTransaction(transactions)).toBe(false)
  })
  describe('transacting with the ammount that eceeds tthe balance',()=>{
    beforeEach(()=>{
      amount = 500000
      transactions = Transaction.newTransaction(wallet, recipient, amount)
    });
    it ('doesnot create the transaction',()=>{
      expect(transactions).toEqual(undefined);
    })
  })

  describe('creating a reword transaction', ()=>{
    beforeEach(()=>{
      transactions = Transaction.rewordTransaction(wallet, Wallet.blockchainWallet());
    })
    it(` rewoe=rds the miners wallet `,()=>{
      expect(transactions.outputs.find(output=> output.recipientAddress == wallet.publicKey).amount).toEqual(MINING_REWORD)
    })
  })
})