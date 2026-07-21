import React from 'react'

export namespace Core {

  //-- Model --//

  export type Model = {
    name: string
    query: string
    contacts: CiviContact[] | undefined
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
        <ul>{model.contacts
          ? model.contacts.map(
            (c, i) => (
              <li key={i}>{c.display_name}</li>
            )
          )
          : "No result"}</ul>
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

  export type Change = {
    model: Model
    effect: Effect
  }

  export function update(model: Model, message: Message): Change {
    switch (message.type) {
      case 'QueryChanged': return saveQuery(model, message.query)
      case 'SearchClicked': return startFetchContacts(model)
      case 'FetchContactsStarted': return indicateFetching(model)
      case 'FetchedContacts': return saveFetched(model, message.contacts)
      case 'FetchContactsFailed': return indicateFailure(model, message.failure)
      default: return { model: model, effect: { type: 'NoOp' } }
    }
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

  function startFetchContacts(model: Model): Change {
    return {
      model: model,
      effect: { type: 'FetchContacts', query: model.query },
    }
  }

  function saveFetched(model: Model, contacts: CiviContact[] | undefined): Change {
    return {
      model: {
        ...model,
        contacts: contacts,
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

  //-- Effects --//

  export type Effect = { type: 'NoOp' }
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
    CRM: {
      api4: (
        endpoint: string,
        method: string,
        options: { limit: number }
      ) => Promise<CiviContact[]>
    }
  }

  export const makeHandleEffect = (context: Context) =>
    (effect: Effect, dispatch: Dispatch) => {
      switch (effect.type) {
        case 'NoOp': /* No op */ break
        case 'FetchContacts':
          return fetchContacts(context, effect.query, dispatch)
        case 'Log': return log(effect.message)
      }
    }

  function log(message: string) {
    const date = new Date().toISOString()
    console.log(`[${date}] ${message}`)
  }

  function fetchContacts(context: Context, query: string, dispatch: Dispatch) {
    dispatch({ type: 'FetchContactsStarted' })
    console.log(`TODO: Fetch according to query: ${query}`)
    context.CRM
      .api4('Contact', 'get', { limit: 25 })
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
