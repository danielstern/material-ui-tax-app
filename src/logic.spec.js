import { calculateBracketPayable, calculateBracketTaxable } from "./logic"

describe("calculate Bracket Taxable",()=>{
  it("should return the expected taxable amount based on the salary",()=>{
    expect(calculateBracketTaxable(100,0,25)).toBe(25)
    expect(calculateBracketTaxable(100,0,125)).toBe(100)
    expect(calculateBracketTaxable(100,110,125)).toBe(0)
  })
})

describe("calculate bracket payable",()=>{
  it("Should return the expected payable amount",()=>{
    expect(calculateBracketPayable(100,0,100,0.1)).toBe(10)
    expect(calculateBracketPayable(100,0,100,0.25)).toBe(25)
  })
})