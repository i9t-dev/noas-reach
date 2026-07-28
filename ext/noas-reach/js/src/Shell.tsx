import React, { Dispatch } from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Core } from './Core'
import { CiviContact, Command, Operation } from './Command'

//-- Runtime --//

declare global {
  interface Window {
    initApp: (containerId: string) => void
    CRM: {
      api4: (
        endpoint: string,
        method: string,
        options: {
          limit: number,
          where: [[
            fieldName: string,
            operator: string,
            fieldValue: string
          ]]
        }
      ) => Promise<CiviContact[]>
    }
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
    execute(change.command, dispatch)
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

function execute(command: Command, dispatch: Core.Dispatch) {
  switch (command.op) {
    case Operation.NoOp: /* No op */ break
    case Operation.FetchContacts: return fetchContacts(command.query, dispatch)
    case Operation.Log: return log(command.message)
  }
}

function log(message: string) {
  const date = new Date().toISOString()
  console.log(`[${date}] ${message}`)
}

function fetchContacts(query: string, dispatch: Core.Dispatch) {
  dispatch({ ev: Core.Event.FetchContactsStarted })
  console.log(`Calling fetch-contact API for query: ${query}`)
  window.CRM
    .api4(
      'Contact',
      'get',
      { limit: 25, where: [["display_name", "CONTAINS", query]], }
    )
    .then(
      (remoteContacts: CiviContact[]) => {
        dispatch({ ev: Core.Event.FetchedContacts, contacts: remoteContacts })
      },
      (failure: Error) => {
        dispatch({ ev: Core.Event.FetchContactsFailed, failure: failure })
      },
    )
}