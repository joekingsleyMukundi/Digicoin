const Transaction = require('./transactions')
const Wallet = require('./wallet');
const TransactionPool = require('../transaction-pool');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');

describe('wallet', ()=>{
  let wallet, tp, bc;

  beforeEach(()=>{
    wallet = new Wallet();
    tp = new TransactionPool();
    bc = new Blockchain();
  });

  describe('create transaction' ,()=>{
    let transaction, sendAmount, recipient;

    beforeEach(()=>{
      sendAmount = 50;
      recipient = 'geftadsfgjk';
      //transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
    })

    // describe('and doing the same transaction',()=>{
    //   beforeEach(()=>{
    //     wallet.createTransaction(recipient, sendAmount, bc, tp);
    //   })

    //   it('adds a new transaction to the transaction pool',()=>{
    //     console.log(tp.transactions[1]);
    //     expect(tp.transactions.length).toEqual(2)
    //   })
    // })
    describe('calculate balance', ()=>{
      let addbalance, repeatadd, senderwallet;

      beforeEach(()=>{
        senderwallet = new Wallet();
        addbalance = 100;
        repeatadd = 3;
        for (let i = 0; i < repeatadd; i++) {
          senderwallet.createTransaction(wallet.publicKey, addbalance, bc, tp)
        }
        bc.addBlock(tp.transactions[0]);
        bc.addBlock(tp.transactions[1]);
      })
      it ('it calculates the balance for the blockhain transaction matching the recipient',()=>{
        expect(wallet.calculateBalance(bc, tp)).toEqual(INITIAL_BALANCE+(addbalance*2));
      })
      
      it('calculates the balance  matching the sender',()=>{
        console.log(tp.transactions[1]);
        expect(senderwallet.calculateBalance(bc, tp)).toEqual(INITIAL_BALANCE-(addbalance*3))
      })

      describe(' and the recipient conducts a transaction', ()=>{
        let subtractBalance, recipientBalance;

        beforeEach(()=>{
          subtractBalance = 60;
          recipientBalance = wallet.calculateBalance(bc, tp);
          wallet.createTransaction(senderwallet.publicKey,subtractBalance, bc, tp);
          bc.addBlock(tp.transactions)
        })
        describe('and the sender sends another transaction to the recipient',()=>{
          beforeEach(()=>{
            senderwallet.createTransaction(wallet.publicKey,addbalance, bc, tp);
            bc.addBlock(tp.transactions);
          })

          it('calculates the recipient balance only using transactions since the most recent one',()=>{
            expect(wallet.calculateBalance(bc, tp)).toEqual(recipientBalance - subtractBalance + addbalance)
          })
        })
      })
    })
  })
})