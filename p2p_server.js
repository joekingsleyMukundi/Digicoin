const Websocket= require('ws');
const {WebSocketServer} = require('ws')

const P2P_PORT = process.env.P2P_PORT || 5001
const peers = process.env.PEERS ? process.env.PEERS.split(','):[];
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transaction: 'CLEAR_TRANSACTIONS'
}

class P2pServer {
  constructor(blockchain, transactionPool){
    this.blockchain = blockchain;
    this.transactionPool = transactionPool
    this.sockets = [];
  }

  listen(){
    const server = new WebSocketServer({ port: P2P_PORT});

    server.on('connection', socket => {
      //console.log(socket);
      this.connectSocket(socket)
    });

    this.connectToPeers();

    console.log(`Listening for peer-to-peer connection on port ${P2P_PORT}`);
  }

  connectToPeers(){
    peers.forEach(peer => {
      const socket = new Websocket(peer);
      socket.on('open', ()=>this.connectSocket(socket));
    })
  }

  connectSocket(socket){
    this.sockets.push(socket);
    console.log('socket connected');

    this.messageHandler(socket);

    this.sendChain(socket)
  }
  messageHandler(socket){
    socket.on('message', message=>{
      const data = JSON.parse(message);
      switch (data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain, data.wallet, data.transactionpool)
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.Addtransaction(data.transaction)
          break;
        case MESSAGE_TYPES.clear_transaction:
          this.transactionPool.clear(data.transactions)
          break;
      }
      
    })
  }
  sendChain (socket, wallet, transactionpool){
    socket.send(JSON.stringify({type: MESSAGE_TYPES.chain, chain: this.blockchain.chain, wallet, transactionpool}));
  }
  sendTransaction(socket, transaction){
    socket.send(JSON.stringify({type: MESSAGE_TYPES.transaction, transaction}))
  }
  syncChains(wallet,transactionpool){
    this.sockets.forEach(socket => this.sendChain(socket, wallet, transactionpool));
  }
  broadcastTransaction(transaction){
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }
  broadcastClearTransactions(transactionsToClear){
    this.sockets.forEach(socket => socket.send(JSON.stringify({
      type: MESSAGE_TYPES.clear_transaction,
      transactions: transactionsToClear
    })))
  }
}

module.exports = P2pServer;
