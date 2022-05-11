import assert from "assert/strict"
import ast from "../src/ast.js"
import analyze from "../src/analyzer.js"
import optimize from "../src/optimizer.js"
import generate from "../src/generator.js"

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
  {
    name: "if stmt",
    source: `
      kalla x = 5 
      ef(x equal 5) { 
      runes(x)  
      }
    `,
    expected: dedent`
      let x_1 = 5;
      if ((x_1 equal 5)) {
      console.log(x_1);
      }
    `,
  },
  {
    name: "vardec",
    source: `
    kalla x = 5
    runes(x)    
    `,
    expected: dedent`
    let x_1 = 5;
    console.log(x_1);
    `,
  },
  {
    name: "elseif",
    source: `
    kalla x = 5 
    ef(x equal 5) { 
     runes(x)  
    }
    kostr ef (x greaterThan 10) { 
      runes("greater") 
    }
    kostr { 
      runes("less") 
    }
    `,
    expected: dedent`
    let x_1 = 5;
    if ((x_1 equal 5)) {
    console.log(x_1);
    } else
    if ((x_1 greaterThan 10)) {
    console.log("greater");
    } else {
    console.log("less");
    }
    `,
  },
  {
    name: "compare",
    source: `
    kalla x = 1 lessThan (2 lessThanOrEqual (3 equal (4 doesNotEqual (5 greaterThanOrEqual (6 greaterThan 7)))))
    `,
    expected: dedent`
    let x_1 = (1 lessThan (2 lessThanOrEqual (3 equal (4 doesNotEqual (5 greaterThanOrEqual (6 greaterThan 7))))));
    `,
  },
  {
    name: "return",
    source: `
      hverfa 5
    `,
    expected: dedent`
    return 5;
    `,
  },
  {
    name: "fold",
    source: `
    runes 1 + 2
    `,
    expected: dedent`
    console.log(3);
    `,
  },
  {
    name: "Hello World",
    source: `
    runes("Hello, world!")
    `,
    expected: dedent`
    console.log("Hello, world!");
    `,
  },
]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(optimize(analyze(ast(fixture.source))))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})