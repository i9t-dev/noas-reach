import React from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Core } from './Core'
import { execute } from './Effect'

//-- Runtime --//

declare global {
  interface Window {
    initApp: (containerId: string) => void,
    CRM: any,
  }
}

const Shell = () => {

  const [model, setModel] = useState<Core.Model>(Core.initialModel)

  function dispatch(message: Core.Message) {
    console.log(`Dispatching message: ${JSON.stringify(message)}`)
    const change: Core.Change = Core.Update.of(model, message)
    if (model != change.model) {
      console.log(`Setting model to ${JSON.stringify(change.model)}`)
      setModel(change.model)
    }
    const context = { log: console.log, CRM: window.CRM }
    execute(context, change.command, dispatch)
  }

  return Core.View.of(model, dispatch)
}

// CiviCRM will call this when the script loads
window.initApp = (containerId: string) => {
  const container = document.getElementById(containerId)
  if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(<Shell />)
  }
}

