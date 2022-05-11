import assert from "assert/strict"
import util from "util"
import ast from "../src/ast.js"

const source = ` runes("Hello, world! 🌎")`

const expected = `   1 | Program statements=[#2]
   2 | PrintStatement argument=(Str,""Hello, world! 🌎"")`

const source1 = ` kalla x = 5 kalla y = 10 hverfa x greaterThan y`

const expected1 = `   1 | Program statements=[#2,#3,#4]
   2 | VariableDeclaration variable=(Id,"x") initializer=(Num,"5")
   3 | VariableDeclaration variable=(Id,"y") initializer=(Num,"10")
   4 | ReturnStatement expression=#5
   5 | BinaryExpression op=(Sym,"greaterThan") left=(Id,"x") right=(Id,"y")`

// const source2 = `valhalla add(x, y) { hverfa x + y } `

// const expected2 = `  `

 const source3 = `hverfa 5`

 const expected3 = `   1 | Program statements=[#2]
   2 | ReturnStatement expression=(Num,"5")`

// const source4 = `  kalla x = 5 ef(x equal 5) { runes(x)  }`

// const expected4 = `    1 | Program statements=[#2,#3]
// 2 | VariableDeclaration variable=(Id,"x") initializer=(Num,"5")
// 3 | ShortIfStatement test=#4 consequent=[#5]
// 4 | BinaryExpression op=(Sym,"equal") left=(Id,"x") right=(Num,"5")
// 5 | PrintStatement argument=(Id,"x") `

describe("The AST generator", () => {
  it("hello world", () => {
    assert.deepEqual(util.format(ast(source)), expected)
  })
  it("program", () => {
    assert.deepEqual(util.format(ast(source1)), expected1)
  })
  it("return", () => {
    assert.deepEqual(util.format(ast(source3)), expected3)
  })
})

