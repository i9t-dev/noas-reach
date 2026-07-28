import { CiviContact, Command, Operation, Dispatch } from './Command'

export interface Context {
  callCivi: (
    endpoint: 'Contact',
    method: 'get',
    options: {
      limit: number,
      where: [[fieldName: string, operator: string, fieldValue: string]]
    }
  ) => Promise<CiviContact[]>,
  log: (text: string) => void,
}

export function execute<MsgT>(
  context: Context,
  command: Command<MsgT>,
  dispatch: Dispatch<MsgT>,
) {
  switch (command.op) {
    case Operation.NoOp: /* No op */ break
    case Operation.FetchContacts: return fetchContacts(
      context,
      command.query,
      command.onStart,
      command.onSuccessOf,
      command.onFailureOf,
      dispatch)
    case Operation.Log: return log(context, command.message)
  }
}

function log(context: Context, message: string) {
  const date = new Date().toISOString()
  context.log(`[${date}] ${message}`)
}

function fetchContacts<MsgT>(
  context: Context,
  query: string,
  onStart: MsgT,
  onSuccess: (contacts: CiviContact[]) => MsgT,
  onFailure: (failure: Error) => MsgT,
  dispatch: Dispatch<MsgT>,
) {
  dispatch(onStart)
  context.log(`Calling fetch-contact API for query: ${query}`)
  context.callCivi(
    'Contact',
    'get',
    { limit: 25, where: [["display_name", "CONTAINS", query]] }
  )
    .then(
      (remoteContacts) => dispatch(onSuccess(remoteContacts)),
      (failure) => dispatch(onFailure(failure)),
    )
}
