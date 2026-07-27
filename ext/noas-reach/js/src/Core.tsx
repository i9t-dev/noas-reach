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

  type Dispatch = (event: Message) => void

  export type Change = {
    model: Model
    command: Command
  }

  //-- View --//

  export namespace View {

    export function of(model: Model, dispatch: Dispatch) {
      return <div className="noas-reach">
        {form(model.query, dispatch)}
        {results(model.contacts, dispatch)}
      </div>
    }

    function form(query: string, dispatch: Dispatch) {
      return (
        <fieldset>
          <legend>Find contacts</legend>
          <div style={{ textAlign: 'center', width: "50em", margin: "auto" }}>
            <div>
              <div>
                <label>Query</label>
              </div>
              <div>
                <input
                  style={{ width: '50em' }}
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(event) => {
                    dispatch(
                      { event: Event.QueryChanged, query: event.target.value }
                    )
                  }}
                  onKeyDown={(event) => {
                    if (event.key == "Enter") {
                      dispatch({ event: Event.SearchClicked })
                    }
                  }}></input>
              </div>
            </div>
            <p>
              <button
                style={{
                  display: 'inline',
                  maxWidth: '7em',
                  width: '7em',
                  textAlign: 'center',
                }}
                onClick={() => {
                  dispatch({ event: Event.SearchClicked })
                }}>
                Search
              </button>
              <button
                style={{
                  display: 'inline',
                  maxWidth: '7em',
                  width: '7em',
                  textAlign: 'center',
                  marginLeft: ".5em",
                }}
                onClick={() => {
                  dispatch({ event: Event.Reset })
                }}>
                Clear
              </button>

            </p>
          </div>
        </fieldset>)
    }

    function results(contacts: Contact[] | undefined, dispatch: Dispatch) {
      if (contacts == undefined) {
        return <div style={{
          width: "50em",
          margin: 'auto',
        }}>
          <p style={{ textAlign: 'center' }}>
            Please fill in the search form and press the search button.
          </p>
          <div style={{
            background: "lightgray",
            padding: '1em',
          }}>Search options:
            <ul>
              <li>
                <code>name</code>: match the name of contacts
              </li>
              <li>
                <code>type</code>: type of contact (either "org" or "person")
              </li>
            </ul>
          </div>
        </div>
      } else {
        return <fieldset>
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
              {(contacts &&
                contacts?.length != 0)
                ? contacts.map(
                  (c, i) => (
                    <tr key={i}>
                      <td>{c.displayName}</td>
                      <td>{c.firstName || 'N/A'}</td>
                      <td>{c.lastName || 'N/A'}</td>
                      <td>
                        <button onClick={() => (
                          dispatch({ event: Event.DetailClicked, contact: c })
                        )}>
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
      }
    }
  }

  //-- Update --//

  enum Event {
    QueryChanged,
    SearchClicked,
    FetchContactsStarted,
    FetchedContacts,
    FetchContactsFailed,
    DetailClicked,
    Reset,
  }

  export type Message =
    | { event: Event.QueryChanged, query: string }
    | { event: Event.SearchClicked }
    | { event: Event.FetchedContacts, contacts: CiviContact[] | undefined }
    | { event: Event.FetchContactsStarted }
    | { event: Event.FetchContactsFailed, failure: Error }
    | { event: Event.DetailClicked, contact: Contact }
    | { event: Event.Reset }

  interface CiviContact {
    contact_type: string
    display_name: string
    first_name: string | undefined
    last_name: string | undefined
    organization_name: string | undefined
    created_date: Date
    modified_date: Date
  }

  export namespace Update {

    export function of(model: Model, message: Message): Change {
      switch (message.event) {
        case Event.QueryChanged:
          return saveQuery(model, message.query)
        case Event.SearchClicked:
          return startFetch(model)
        case Event.FetchContactsStarted:
          return indicateFetching(model)
        case Event.FetchedContacts:
          return importFetched(model, message.contacts)
        case Event.FetchContactsFailed:
          return indicateFailure(model, message.failure)
        case Event.DetailClicked:
          return openDetail(model, message.contact)
        case Event.Reset:
          return reset(model)
        default:
          return { model: model, command: { type: 'NoOp' } }
      }
    }

    function saveQuery(model: Model, query: string): Change {
      return {
        model: {
          ...model,
          query: query
        },
        command: { type: 'NoOp' },
      }
    }

    function indicateFetching(model: Model): Change {
      return {
        model: model,
        command: {
          type: 'Log',
          message: `Fetching contacts matching query: ${model.query}`,
        },
      }
    }

    function startFetch(model: Model): Change {
      const command: Command =
        model.query
          ? { type: 'FetchContacts', query: model.query }
          : { type: 'ClearResults' }
      return {
        model: model,
        command: command,
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
        command: { type: 'NoOp' },
      }
    }

    function indicateFailure(model: Model, failure: Error): Change {
      return {
        model: model,
        command: {
          type: 'Log',
          message: `Failed fetching contacts: ${failure}`
        },
      }
    }

    function openDetail(model: Model, contact: Contact): Change {
      return {
        model: model,
        command: {
          type: 'Log',
          message: `TODO: Open detail for contact: ${contact.displayName}`,
        }
      }
    }

    function reset(model: Model): Change {
      return {
        model: {
          ...model,
          query: "",
          contacts: undefined,
        },
        command: { type: 'NoOp' },
      }
    }
  }

  //-- Commands --//

  export type Command =
    | { type: 'NoOp' }
    | { type: 'Log', message: string }
    | { type: 'FetchContacts', query: string }
    | { type: 'ClearResults' }

  export namespace Effect {

    export type Context = {
      api: (
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
      log: (message: string) => void
    }

    export function handler(context: Context, dispatch: Dispatch) {
      return (command: Command) => {
        switch (command.type) {
          case 'NoOp': /* No op */ break
          case 'FetchContacts':
            return fetchContacts(context, command.query, dispatch)
          case 'Log':
            return log(context, command.message)
          case 'ClearResults':
            return clearResults(dispatch)
        }
      }
    }

    function log(context: Context, message: string) {
      const date = new Date().toISOString()
      context.log(`[${date}] ${message}`)
    }

    function fetchContacts(context: Context, query: string, dispatch: Dispatch) {
      dispatch({ event: Event.FetchContactsStarted })
      context.log(`Calling fetch-contact API for query: ${query}`)
      context
        .api(
          'Contact',
          'get',
          { limit: 25, where: [["display_name", "CONTAINS", query]], }
        )
        .then(
          (contacts: CiviContact[]) => {
            dispatch({ event: Event.FetchedContacts, contacts: contacts })
          },
          (failure: Error) => {
            dispatch({ event: Event.FetchContactsFailed, failure: failure })
          },
        )
    }

    function clearResults(dispatch: Dispatch) {
      dispatch({ event: Event.FetchedContacts, contacts: undefined })
    }
  }
}
