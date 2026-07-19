import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { useState } from 'react'

//-- Model --//

type AppModel = {
  query: string,
}

const initialModel = { query: "" }

//-- View --//

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
            onChange={dispatch(AppEvent.QueryChanged, "TBD")}></input>
        </p>
        <p>
          <button onClick={dispatch(AppEvent.SearchClicked, {})}>Search</button>
        </p>
      </fieldset>
    </div>
  )
}

//-- Update --//

enum AppEvent {
  QueryChanged,
  SearchClicked,
}

enum AppEffect {
  NoOp,
}

type AppChange = {
  model: AppModel,
  effect: [AppEffect, any],
}

type AppEventHandler = (model: AppModel, arg: any) => AppChange

const eventHandlers: Record<AppEvent, AppEventHandler> = {
  [AppEvent.QueryChanged]: (model, arg) => {
    return {
      model: {
        ...model,
        query: arg
      },
      effect: [AppEffect.NoOp, undefined],
    }
  },
  [AppEvent.SearchClicked]: (model, _arg) => {
    console.log(`TODO: Launch search with query: ${model.query}`)
    return {
      model: model,
      effect: [AppEffect.NoOp, undefined]
    }
  },
}

//-- Effects --//

type AppEffectHandler = (effect: AppEffect, arg: any) => void

const effectHandlers: Record<AppEffect, AppEffectHandler> = {
  [AppEffect.NoOp]: (_effect, _arg) => {
    // No op
  }
}

//-- Runtime --//

const [model, setModel] = useState<AppModel>(initialModel)

function dispatch(event: AppEvent, eventArg: any): undefined {
  const handleEvent = eventHandlers[event]
  const change = handleEvent(model, eventArg)
  setModel(change.model)
  const [effect, effectArg] = change.effect
  const handleEffect = effectHandlers[effect]
  handleEffect(effect, effectArg)
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