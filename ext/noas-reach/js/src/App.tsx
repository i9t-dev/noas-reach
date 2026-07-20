import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { useState } from 'react'

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
    eventEvent: AppEvent,
    eventArgs: any,
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
              dispatch(AppEvent.SearchClicked, {})
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

const eventHandlers: Record<AppEvent, AppEventHandler> = {
  [AppEvent.QueryChanged]: (model, arg) => {
    return {
      model: {
        ...model,
        query: arg
      },
      effect: noOp(),
    }
  },
  [AppEvent.SearchClicked]: (model, _arg) => {
    return {
      model: model,
      effect: [AppEffect.Log, `TODO: Launch search with query: ${model.query}`]
    }
  },
}

//-- Effects --//

enum AppEffect {
  NoOp,
  Log,
}

function noOp(): [AppEffect, any] {
  return [AppEffect.NoOp, undefined]
}

type AppEffectHandler = (arg: any) => void

const effectHandlers: Record<AppEffect, AppEffectHandler> = {
  [AppEffect.NoOp]: (_arg) => {
    // No op
  },
  [AppEffect.Log]: (arg) => {
    console.log(`${arg}`)
  }
}

//-- Runtime --//

type AppChange = {
  model: AppModel,
  effect: [AppEffect, any],
}

type AppEventHandler = (model: AppModel, arg: any) => AppChange

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