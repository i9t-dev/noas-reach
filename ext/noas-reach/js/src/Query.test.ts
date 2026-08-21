import { describe, test } from "@jest/globals"
import query from "./Query"

describe("Query", () => {
    test("tokenizes simple input", () => {
        const q = query("key1=val1 key2=val2")
        console.log(`Query: ${q}`)
    })
})
