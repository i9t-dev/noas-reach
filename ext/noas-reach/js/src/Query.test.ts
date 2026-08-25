import { describe, expect, jest, test } from "@jest/globals"
import query from "./Query"

describe("Query", () => {
    test("tokenizes simple input", () => {
        try {
            const result = query(
                'key1:val1a key2:"val2a val2b val2c" key3:/val3a.*/'
            )
            const stringified = JSON.stringify(result, null, 2)
            console.log(stringified, null, 2)
            expect(result).toEqual([
                ["key1", "=", "val1a"],
                ["key2", "=", "val2a val2b val2c"],
                ["key3", "REGEXP", "val3a.*"],
            ])
        } catch (error) {
            console.log(error)
            throw error
        }
    })
})
