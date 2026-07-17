import React from 'react'
import ReactDOM from 'react-dom/client'

interface HelloWorldProps {
  name?: string
}

const HelloWorld: React.FC<HelloWorldProps> = ({ name = 'World' }) => {
  return (
    <div className="noas-reach-hello-world">
      <h2>Hello, {name}!</h2>
      <p>This is a React component from the noas-reach extension.</p>
    </div>
  )
}

declare global {
  interface Window {
    initHelloWorld: (containerId: string, props?: HelloWorldProps) => void
  }
}

// CiviCRM will call this when the script loads
window.initHelloWorld = (
  containerId: string,
  props: HelloWorldProps = {}
) => {
  const container = document.getElementById(containerId)
  if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(<HelloWorld {...props} />)
  }
}