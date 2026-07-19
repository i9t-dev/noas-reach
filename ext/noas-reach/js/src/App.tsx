import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { useState } from 'react'

//-- Model ----------------------------------------------------------//

type AppModel = {
  query: string,
}

const initialModel = { query: "" }

//-- View -----------------------------------------------------------//

interface AppProps {
  name?: string
}

const App = ({ name = 'Noah\'s Reach' }) => {
  return (
    <div className="noas-reach">
      <h2>Hello, this is {name}!</h2>
      <fieldset>
        <legend>Find contacts</legend>
        <p>
          <label>Query</label>
          <input type="text" autoFocus
            onChange={dispatch(AppEvent.QueryChanged, {})}></input>
        </p>
        <p>
          <button onClick={dispatch(AppEvent.SearchClicked, {})}>Search</button>
        </p>
      </fieldset>
    </div>
  )
}

//-- Update ---------------------------------------------------------//

enum AppEvent {
  QueryChanged,
  SearchClicked,
}

enum AppEffect {
  NoOp,
}

type AppChange = {
  model: AppModel,
  effect: AppEffect,
}

type AppEventHandler = (model: AppModel, arg: any) => AppChange

const eventHandlers: Record<AppEvent, AppEventHandler> = {
  [AppEvent.QueryChanged]: (model, arg) => {
    return {
      model: {
        ...model,
        query: arg.query
      },
      effect: AppEffect.NoOp,
    }
  },
  [AppEvent.SearchClicked]: (model, _) => {
    console.log(`TODO: Launch search with query: ${model.query}`)
    return { model: model, effect: AppEffect.NoOp }
  },
}

//-- Runtime --------------------------------------------------------//

const [model, setModel] = useState<AppModel>(initialModel)

type AppEffectHandler = (effect: AppEffect, arg: any) => void

const effectHandlers: Record<AppEffect, AppEffectHandler> = {
  [AppEffect.NoOp]: (_effect, _arg) => {
    // No op
  }
}

function dispatch(event: AppEvent, eventArg: any): undefined {
  const handleEvent = eventHandlers[event]
  const change = handleEvent(model, eventArg)
  setModel(change.model)
  const handleEffect = effectHandlers[change.effect]
  handleEffect(change.effect, {})
}

declare global {
  interface Window {
    initApp: (containerId: string, props?: AppProps) => void
  }
}

// CiviCRM will call this when the script loads
window.initApp = (
  containerId: string,
  props: AppProps = {}
) => {
  const container = document.getElementById(containerId)
  if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(<App {...props} />)
  }
}