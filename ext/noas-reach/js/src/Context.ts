declare global {
  interface Window {
    initApp: (containerId: string) => void
    CRM: any
  }
}

export type Context = Window
