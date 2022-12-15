const ChainUtil = require('./utils/chain-util')
const { DIFFICULTY, MINE_RATE } = require('./config')
class Block {
  constructor(timestamp, lasthash, hash, data, nonce, difficulty){
    this.timestamp = timestamp;
    this.lasthash = lasthash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString(){
    return `Block - 
    Timestamp : ${this.timestamp}
    lasthash : ${this.lasthash.substring(0, 10)}
    nonce : ${this.nonce}
    difficulty : ${this.difficulty}
    hash: ${this.hash.substring(0, 10)}
    data: ${this.data}
    `
  }

  static genesis () {
    const CURRENTTIMESTAMP = 'current time';
    return new this(CURRENTTIMESTAMP, '________', 'mun2ki!oE5ndJ4', [],0,DIFFICULTY);
  }
  static mineBlock (lastBlock, transdata) {
    let hash, timestamp;
    let data = [];
    if(!Array.isArray(transdata)){
      data.push(transdata)
    }else{
      data = [...transdata]
    }
    const lasthash = lastBlock.hash;
    let {difficulty} = lastBlock;
    let nonce = 0;
    do {
      nonce++;
      timestamp = Date.now(); 
      difficulty = Block.adjustDifficulty(lastBlock, timestamp)
      hash = Block.hash(timestamp, lasthash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
    
    return new this(timestamp, lasthash, hash, data, nonce,difficulty);
  }
  static hash (timestamp, lasthash, data, nonce, difficulty){
    return ChainUtil.hash(`${timestamp}${lasthash}${data}${nonce}${difficulty}`).toString();
  }
  static hashBlock (block){
    const {timestamp, lasthash, data, nonce, difficulty} = block;
    return Block.hash(timestamp, lasthash, data, nonce, difficulty);
  }
  static adjustDifficulty(lastBlock, cuurentime){
    let {difficulty} = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > cuurentime? difficulty + 1: difficulty - 1;
    return difficulty
  }
}

module.exports = Block;