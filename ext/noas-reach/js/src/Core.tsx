import React from 'react'

export namespace Core {

  //-- Model --//

  export type Model = {
    name: string
    query: string
    contacts: Contact[] | undefined
  }

  type Contact = {
    displayName: string,
    firstName: string | undefined,
    lastName: string | undefined,
  }

  export const initialModel: Model = {
    name: "Noah's Reach",
    query: "",
    contacts: undefined,
  }

  //-- View --//

  type Dispatch = (event: Message) => void

  export function view(model: Model, dispatch: Dispatch) {
    return <div className="noas-reach">
      <h2>Hello, this is {model.name}!</h2>
      <fieldset>
        <legend>Find contacts</legend>
        <p>
          <label>Query</label>
          <input type="text"
            autoFocus
            value={model.query}
            onChange={(event) => {
              dispatch({ type: 'QueryChanged', query: event.target.value })
            }}></input>
        </p>
        <p>
          <button
            onClick={() => {
              dispatch({ type: 'SearchClicked' })
            }}>
            Search
          </button>
        </p>
      </fieldset>
      <fieldset>
        <legend>Results</legend>
        <table>
          <thead>
            <tr>
              <th>Display name</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {model.contacts
              ? model.contacts.map(
                (c, i) => (
                  <tr key={i}>
                    <td>{c.displayName}</td>
                    <td>{c.firstName || 'N/A'}</td>
                    <td>{c.lastName || 'N/A'}</td>
                    <td>
                      <button
                        onClick={
                          () => (dispatch(
                            { type: 'DetailClicked', contact: c }
                          ))
                        }>
                        Detail
                      </button>
                    </td>
                  </tr>
                )
              )
              : <tr>
                <td colSpan={4}>
                  <div style={{ textAlign: "center" }}>
                    No result
                  </div>
                </td>
              </tr>}
          </tbody>
        </table>
      </fieldset>
    </div>
  }

  //-- Update --//

  export type Message =
    | { type: 'QueryChanged', query: string }
    | { type: 'SearchClicked' }
    | { type: 'FetchContactsStarted' }
    | { type: 'FetchedContacts', contacts: CiviContact[] | undefined }
    | { type: 'FetchContactsFailed', failure: Error }
    | { type: 'DetailClicked', contact: Contact }

  export type Change = {
    model: Model
    effect: Effect
  }

  export function update(model: Model, message: Message): Change {

    switch (message.type) {
      case 'QueryChanged': return saveQuery(model, message.query)
      case 'SearchClicked': return startFetch(model)
      case 'FetchContactsStarted': return indicateFetching(model)
      case 'FetchedContacts': return importFetched(model, message.contacts)
      case 'FetchContactsFailed': return indicateFailure(model, message.failure)
      case 'DetailClicked': return openDetail(model, message.contact)
      default: return { model: model, effect: { type: 'NoOp' } }
    }

    function saveQuery(model: Model, query: string): Change {
      return {
        model: {
          ...model,
          query: query
        },
        effect: { type: 'NoOp' },
      }
    }

    function indicateFetching(model: Model): Change {
      return {
        model: model,
        effect: {
          type: 'Log',
          message: `Fetching contacts matching query: ${model.query}`,
        },
      }
    }

    function startFetch(model: Model): Change {
      return {
        model: model,
        effect: { type: 'FetchContacts', query: model.query },
      }
    }

    function importFetched(
      model: Model,
      civiContacts: CiviContact[] | undefined,
    ): Change {
      return {
        model: {
          ...model,
          contacts: civiContacts?.map(
            (civiContact) => {
              return {
                displayName: civiContact.display_name,
                firstName: civiContact.first_name,
                lastName: civiContact.last_name,
              }
            }),
        },
        effect: { type: 'NoOp' },
      }
    }

    function indicateFailure(model: Model, failure: Error): Change {
      return {
        model: model,
        effect: { type: 'Log', message: `Failed fetching contacts: ${failure}` },
      }
    }

    function openDetail(model: Model, contact: Contact): Change {
      return {
        model: model,
        effect: {
          type: 'Log',
          message: `TODO: Open detail for contact: ${contact.displayName}`,
        }
      }
    }
  }

  //-- Effects --//

  export type Effect =
    | { type: 'NoOp' }
    | { type: 'Log', message: string }
    | { type: 'FetchContacts', query: string }

  interface CiviContact {
    contact_type: string
    display_name: string
    first_name: string | undefined
    last_name: string | undefined
    organization_name: string | undefined
    created_date: Date
    modified_date: Date
  }

  export type Context = {
    api: (
      endpoint: string,
      method: string,
      options: { limit: number }
    ) => Promise<CiviContact[]>
    log: (message: string) => void
  }

  export const makeHandleEffect = (context: Context) =>

    (effect: Effect, dispatch: Dispatch) => {

      switch (effect.type) {
        case 'NoOp': /* No op */ break
        case 'FetchContacts': return fetchContacts(effect.query, dispatch)
        case 'Log': return logMessage(effect.message)
      }

      function logMessage(message: string) {
        const date = new Date().toISOString()
        context.log(`[${date}] ${message}`)
      }

      function fetchContacts(query: string, dispatch: Dispatch) {
        dispatch({ type: 'FetchContactsStarted' })
        context.log(`TODO: Fetch according to query: ${query}`)
        context
          .api('Contact', 'get', { limit: 25 })
          .then(
            (contacts: CiviContact[]) => {
              dispatch({ type: 'FetchedContacts', contacts: contacts })
            },
            (failure: Error) => {
              dispatch({ type: 'FetchContactsFailed', failure: failure })
            },
          )
      }
    }
}
