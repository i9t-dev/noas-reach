import React from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom/client'

//-- Model --//

type AppModel = {
  name: string,
  query: string,
  contacts: Array<CiviContact> | undefined
}

const initialModel: AppModel = {
  name: "Noah's Reach",
  query: "",
  contacts: undefined,
}

//-- View --//

type Dispatch = (event: AppMessage) => void

function view(
  model: AppModel,
  dispatch: Dispatch,
) {
  return <div className="noas-reach">
    <h2>Hello, this is {model.name}!</h2>
    <fieldset>
      <legend>Find contacts</legend>
      <p>
        <label>Query</label>
        <input type="text"
          autoFocus
          value={model.query}
          onChange={
            (event) => {
              dispatch({ type: 'QueryChanged', query: event.target.value })
            }
          }></input>
      </p>
      <p>
        <button
          onClick={
            () => {
              dispatch({ type: 'SearchClicked' })
            }
          }>
          Search
        </button>
      </p>
    </fieldset>
    <fieldset>
      <legend>Results</legend>
      <ul>{
        model.contacts
          ? model.contacts.map(
            (c, i) => (
              <li key={i}>{c.display_name}</li>
            )
          )
          : "No result"
      }</ul>
    </fieldset>
  </div>
}

//-- Update --//

type AppMessage =
  | { type: 'QueryChanged', query: string }
  | { type: 'SearchClicked' }
  | { type: 'FetchingContacts' }
  | { type: 'FetchedContacts', contacts: CiviContact[] | undefined }
  | { type: 'FetchContactsFailed', failure: Error }

type AppChange = {
  model: AppModel,
  effect: AppEffect,
}

function update(model: AppModel, message: AppMessage): AppChange {
  switch (message.type) {
    case 'QueryChanged': return handleSaveQuery(model, message.query)
    case 'SearchClicked': return handleFetchContacts(model)
    case 'FetchingContacts': return handleFetchingContacts(model)
    case 'FetchedContacts':
      return handleFetchedContacts(model, message.contacts)
    case 'FetchContactsFailed':
      return handleFetchContactsFailed(model, message.failure)
    default: return {
      model: model,
      effect: { type: 'NoOp' },
    }
  }
}

function handleSaveQuery(model: AppModel, query: string): AppChange {
  return {
    model: {
      ...model,
      query: query
    },
    effect: { type: 'NoOp' },
  }
}

function handleFetchingContacts(model: AppModel): AppChange {
  return {
    model: model,
    effect: {
      type: 'Log',
      message: `Fetching contacts matching query: ${model.query}`,
    },
  }
}

function handleFetchContacts(model: AppModel): AppChange {
  return {
    model: model,
    effect: { type: 'FetchContacts', query: model.query },
  }
}

function handleFetchedContacts(model: AppModel, contacts: CiviContact[] | undefined): AppChange {
  return {
    model: {
      ...model,
      contacts: contacts,
    },
    effect: { type: 'NoOp' },
  }
}

function handleFetchContactsFailed(model: AppModel, failure: Error): AppChange {
  return {
    model: model,
    effect: { type: 'Log', message: `Failed fetching contacts: ${failure}` },
  }
}

//-- Effects --//

type AppEffect =
  | { type: 'NoOp' }
  | { type: 'Log', message: string }
  | { type: 'FetchContacts', query: string }

interface CiviContact {
  contact_type: string,
  display_name: string,
  first_name: string | undefined,
  last_name: string | undefined,
  organization_name: string | undefined,
  created_date: Date,
  modified_date: Date,
}

function handleEffect(effect: AppEffect, dispatch: Dispatch) {
  switch (effect.type) {
    case 'NoOp': /* No op */ break
    case 'FetchContacts': return fetchContacts(effect.query, dispatch)
    case 'Log': return log(effect.message)
  }
}

function log(message: string) {
  const date = new Date().toISOString()
  console.log(`[${date}] ${message}`)
}

function fetchContacts(query: string, dispatch: Dispatch) {
  dispatch({ type: 'FetchingContacts' })
  console.log(`TODO: Fetch according to query: ${query}`)
  window.CRM
    .api4('Contact', 'get', { limit: 25 })
    .then(
      (contacts: CiviContact[]) => {
        dispatch({ type: 'FetchedContacts', contacts: contacts })
      },
      (failure: Error) => {
        dispatch({ type: 'FetchContactsFailed', failure: failure })
      })
}

//-- Runtime --//

const App = () => {

  const [model, setModel] = useState<AppModel>(initialModel)

  function dispatch(message: AppMessage) {
    const change = update(model, message)
    if (model != change.model) {
      setModel(change.model)
    }
    handleEffect(change.effect, dispatch)
  }

  return view(model, dispatch)
}

declare global {
  interface Window {
    initApp: (containerId: string) => void
    CRM: any
  }
}

// CiviCRM will call this when the script loads
window.initApp = (containerId: string) => {
  const container = document.getElementById(containerId)
  if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(<App />)
  }
}
