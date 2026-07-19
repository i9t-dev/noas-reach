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

type AppEventHandler = (model: AppModel, args: any) => AppModel

const handlers: Record<AppEvent, AppEventHandler> = {
  [AppEvent.QueryChanged]: (model, args) => {
    return {
      ...model,
      query: args.query
    }
  },
  [AppEvent.SearchClicked]: (model, _) => {
    console.log(`TODO: Launch search with query: ${model.query}`)
    return model
  },
}

//-- Runtime --------------------------------------------------------//

const [model, setModel] = useState<AppModel>(initialModel)

useEffect(() => {
  // TODO: Implement effects
}, [model])

function dispatch(event: AppEvent, args: any): undefined {
  const handleEvent = handlers[event]
  const newModel = handleEvent(model, args)
  setModel(newModel)
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