import { createToken, CstNode, CstParser, ILexingResult, Lexer } from "chevrotain"

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

const Space = createToken({
    name: "Space",
    pattern: /\s+/,
    group: Lexer.SKIPPED,
})

const Identifier = createToken({
    name: "Identifier",
    pattern: /[A-Za-z][A-Za-z0-9\-_]*(?=:)/,
})

const Colon = createToken({ name: "Colon", pattern: /:/, group: Lexer.SKIPPED })
const Text = createToken({ name: "Text", pattern: /["'][^"']*["']/ })
const Regex = createToken({ name: "Regex", pattern: /\/[^\/]*\// })
const Word = createToken({ name: "Word", pattern: /[^'"\/\s]+/ })

const allTokens = [Space, Colon, Text, Regex, Identifier, Word]

const lexer = new Lexer(allTokens)

type Cst = CstNode
type Ast = {
    query: {
        clauses: [
            key: string,
            value: any,
        ]
    }
}

function init(query: string): [Status.Initialized, string] {
    return [Status.Initialized, query]
}

function tokenize(
    [_status, initialQuery]: [Status.Initialized, string]
): [Status.Tokenized, ILexingResult] {
    return [Status.Tokenized, lexer.tokenize(initialQuery)]
}

type CstNodeSupplier = () => CstNode

class QueryParser extends CstParser {
    constructor() {
        super(allTokens)
        this.RULE("query", () => {
            this.AT_LEAST_ONE({
                DEF: () => {
                    this.SUBRULE(this.clause)
                }
            })
        })
        this.RULE("clause", () => {
            this.CONSUME(Identifier)
            this.OR([
                { ALT: () => this.CONSUME(Word) },
                { ALT: () => this.CONSUME(Text) },
                { ALT: () => this.CONSUME(Regex) },
            ])
        })
        this.performSelfAnalysis()
    }

    readonly query!: CstNodeSupplier
    readonly clause!: CstNodeSupplier
}

const parser = new QueryParser()

function parse(
    [_status, lexedQuery]: [Status.Tokenized, ILexingResult]
): [Status.Parsed, Cst] {
    parser.input = lexedQuery.tokens
    const cst = parser.query()
    return [Status.Parsed, cst]
}

function analyze(
    [_status, _parsedQuery]: [Status.Parsed, value: Cst]
): [Status.Analyzed, Ast] {
    throw Error("Not implemented")
}

function convert(
    [_status, _convertedQuery]: [Status.Analyzed, Ast]
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

    const [_conversionStatus, civiQuery] = converted
    return civiQuery
}
