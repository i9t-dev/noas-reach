import { describe, expect, it, jest, test } from "@jest/globals"
import query from "./Query"

describe("Query", () => {
  it("tokenizes simple input", () => {
    try {
      const result = query(
        'key1:val1a key2:"val2a val2b val2c" key3:/val3a.*/'
      )
      const stringified = JSON.stringify(result, null, 2)
      console.log(stringified, null, 2)
      expect(result).toEqual({
        limit: 25,
        where: [
          ["key1", "CONTAINS", "val1a"],
          ["key2", "=", "val2a val2b val2c"],
          ["key3", "REGEXP", "val3a.*"],
        ]
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  })
  it("throws error for invalid word", () => {
    try {
      query('key1:')
      throw Error("Exception was expected")
    } catch (throwable) {
      const error = throwable as Error
      expect(error.message).toMatch(
        /NoViableAltException: At character 4, after \[key1\] - Expecting: one of these possible Token sequences:\n\s*1\.\s*\[Word\]\n\s*2\.\s*\[Text\]\n\s*3\.\s*\[Regex\]/
      )
    }
  })
})
