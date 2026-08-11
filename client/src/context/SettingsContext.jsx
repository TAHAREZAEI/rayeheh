import { createContext, useContext, useEffect, useState } from 'react'
import { miscApi } from '../lib/api'

const SettingsContext = createContext({})

export function SettingsProvider({ children }) {
  const [shipping, setShipping] = useState({
    teheranFee: 45000,
    cityFee: 65000,
    teheranFreeAbove: 2000000,
    cityFreeAbove: 2500000,
    codEnabled: true,
  })

  useEffect(() => {
    miscApi
      .shipping()
      .then(({ data }) => setShipping(data.shipping))
      .catch(() => {})
  }, [])

  return (
    <SettingsContext.Provider value={{ shipping }}>{children}</SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
