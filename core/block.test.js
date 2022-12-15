const Block = require('./block');
const {DIFFICULTY} = require('./config')
describe('Block', ()=>{
  let data, lastblock, block;

  beforeEach(()=>{
    data = 'bar';
    lastblock = Block.genesis();
    block = Block.mineBlock(lastblock, data);
  });
  it('sets the `data` to match input', ()=>{
    expect(block.data).toEqual([data])
  });
  it('sets the `lastHash` to match hash of last block', ()=>{
    expect(block.lasthash).toEqual(lastblock.hash)
  });
  it('generates a hash that matches difficulty',()=>{
    expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
  })
  it('lowers difficulty for slowly mined blocks',()=>{
    expect (Block.adjustDifficulty(block, block.timestamp+360000)).toEqual(block.difficulty-1)
  })
  it('raises the difficulty for quickly mined blocks',()=>{
    expect (Block.adjustDifficulty(block, block.timestamp+1)).toEqual(block.difficulty+1)
  })
})