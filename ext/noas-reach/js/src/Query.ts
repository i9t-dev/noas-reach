enum Status {
    Initialized,
    Tokenized,
    Parsed,
    Analyzed,
    Converted,
}

type Cst = any
type Ast = any

export type CiviQuery = any

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
    _: [Status.Analyzed, value: Ast]
): [Status.Converted, CiviQuery] {
    throw Error("Not implemented")
}

export function toCivi(query: String): CiviQuery {
    const initialized = init(query)
    const tokenized = tokenize(initialized)
    const parsed = parse(tokenized)
    const analyzed = analyze(parsed)
    return convert(analyzed)
}
