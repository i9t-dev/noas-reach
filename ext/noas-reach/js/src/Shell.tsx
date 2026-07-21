import React from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Core } from './Core'

//-- Runtime --//

declare global {
  interface Window extends Core.Context {
    initApp: (containerId: string) => void
  }
}

const Shell = () => {

  const [model, setModel] = useState<Core.Model>(Core.initialModel)

  function dispatch(message: Core.Message) {
    const change = Core.update(model, message)
    if (model != change.model) {
      setModel(change.model)
    }
    const handleEffect = Core.makeHandleEffect(window)
    handleEffect(change.effect, dispatch)
  }

  return Core.view(model, dispatch)
}

// CiviCRM will call this when the script loads
window.initApp = (containerId: string) => {
  const container = document.getElementById(containerId)
  if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(<Shell />)
  }
}

