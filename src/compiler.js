import ast from "./ast.js"
import analyze from "./analyzer.js"
import optimize from "./optimizer.js"
import generate from "./generator.js"

export default function compile(source, outputType) {
  outputType = outputType.toLowerCase()
  if (!["ast", "analyzed", "optimized", "js"].includes(outputType)) {
    throw new Error("Unknown output type")
  }
  const program = ast(source)
  if (outputType === "ast") {
    return program
  }
  const analyzed = analyze(program)
  if (outputType === "analyzed") {
    return analyzed
  }
  const optimized = optimize(program)
  if (outputType === "optimized") {
    return optimized
  }
  const target = generate(program)
  if (outputType === "js") {
    return target
  }
}
