enum Status {
    Initialized,
    Tokenized,
    Parsed,
    Analyzed,
    Converted,
}

type Cst = any
type Ast = any

export type CiviQuery = {
  limit: number,
  where: [[fieldName: string, operator: string, fieldValue: string]]
}

function init(query: String): [Status.Initialized, String] {
    return [Status.Initialized, query]
}

function tokenize(
    _: [Status.Initialized, query: String]
): [Status.Tokenized, any] {
    throw Error("Not implemented")
}

function parse(_: [Status.Tokenized, value: String]): [Status.Parsed, Cst] {
    throw Error("Not implemented")
}

function analyze(_: [Status.Parsed, value: any]): [Status.Analyzed, Ast] {
    throw Error("Not implemented")
}

function convert(
    _: [Status.Analyzed, value: CiviQuery]
): [Status.Converted, CiviQuery] {
    throw Error("Not implemented")
}

export function toCivi(query: String): CiviQuery {
    const initialized = init(query)
    const tokenized = tokenize(initialized)
    const parsed = parse(tokenized)
    const analyzed = analyze(parsed)
    const [ _, result ] = convert(analyzed)
    return result
}
