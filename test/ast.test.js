import assert from "assert/strict"
import util from "util"
import ast from "../src/ast.js"

const source = `runes("hello, world")`

const expected = `   1 | Program statements=[#2]
   2 | PrintStatement argument=(Str,""hello, world"")`

const source1 = `kalla x = 5 kalla y = 10 hverfa x greaterThan y`

const expected1 = `   1 | Program statements=[#2,#3,#4]
   2 | VariableDeclaration variable=(Id,"x") initializer=(Num,"5")
   3 | VariableDeclaration variable=(Id,"y") initializer=(Num,"10")
   4 | ReturnStatement expression=#5
   5 | BinaryExpression op=(Sym,"greaterThan") left=(Id,"x") right=(Id,"y")`

const source2 = `valhalla add(x, y) { hverfa x + y } `

const expected2 = `  `

const source3 = ` }:| This is a comment in VikingScript!`

const expected3 = `  `

describe("The AST generator", () => {
  it("produces the expected AST for all node types", () => {
    assert.deepEqual(util.format(ast(source)), expected)
    assert.deepEqual(util.format(ast(source1)), expected1)
  })
})
