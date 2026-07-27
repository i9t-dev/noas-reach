import React, { useMemo } from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Core } from './Core'

//-- Runtime --//

declare global {
  interface Window extends Core.Effect.Context {
    initApp: (containerId: string) => void
    CRM: any
  }
}

const Shell = () => {

  const [change, setChange] = useState<Core.Change>(Core.initialChange)
  const model = useMemo(() => change.model, [change.model])

  function dispatch(message: Core.Message) {
    const nextChange = Core.Update.of(model, message)
    console.log(`Next change: ${JSON.stringify(nextChange, undefined, 2)}`)
    setChange(nextChange)
    const handleEffect = Core.Effect.handler(window, dispatch)
    handleEffect(nextChange.command)
  }

  return Core.View.of(model, dispatch)
}

window.log = console.log
window.api = window.CRM.api4

// CiviCRM will call this when the script loads
window.initApp = (containerId: string) => {
  const container = document.getElementById(containerId)
  if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(<Shell />)
  }
}

