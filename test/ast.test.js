import assert from "assert/strict"
import util from "util"
import ast from "../src/ast.js"

const source = `runes("hello, world")`

const expected = `   1 | Program statements=[#2]
   2 | PrintStatement argument=#3
   3 | Call callee=(Id,"hello, world") `

const source1 = `kalla x = 5 kalla y = 10 hverfa x greaterThan y`

const expected1 = `   1 | Program statements=[#2,#4]
    2 | VariableDeclaration variable=(Id,"x") initializer=#4
    3 | Assignment target=(Id,"x") source=(Num,"5")
    4 | VariableDeclaration variable=(Id,"y") initializer=#5
    5 | Assignment target=(Id,"y") source=(Num,"10")
    6 | ReturnStatement expression=[#7]
    7 | Conditional test=(Id,"x") alternate=(Id, "y")`

const source2 = `valhalla add(x, y) { hverfa x + y } `

const expected2 = `  `

const source3 = ` }:| This is a comment in VikingScript!`

const expected3 = `  `

const source4 = `  kalla x = 5 ef(x equal 5) { runes(x)  }`

const expected4 = `    1 | Program statements=[#2,#3]
2 | VariableDeclaration variable=(Id,"x") initializer=(Num,"5")
3 | ShortIfStatement test=#4 consequent=[#5]
4 | BinaryExpression op=(Sym,"equal") left=(Id,"x") right=(Num,"5")
5 | PrintStatement argument=(Id,"x") `


    
describe("The AST generator", () => {
  it("produces the expected AST for all node types", () => {
    assert.deepEqual(util.format(ast(source)), expected)
  })
})