import { describe, expect, test } from "@jest/globals"
import query from "./Query"
import { createToken, Lexer } from "chevrotain"

describe("Query", () => {
    test("tokenizes simple input", () => {
        const tokenized = query('key1:val1 key2:"val2 val3 val4"')

        const stringified = JSON.stringify(tokenized, null, 2)
        console.log(stringified, null, 2)

        const projectedTokens = tokenized.tokens.map(
            (t) => [t.tokenType.name, t.image]
        )

        expect(projectedTokens).toStrictEqual([
            ["Identifier", "key1"],
            ["Colon", ":"],
            ["Word", "val1"],
            ["Space", " "],
            ["Identifier", "key2"],
            ["Colon", ":"],
            ["Quote", '"'],
            ["Word", "val2"],
            ["Space", " "],
            ["Word", "val3"],
            ["Space", " "],
            ["Word", "val4"],
            ["Quote", '"'],
        ])
    })
})
