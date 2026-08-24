import { createToken, Lexer } from "chevrotain"

export type CiviQuery = {
    limit: number,
    where: [[fieldName: string, operator: string, fieldValue: string]]
}

enum Status {
    Initialized,
    Tokenized,
    Parsed,
    Analyzed,
    Converted,
}

const allTokens = [
    createToken({ name: "Space", pattern: /\s/ }),
    createToken({ name: "Colon", pattern: /:/ }),
    createToken({ name: "Quote", pattern: /['"]/ }),
    createToken({
        name: "Identifier",
        pattern: /[A-Za-z][A-Za-z0-9\-_]*(?=:)/,
    }),
    createToken({ name: "Word", pattern: /[^'"\s]+/ }),
]

const lexer = new Lexer(allTokens)

type Cst = any
type Ast = any

function init(query: string): [Status.Initialized, string] {
    return [Status.Initialized, query]
}

function tokenize(
    [_status, initialQuery]: [Status.Initialized, string]
): [Status.Tokenized, any] {
    return [Status.Tokenized, lexer.tokenize(initialQuery)]
}

function parse(
    [_status, _lexedQuery]: [Status.Tokenized, string]
): [Status.Parsed, Cst] {
    throw Error("Not implemented")
}

function analyze(
    [_status, _parsedQuery]: [Status.Parsed, value: any]
): [Status.Analyzed, Ast] {
    throw Error("Not implemented")
}

function convert(
    [_status, _convertedQuery]: [Status.Analyzed, CiviQuery]
): [Status.Converted, CiviQuery] {
    throw Error("Not implemented")
}

export default function (query: string): CiviQuery {
    console.log("Initializing...")
    const initialized = init(query)
    console.log(`Initialized: ${JSON.stringify(initialized, null, 2)}`)

    console.log("Tokenizing...")
    const tokenized = tokenize(initialized)
    console.log(`Tokenized: ${JSON.stringify(tokenized, null, 2)}`)

    console.log("Parsing...")
    const parsed = parse(tokenized)
    console.log(`Parsed: ${JSON.stringify(parsed, null, 2)}`)

    console.log("Analyzing...")
    const analyzed = analyze(parsed)
    console.log(`Analyzed: ${JSON.stringify(analyzed, null, 2)}`)

    console.log("Converting...")
    const converted = convert(analyzed)
    console.log(`Converted: ${JSON.stringify(converted, null, 2)}`)

    const [/*status*/, civiQuery] = converted
    return civiQuery
}
