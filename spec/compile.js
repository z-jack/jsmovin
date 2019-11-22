const { compileFromFile } = require("json-schema-to-typescript")
const { writeFileSync } = require("fs")

compileFromFile('animation.json').then(ts => writeFileSync('animation.d.ts', ts))
