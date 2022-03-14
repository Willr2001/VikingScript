import util from "util"
import assert from "assert/strict"
import ast from "../src/ast.js"
import analyze from "../src/analyzer.js"

const semanticChecks = [
  ["variables can be printed", "let x = 1; print x;"],
  ["variables can be reassigned", "let x = 1; x = x * 5 / ((-3) + x);"],
  ["all predefined identifiers", "print ln(sqrt(sin(cos(hypot(π,1) + exp(5.5E2)))));"],
]

const semanticErrors = [
  ["using undeclared identifiers", "print(x);", /Identifier x not declared/],
  ["a variable used as function", "x = 1; x(2);", /Expected "="/],
  ["a function used as variable", "print(sin + 1);", /expected/],
  ["re-declared identifier", "let x = 1; let x = 2;", /x has already been declared/],
  ["an attempt to write a read-only var", "π = 3;", /The identifier π is read only/],
  ["too few arguments", "print(sin());", /Expected 1 arg\(s\), found 0/],
  ["too many arguments", "print(sin(5, 10));", /Expected 1 arg\(s\), found 2/],
]

const source = `let x=sqrt(9);function f(x)=3*x;while(true){x=3;print(0?f(x):2);}`

const expected = `   1 | Program statements=[#2,#6,#10]
   2 | VariableDeclaration variable=(Id,"x",#3) initializer=#4
   3 | Variable name='x' readOnly=false
   4 | Call callee=(Id,"sqrt",#5) args=[(Num,"9",9)]
   5 | Function name='sqrt' paramCount=1 readOnly=true
   6 | FunctionDeclaration fun=(Id,"f",#7) params=[(Id,"x",#8)] body=#9
   7 | Function name='f' paramCount=1 readOnly=true
   8 | Variable name='x' readOnly=true
   9 | BinaryExpression op=(Sym,"*") left=(Num,"3",3) right=(Id,"x",#8)
  10 | WhileStatement test=(Bool,"true",true) body=[#11,#12]
  11 | Assignment target=(Id,"x",#3) source=(Num,"3",3)
  12 | PrintStatement argument=#13
  13 | Conditional test=(Num,"0") consequent=#14 alternate=(Num,"2",2)
  14 | Call callee=(Id,"f",#7) args=[(Id,"x",#3)]`

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