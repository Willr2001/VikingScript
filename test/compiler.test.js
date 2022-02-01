import assert from "assert"
import { add } from "../src/VikingScript.js"
describe("The compiler", () => {
  describe("has an add function", () => {
    it("should return 4 when adding 2 and 2", () => {
      assert.deepEqual(add(2, 2), 4)
    })
  })
})
