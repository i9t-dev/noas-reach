import React from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom/client'

//-- Model --//

type AppModel = {
  name: string,
  query: string,
}

const initialModel = {
  name: "Noah's Reach",
  query: "",
}

//-- View --//

function view(
  model: AppModel,
  dispatch: (
    event: AppEvent,
    eventArg?: AppEventArg,
  ) => undefined,
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
              dispatch(AppEvent.QueryChanged, event.target.value)
            }
          }></input>
      </p>
      <p>
        <button
          onClick={
            () => {
              dispatch(AppEvent.SearchClicked)
            }
          }>
          Search
        </button>
      </p>
    </fieldset>
  </div>
}

//-- Update --//

enum AppEvent {
  QueryChanged,
  SearchClicked,
}

type AppEventArg =
  | undefined
  | string

const eventHandlers: Record<AppEvent, AppEventHandler> = {
  [AppEvent.QueryChanged]: (model, arg): AppChange => {
    return {
      model: {
        ...model,
        query: arg as string
      },
      effect: noOp(),
    }
  },
  [AppEvent.SearchClicked]: (model, _arg): AppChange => {
    return {
      model: model,
      effect: [
        AppEffect.FetchContacts,
        model.query,
      ]
    }
  },
}

//-- Effects --//

enum AppEffect {
  NoOp,
  Log,
  FetchContacts,
}

type AppEffectArg =
  | undefined
  | string
  | { query: string }

function noOp(): [AppEffect, AppEffectArg] {
  return [AppEffect.NoOp, undefined]
}

type AppEffectHandler = (arg: AppEffectArg) => void

interface CiviContact {
  contact_type: string,
  display_name: string,
  first_name: string | undefined,
  last_name: string | undefined,
  organization_name: string | undefined,
  created_date: Date,
  modified_date: Date,
}

const effectHandlers: Record<AppEffect, AppEffectHandler> = {
  [AppEffect.NoOp]: (_arg) => {
    // No op
  },
  [AppEffect.Log]: (arg) => {
    const logArg = arg as string
    const date = new Date().toISOString()
    console.log(`[${date}] ${logArg}`)
  },
  [AppEffect.FetchContacts]: (arg) => {
    const query = arg as string
    console.log(`TODO: Launch search with query: ${query}`)
    window.CRM.api4('Contact', 'get', {
      limit: 25
    }).then((contacts: Array<CiviContact>) => {
      console.log(
        `Fetched contacts: ${contacts.map(
          (c) => {
            return `Contact(display_name: ${c.display_name}, contact_type: ${c.contact_type}, first_name: ${c.first_name}, last_name: ${c.last_name}, organization_name: ${c.organization_name}, created_date: ${c.created_date}, modified_date: ${c.modified_date})`
          }
        ).join(', ')}`)
    }, (failure: any) => {
      console.log(`Got error: ${failure}`)
    });
  }
}

//-- Runtime --//

type AppChange = {
  model: AppModel,
  effect: [AppEffect, AppEffectArg],
}

type AppEventHandler = (model: AppModel, arg: AppEventArg) => AppChange

const App = () => {

  const [model, setModel] = useState<AppModel>(initialModel)

  function dispatch(event: AppEvent, eventArg: any): undefined {
    const handleEvent = eventHandlers[event]
    const change = handleEvent(model, eventArg)
    if (model != change.model) {
      setModel(change.model)
    }
    const [effect, effectArg] = change.effect
    const handleEffect = effectHandlers[effect]
    handleEffect(effectArg)
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