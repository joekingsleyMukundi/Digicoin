const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', ()=>{
  let bc, bc2;

  beforeEach(()=>{
    bc = new Blockchain();
    bc2 = new Blockchain();
  });
  it('bc starts with genesis block', ()=>{
    expect(bc.chain[0]).toEqual(Block.genesis())
  });
  it('adds new block',()=>{
    const data = "fooo";
    bc.addBlock(data);
    expect(bc.chain[bc.chain.length - 1].data).toEqual([data])
  })
  it ('validates chain', ()=>{
    const data = 'foo bar'
    bc2.addBlock(data)

    expect(bc.isValidChain(bc2.chain)).toBe(true);
  })
  it('invalidates chain with invalid block', ()=>{
    bc2.chain[0].data = "invalid data";

    expect(bc.isValidChain(bc2.chain)).toBe(false)
  })
  it('invalidate chain with corrupt data', ()=>{
    bc2.addBlock('foo')
    bc2.chain[1].data = 'not foo'
    expect(bc.isValidChain(bc2.chain)).toBe(false)
  })
  it('replaces the chain with a valid chain',()=>{
    bc2.addBlock("foo")
    bc.replaceChain(bc2.chain)
    expect(bc.chain).toEqual(bc2.chain)
  })
  it('does not replace chain with less than or equal to that chain',()=>{
    bc.addBlock('foo')
    bc.replaceChain(bc2.chain)

    expect(bc.chain).not.toEqual(bc2.chain)
  })
})