export enum Operation {
  NoOp,
  Log,
  FetchContacts,
}

export type Dispatch<MsgT> = (event: MsgT) => void

export type Command<MsgT> =
  | { op: Operation.NoOp }
  | { op: Operation.Log, message: string }
  | {
    op: Operation.FetchContacts,
    query: string,
    onStart: MsgT,
    onSuccessOf: (contacts: CiviContact[]) => MsgT,
    onFailureOf: (failure: Error) => MsgT,
  }

export interface CiviContact {
  contact_type: string
  display_name: string
  first_name: string | undefined
  last_name: string | undefined
  organization_name: string | undefined
  created_date: Date
  modified_date: Date
}