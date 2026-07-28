import { CiviContact, Command, Operation, Dispatch } from './Command'

export interface Context {
  CRM: {
    api4: (
      endpoint: string,
      method: string,
      options: {
        limit: number,
        where: [[
          fieldName: string,
          operator: string,
          fieldValue: string
        ]]
      }
    ) => Promise<CiviContact[]>
  },
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
    case Operation.Log: return log(command.message)
  }
}

function log(message: string) {
  const date = new Date().toISOString()
  console.log(`[${date}] ${message}`)
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
  context.CRM
    .api4(
      'Contact',
      'get',
      { limit: 25, where: [["display_name", "CONTAINS", query]], }
    )
    .then(
      (remoteContacts: CiviContact[]) =>
        dispatch(onSuccess(remoteContacts)),
      (failure: Error) =>
        dispatch(onFailure(failure)),
    )
}
