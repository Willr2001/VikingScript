import assert from "assert/strict"
import fs from "fs"
import ohm from "ohm-js"

const syntaxChecks = [
  ["all numeric literal forms", "runes(8 * 89.123)"],
  ["complex expressions", "runes(83 * ((((-((((13 / 21)))))))) + 1 - 0)"],
  ["all unary operators", "runes (-3) runes (!loki)"],
  ["all binary operators", "runes x && y || z * 1 / 2 ** 3 + 4 lessThan 5"],
  ["all arithmetic operators", "kalla x = (-3) * 2 + 4 - (-7.3) * 8 ** 13 / 1"],
  [
    "all relational operators",
    "kalla x = 1 lessThan (2 lessThanOrEqual (3 equal (4 doesNotEqual (5 greaterThanOrEqual (6 greaterThan 7)))))",
  ],
  ["all logical operators", "kalla x = true && false || (!false)"],
  ["short if statements", "ef 2 equal 1 {runes 0}"],
  ["if statements", "ef 2 equal 1 {runes 0} kostr ef thor {kalla x = 1}"],
  ["true and false", "runes thor && (!loki)"],
  ["end of program inside comment", "runes(0) >----> yay"],
  ["comments with no text are ok", "runes(1)>---->\nrunes(0)>---->"],
  ["non-Latin letters in identifiers", "コンパイラ = 100"],
  ["unicode escapes in strings", `runes "XY\\u{a1902b}"`],
]

const syntaxErrors = [
  ["non-letter in an identifier", "ab😭c = 2", /Line 1, col 3/],
  ["malformed number", "x= 2.", /Line 1, col 6/],
  ["a missing right operand", "runes(5 -", /Line 1, col 10/],
  ["a non-operator", "runes(7 * ((2 _ 3)", /Line 1, col 15/],
  ["an expression starting with a )", "x = )", /Line 1, col 5/],
  ["a statement starting with expression", "x * 5", /Line 1, col 3/],
  ["an illegal statement on line 2", "runes(5)\nx * 5", /Line 2, col 3/],
  ["a statement starting with a )", "runes(5)\n) * 5", /Line 2, col 1/],
  ["an expression starting with a *", "x = * 71", /Line 1, col 5/],
  ["use kostr as a variable name", "kalla kostr = 1", /Line 1, col 7/],
  ["use kalla as a variable name", "kalla kalla = 1", /Line 1, col 7/],
  ["bad unicode escape", `runes "XY\\u{a1@W02b}"`, /Line 1, col 15/],
]

describe("The grammar", () => {
  const grammar = ohm.grammar(fs.readFileSync("src/VikingScript.ohm"))
  for (const [scenario, source] of syntaxChecks) {
    it(`properly specifies ${scenario}`, () => {
      assert(grammar.match(source).succeeded())
    })
  }
  for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
    it(`does not permit ${scenario}`, () => {
      const match = grammar.match(source)
      assert(!match.succeeded())
      assert(new RegExp(errorMessagePattern).test(match.message))
    })
  }
})
