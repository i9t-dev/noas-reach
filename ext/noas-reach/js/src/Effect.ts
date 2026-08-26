import { CiviContact, Command, Operation, Dispatch } from './Command'
import Query from './Query'
import { Civi } from './Query'

export interface Context {
  callCivi: (
    endpoint: 'Contact',
    method: 'get',
    options: Civi.Query
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
  context.log(`Parsing query: ${query}`)
  const civiQuery = Query(query)
  context.log(`Parsed query to: ${JSON.stringify(civiQuery, null, 2)}`)
  context.log(`Fetching contacts for parsed query`)
  context.callCivi('Contact', 'get', civiQuery)
    .then(
      (remoteContacts) => dispatch(onSuccess(remoteContacts)),
      (failure) => dispatch(onFailure(failure)),
    )
}
