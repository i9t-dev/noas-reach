import { describe, expect, test } from "@jest/globals"
import query from "./Query"
import { createToken, Lexer } from "chevrotain"

describe("Query", () => {
    test("tokenizes simple input", () => {
        try {
            const result = query('key1:val1 key2:"val2 val3 val4"')
            const stringified = JSON.stringify(result, null, 2)
            console.log(stringified, null, 2)
        } catch (error) {
            console.log(error, null, 2)
        }
    })
})
