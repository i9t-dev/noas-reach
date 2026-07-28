  export enum Operation {
    NoOp,
    Log,
    FetchContacts,
  }

  export type Command =
    | { op: Operation.NoOp }
    | { op: Operation.Log, message: string }
    | { op: Operation.FetchContacts, query: string }

