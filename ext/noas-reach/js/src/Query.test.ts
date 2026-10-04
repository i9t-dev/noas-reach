import { describe, expect, it, jest, test } from "@jest/globals"
import query, { Ast } from "./Query"

describe("Query", () => {
  it("builds Civi query", () => {
    try {
      const result = query(
        'key1:val1a key2:"val2a val2b val2c" key3:/val3a.*/'
      )
      const stringified = JSON.stringify(result, null, 2)
      console.log(stringified, null, 2)
      expect(result).toEqual({
        endpoint: "Content",
        method: "get",
        options: {
          limit: 25,
          join: [
            ["Contact AS c",
              "LEFT", [
                ["entity_type", "=", "'Contact'"],
                ["c.id", "=", "entity_id"],
              ],
            ],
            ["Membership AS m",
              "LEFT", [
                ["entity_type", "=", "'Membership'"],
                ["m.id", "=", "entity_id"],
              ],
            ],
            ["Subscription AS s",
              "LEFT", [
                ["entity_type", "=", "'Subscription'"],
                ["s.id", "=", "entity_id"],
              ],
            ],
          ],
          where:
            [
              "OR",
              [
                ["c.key1", "CONTAINS", "val1a"],
                ["c.key2", "=", "val2a val2b val2c"],
                ["c.key3", "REGEXP", "val3a.*"],
              ],
              [
                ["m.key1", "CONTAINS", "val1a"],
                ["m.key2", "=", "val2a val2b val2c"],
                ["m.key3", "REGEXP", "val3a.*"],
              ],
              [
                ["s.key1", "CONTAINS", "val1a"],
                ["s.key2", "=", "val2a val2b val2c"],
                ["s.key3", "REGEXP", "val3a.*"],
              ],
            ],
        },
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
  it("builds match-all query", () => {
    const result = query("*:*")
    expect(result).toEqual({
      endpoint: "Contact",
      method: "get",
      options: {
        limit: 25,
        where: undefined,
      },
    })
  })
  // it("builds content query", () => {
  //   const result = query("The five boxing wizards jump quickly")
  //   expect(result).toEqual({
  //     endpoint: "Content",
  //     method: "get",
  //     options: {
  //       limit: 25,
  //       where: [
  //         ["content", "CONTAINS", "The five boxing wizards jump quickly"],
  //       ]
  //     },
  //   })
  // })
  it("checks field instance", () => {
    const clause: Ast.Clause = {
      "key": "key1",
      "type": "word",
      "value": "val1a"
    }
    const isFieldClause = Ast.Match.isField(clause)
    expect(isFieldClause).toBeTruthy()
  })
})
