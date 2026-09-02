import React from 'react'
import { CiviContact, Command, Dispatch, Operation } from './Command'

export namespace Core {

  //-- Model --//

  export type Model = {
    name: string
    query: string
    contacts: Contact[] | Error | undefined
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

  export type Change = {
    model: Model
    command: Command<Message>
  }

  //-- View --//

  export namespace View {

    export function of(model: Model, dispatch: Dispatch<Message>) {
      return <>
        <style>
          {`li { list-style: inside }`}
        </style>
        <div style={{ marginBottom: "2em" }} className="noas-reach">
          {form(model.query, dispatch)}
          {results(model.contacts, dispatch)}
        </div>
      </>
    }

    function form(query: string, dispatch: Dispatch<Message>) {
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

    function results(contacts: Contact[] | Error | undefined, dispatch: Dispatch<Message>) {
      if (contacts == undefined) {
        return helpBlock(dispatch)
      } else if (contacts instanceof Error) {
        return <>
          {errorBlock(contacts, dispatch)}
          {helpBlock(dispatch)}
        </>
      } else {
        return resultsFieldset(contacts, dispatch)
      }
    }

    function errorBlock(contacts: Error, dispatch: Dispatch<Core.Message>) {
      return <div style={{
        width: "50em",
        margin: 'auto',
        marginBottom: '1em',
        textAlign: 'center',
      }}>
        <p style={{ color: 'red' }}>Invalid query ({contacts.message}).</p>
        <p style={{ color: 'red' }}>Please try again.</p>
      </div>
    }

    function resultsFieldset(contacts: Contact[], dispatch: Dispatch<Message>) {
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

    function contactRows(contacts: Contact[], dispatch: Dispatch<Message>) {
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

    function helpBlock(dispatch: Dispatch<Message>) {
      return <div style={{ width: "50em", margin: 'auto' }}>
        <p style={{ textAlign: 'center' }}>
          Please fill in the search form and press the search button.
        </p>
        <div style={{
          background: "lightgray",
          padding: '1em',
        }}>
          <p>Example query:</p>
          <p>
            <code>word1 word2 field1:value1a field1:value1b field2:value2</code>
          </p>
          <p>
            Query structure:
          </p>
          <ul>
            <li>A query consists of several <em>clauses</em></li>
            <li>Clauses are separated with spaces</li>
            <li>Specific <em>fields</em> can be given with the form <code>field:expression</code></li>
            <li>The <em>expression</em> allows to match a certain field to a given value (more info below)</li>
            <li>The <em>default field</em> clause (here, <code>word1 word2</code>) matches all text fields</li>
          </ul>
          <p>
            Expressions (Press the links to try):
          </p>
          <ul>
            <li>
              <code>first_name:Bob</code>: <a
                href="#"
                onClick={() => {
                  dispatch({ ev: Event.QueryChanged, query: "first_name:Bob" })
                }
                }>First name contains "Bob"</a>.
            </li>
            <li>
              <code>display_name:"Bob Adams"</code>: <a
                href="#"
                onClick={() => {
                  dispatch({
                    ev: Event.QueryChanged,
                    query: 'display_name:"Bob Adams Jr."',
                  })
                }
                }>Display name exactly equals "Bob Adams"</a>.
            </li>
            <li>
              <code>display_name:"ad.*fam"</code>: <a
                href="#"
                onClick={() => {
                  dispatch({
                    ev: Event.QueryChanged,
                    query: 'display_name:/ad.*fam/',
                  })
                }
                }>Display name contains "ad" and "fam" with any text in-between</a>.
            </li>
            <li>
              <code>*:*</code> (match-all): <a
                href="#"
                onClick={() => {
                  dispatch({
                    ev: Event.QueryChanged,
                    query: '*:*',
                  })
                }
                }>all entities</a>.
            </li>
          </ul>
        </div>
      </div >
    }
  }

  //-- Update --//

  export enum Event {
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
    | { ev: Event.FetchContactsFailed, failure: Error | undefined }
    | { ev: Event.DetailClicked, contact: Contact }
    | { ev: Event.Reset }

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
          command: {
            op: Operation.FetchContacts,
            query: model.query,
            onStart: { ev: Event.FetchContactsStarted },
            onSuccessOf: (contacts: CiviContact[]) =>
              ({ ev: Event.FetchedContacts, contacts: contacts }),
            onFailureOf: (failure) =>
              ({ ev: Event.FetchContactsFailed, failure: failure }),
          },
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

    function indicateFailure(
      model: Model,
      failure: Error | undefined
    ): Change {
      return {
        model: {
          ...model,
          contacts: failure,
        },
        command: {
          op: Operation.Log,
          message: `Failed fetching contacts: ${JSON.stringify(failure)}`
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
}

