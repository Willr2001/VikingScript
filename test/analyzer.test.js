import util from "util"
import assert from "assert/strict"
import ast from "../src/ast.js"
import analyze from "../src/analyzer.js"

const semanticChecks = [
  ["variables can be printed", "kalla x = 1 runes x"],
  ["variables can be reassigned", "kalla x = 1 x = x * 5 / ((-3) + x)"],
  ["all predefined identifiers", "runes sin(π)"],
]

const semanticErrors = [
  ["using undeclared identifiers", "runes(x)", /Identifier x not declared/],
  ["a variable used as function", "x = 1 x(2)", /Expected "="/],
  ["a function used as variable", "runes(sin + 1)", /expected/],
  [
    "re-declared identifier",
    "kalla x = 1 kalla x = 2",
    /x has already been declared/,
  ],
  [
    "an attempt to write a read-only var",
    "π = 3",
    /The identifier π is read only/,
  ],
  ["too few arguments", "runes(sin())", /Expected 1 arg\(s\), found 0/],
  ["too many arguments", "runes(sin(5, 10))", /Expected 1 arg\(s\), found 2/],
]

const source = `
kalla x=sin(9.9)
valhalla f(x) {
    runes 3 * x
    ef thor {runes 0 && (f(x) || 2)}
}
`

const expected = `   1 | Program statements=[#2,#6]
   2 | VariableDeclaration variable=(Id,"x",#3) initializer=#4
   3 | Variable name='x' readOnly=false
   4 | Call callee=(Id,"sin",#5) args=[(Num,"9.9",9.9)]
   5 | Function name='sin' paramCount=1 readOnly=true
   6 | FunctionDeclaration fun=(Id,"f",#7) params=[(Id,"x",#8)] body=[#9,#11]
   7 | Function name='f' paramCount=1 readOnly=true
   8 | Variable name='x' readOnly=true
   9 | PrintStatement argument=#10
  10 | BinaryExpression op=(Sym,"*") left=(Num,"3",3) right=(Id,"x",#8)
  11 | ShortIfStatement test=(Bool,"thor") consequent=[#12]
  12 | PrintStatement argument=#13
  13 | BinaryExpression op=(Sym,"&&") left=(Num,"0") right=#14
  14 | BinaryExpression op=(Sym,"||") left=#15 right=(Num,"2",2)
  15 | Call callee=(Id,"f",#7) args=[(Id,"x",#8)]`

describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(ast(source)))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(ast(source)), errorMessagePattern)
    })
  }
  it(`produces the expected graph for the simple sample program`, () => {
    assert.deepEqual(util.format(analyze(ast(source))), expected)
  })
})
