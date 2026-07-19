import React from 'react'
import ReactDOM from 'react-dom/client'

interface AppProps {
  name?: string
}

// TODO: Rename to `App`
// TODO: Subcomponents
const App: React.FC<AppProps> = ({ name = 'Noah\'s Reach' }) => {
  return (
    <div className="noas-reach">
      <h2>Hello, this is {name}!</h2>
    </div>
  )
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