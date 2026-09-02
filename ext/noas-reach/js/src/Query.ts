import { createToken, CstNode, CstParser, EarlyExitException, ILexingResult, IRecognitionException, Lexer, MismatchedTokenException, NoViableAltException } from "chevrotain"

export namespace Civi {
  export type Operator = "=" | "REGEXP"
  export type Clause = [string, Operator, string]
  export type Query = { limit: number, where: Clause[] }
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
  const errors = parser.errors
  if (errors.length > 0) {
    throw Error(parseErrors(errors))
  } else {
    return [Status.Parsed, cst]
  }
}

function parseErrors(errors: IRecognitionException[]) {
  console.error(`Error parsing query:`)
  console.error(JSON.stringify(errors, null, 2))
  const msg = errors
    .map((e) => {
      if (
        e instanceof NoViableAltException ||
        e instanceof MismatchedTokenException
      ) {
        return `${e.name}: At character ${e.previousToken.endColumn}, after [${e.previousToken.image}] - ${e.message}`
      } else {
        return `${e.name}: ${e.message}`
      }
    })
    .join("\n")
  return msg
}

const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

namespace Ast {
  export type Clause = {
    key: string,
    type: "text" | "word" | "regex" | "unknown",
    value: string,
  }

  export type Query = {
    query: {
      clauses: Clause[]
    }
  }
}

class CustomCstVisitor extends BaseCstVisitor {
  constructor() {
    super()
    this.validateVisitor()
  }

  query(ctx: any): Ast.Query {
    const clauses = ctx.clause
    return {
      query: {
        clauses: clauses.map((c: any) => this.visit(c))
      }
    }
  }

  clause(ctx: any): Ast.Clause {
    return ctx.Text ? {
      key: ctx.Identifier[0].image,
      type: "text",
      value: (ctx.Text[0].image as string)
        .replace(/^["'](.*)["']$/, "$1"),
    } : ctx.Word ? {
      key: ctx.Identifier[0].image,
      type: "word",
      value: ctx.Word[0].image,
    } : ctx.Regex ? {
      key: ctx.Identifier[0].image,
      type: "regex",
      value: (ctx.Regex[0].image as string)
        .replace(/^\/(.*)\/$/, "$1"),
    } : {
      key: ctx.Identifier[0].image,
      type: "unknown",
      value: "TBD",
    }
  }
}

const cstVisitor = new CustomCstVisitor()

function analyze(
  [_status, parsedQuery]: [Status.Parsed, value: Cst]
): [Status.Analyzed, Ast.Query] {
  const ast = cstVisitor.visit(parsedQuery)
  return [Status.Analyzed, ast]
}

function convert(
  [_status, ast]: [Status.Analyzed, Ast.Query]
): [Status.Converted, Civi.Query] {
  const civiWhereClauses = ast.query.clauses
    .filter((c) => c.type != "unknown")
    .map((c) => {
      const operators = {
        text: "=",
        word: "CONTAINS",
        regex: "REGEXP",
        unknown: undefined,
      }
      const op = operators[c.type]
      if (op) {
        return [c.key, op, c.value] as [string, Civi.Operator, string]
      } else {
        throw Error(`Query clause type unknown: ${c.type}`)
      }

    })
  const result = {
    limit: 25,
    where: civiWhereClauses
  }
  return [Status.Converted, result]
}

export default function (query: string): Civi.Query {
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
