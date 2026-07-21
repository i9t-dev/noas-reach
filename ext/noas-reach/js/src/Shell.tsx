import React from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

//-- Runtime --//

const Shell = () => {

  const [model, setModel] = useState<App.Model>(App.initialModel)

  function dispatch(message: App.Message) {
    const change = App.update(model, message)
    if (model != change.model) {
      setModel(change.model)
    }
    const handleEffect = App.makeHandleEffect(window)
    handleEffect(change.effect, dispatch)
  }

  return App.view(model, dispatch)
}

// CiviCRM will call this when the script loads
window.initApp = (containerId: string) => {
  const container = document.getElementById(containerId)
  if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(<Shell />)
  }
}
