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
      return <div style={{ marginBottom: "2em" }} className="noas-reach">
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
                      { ev: Event.QueryChanged, query: event.target.value }
                    )
                  }}
                  onKeyDown={(event) => {
                    if (event.key == "Enter") {
                      dispatch({ ev: Event.SearchClicked })
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
                  dispatch({ ev: Event.SearchClicked })
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
                  dispatch({ ev: Event.Reset })
                }}>
                Clear
              </button>
            </p>
          </div>
        </fieldset>)
    }

    function results(contacts: Contact[] | undefined, dispatch: Dispatch) {
      if (contacts == undefined) {
        return helpBlock()
      } else {
        return resultsFieldset(contacts, dispatch)
      }
    }

    function resultsFieldset(contacts: Contact[], dispatch: Dispatch) {
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
            {contacts?.length != 0
              ? contactRows(contacts, dispatch)
              : emptyContactsRow()}
          </tbody>
        </table>
      </fieldset>
    }

    function emptyContactsRow(): React.ReactNode {
      return <tr>
        <td colSpan={4}>
          <div style={{ textAlign: "center" }}>
            No result
          </div>
        </td>
      </tr>
    }

    function contactRows(contacts: Contact[], dispatch: Dispatch) {
      return <>
        {contacts.map(
          (c, i) => (
            <tr key={i}>
              <td>{c.displayName}</td>
              <td>{c.firstName || 'N/A'}</td>
              <td>{c.lastName || 'N/A'}</td>
              <td>
                <button onClick={() => (
                  dispatch({ ev: Event.DetailClicked, contact: c })
                )}>
                  Detail
                </button>
              </td>
            </tr>
          )
        )}
      </>
    }

    function helpBlock() {
      return <div style={{ width: "50em", margin: 'auto' }}>
        <p style={{ textAlign: 'center' }}>
          Please fill in the search form and press the search button.
        </p>
        <div style={{
          background: "lightgray",
          padding: '1em',
        }}>
          <p>The query takes the following form: </p>
          <p><code>[text] [option1:value1] [option2:value2] [...]</code></p>
          Available options:
          <ul>
            <li>
              <code>[pattern]</code>: Match any contact property ({globHelpLink()})
            </li>
            <li>
              <code>name:&lt;pattern&gt;</code>: Match contacts by name
              ({globHelpLink()})
            </li>
            <li>
              <code>email:&lt;pattern&gt;</code>: Match contacts by email
              ({globHelpLink()})
            </li>
            <li>
              <code>type:&lt;text&gt;</code>: Specify a type of contact (either "org", "person" or "all")
            </li>
          </ul>
        </div>
      </div>
    }

    function globHelpLink() {
      return <a
        href="https://en.wikipedia.org/wiki/Glob_(programming)"
        target="help-target">
        glob pattern
      </a>
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
    | { ev: Event.QueryChanged, query: string }
    | { ev: Event.SearchClicked }
    | { ev: Event.FetchedContacts, contacts: CiviContact[] | undefined }
    | { ev: Event.FetchContactsStarted }
    | { ev: Event.FetchContactsFailed, failure: Error }
    | { ev: Event.DetailClicked, contact: Contact }
    | { ev: Event.Reset }

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
      switch (message.ev) {
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
          return { model: model, command: { op: Operation.NoOp } }
      }
    }

    function saveQuery(model: Model, query: string): Change {
      return {
        model: {
          ...model,
          query: query
        },
        command: { op: Operation.NoOp },
      }
    }

    function indicateFetching(model: Model): Change {
      return {
        model: model,
        command: {
          op: Operation.Log,
          message: `Fetching contacts matching query: ${model.query}`,
        },
      }
    }

    function startFetch(model: Model): Change {
      return model.query
        ? {
          model: model,
          command: { op: Operation.FetchContacts, query: model.query },
        }
        : {
          model: { ...model, contacts: undefined },
          command: { op: Operation.NoOp },
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
        command: { op: Operation.NoOp },
      }
    }

    function indicateFailure(model: Model, failure: Error): Change {
      return {
        model: model,
        command: {
          op: Operation.Log,
          message: `Failed fetching contacts: ${failure}`
        },
      }
    }

    function openDetail(model: Model, contact: Contact): Change {
      return {
        model: model,
        command: {
          op: Operation.Log,
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
        command: { op: Operation.NoOp },
      }
    }
  }

  //-- Commands --//

  export enum Operation {
    NoOp,
    Log,
    FetchContacts,
  }

  export type Command =
    | { op: Operation.NoOp }
    | { op: Operation.Log, message: string }
    | { op: Operation.FetchContacts, query: string }

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
        switch (command.op) {
          case Operation.NoOp: /* No op */ break
          case Operation.FetchContacts:
            return fetchContacts(
              context,
              command.query,
              () => { dispatch({ ev: Event.FetchContactsStarted }) },
              (contacts: CiviContact[]) => {
                dispatch({ ev: Event.FetchedContacts, contacts: contacts })
              },
              (failure: Error) => {
                dispatch({ ev: Event.FetchContactsFailed, failure: failure })
              },
            )
          case Operation.Log:
            return log(context, command.message)
        }
      }
    }

    function log(context: Context, message: string) {
      const date = new Date().toISOString()
      context.log(`[${date}] ${message}`)
    }

    function fetchContacts(
      context: Context,
      query: string,
      onStart: () => void,
      onSuccess: (contacts: CiviContact[]) => void,
      onFailure: (error: Error) => void,
    ) {
      onStart()
      context.log(`Calling fetch-contact API for query: ${query}`)
      context
        .api(
          'Contact',
          'get',
          { limit: 25, where: [["display_name", "CONTAINS", query]], }
        )
        .then(
          (contacts: CiviContact[]) => { onSuccess(contacts) },
          (failure: Error) => { onFailure(failure) },
        )
    }
  }
}
