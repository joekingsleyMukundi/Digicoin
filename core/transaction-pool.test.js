const Blockchain = require('./blockchain');
const TransactionPool = require('./transaction-pool')
const Transaction = require('./wallet/transactions')
const Wallet = require('./wallet/wallet')

describe ('transactionpool', ()=>{
  let tp, wallet, transaction, bc;

  beforeEach(()=>{
    tp = new TransactionPool();
    wallet = new Wallet();
    bc = new Blockchain()
    transaction = wallet.createTransaction('redfeggf',30, bc, tp)
  })
  it('adds a transaction to the pool',()=>{
    console.log(tp);
    expect(tp.transactions.find(t=>t.id ===transaction.id)).toEqual(transaction)
  })
  describe ('mixing valid and corrupt ransactions',()=>{
    let validTransactions;
    beforeEach(()=>{
      validTransactions = [...tp.transactions];
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction('redfeggf',30, bc, tp)
        if(i%2){
          transaction.input.amount = 9999;
        }else{
          validTransactions.push(transaction);
        }
      }
    })
    it('show a diffrence btween valid and corrupt tranzactions',()=>{
      expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions))
    })
    it('grabs valid tranzactions',()=>{
      expect(tp.validTransactions()).toEqual(validTransactions)
    })
    it('ctears transactions',()=>{
      tp.clear();
      expect(tp.transactions).toEqual([])
    })
  })
})