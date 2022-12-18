const express = require('express')
const json = require('body-parser').json;
const connect  = require('mongoose').connect
const cors = require('cors');
require ('express-async-errors')
const errorHandler = require('./public_apis/middlewares/error_handler')
const authurls = require('./public_apis/routes/auth/auth');
const Blockchain = require('./core/blockchain');
const P2pServer = require('./p2p_server');
const TransactionPool = require('./core/transaction-pool');
const app = express();
const bc = new Blockchain();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
//midddlwares
app.use(cors());
app.use(json());

//routes
app.get('/',(req,res,next)=>{
  res.status(200).json({
    message: "hey"
  })
})
//auth routes
app.use(authurls)

//blockchain urls
app.get('/blocks', (req,res)=>{
  res.status(200).json(bc.chain)
})
app.post('/mine', (req,res)=>{
  const block = bc.addBlock(req.body.data)
  console.log(`new block was added: ${block.toString()}`);
  p2pServer.syncChains();
  res.redirect('/blocks')
})


app.get('/mine-transaction',(req,res)=>{
  const block= miner.mine();
  console.log(`new block has been mined : ${block.toString()}`);
  res.redirect('/blocks');
})
//transaction pool urls 
app.get('/transactions',(req,res)=>{
  res.status(200).json({
    pool: tp.transactions
  })
})


app.post('/transact',(req,res)=>{
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, bc, tp);
  if(!transaction){
    console.log(transaction);
  }
  p2pServer.broadcastTransaction(transaction)
  res.redirect('/transactions')
})

app.get('/public-key', (req, res)=>{
  res.status(200).json({
    publicKey: wallet.publicKey
  }) 
})

//404 route handler
app.get('*',function(req,res){
  res.status(404).json([{
    message : "Not Found"
  }])
});
app.post('*',function(req,res){
  res.status(404).json([{
    message : "Not Found"
  }])
});
//error handler
app.use(errorHandler);

// port
const PORT = process.env.PORT||3000;
//db connection and serve
const mongoUrl = 'mongodb+srv://digiadmin:Xriw32kHORdUKNga@digicoincluster.brmfkiv.mongodb.net/DigicoinDb';
const dbConn = async()=>{
  try {
    await connect(mongoUrl,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT,()=>{
      console.log(`server live at port ${PORT}`);
    });
    console.log('db active');
  } catch (error) {
    console.error(error);
  }
};
dbConn();
p2pServer.listen();