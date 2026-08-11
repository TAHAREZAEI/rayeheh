import { createContext, useContext, useState } from 'react'

const UiContext = createContext(null)

export function UiProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <UiContext.Provider
      value={{
        cartOpen,
        setCartOpen,
        searchOpen,
        setSearchOpen,
        mobileMenuOpen,
        setMobileMenuOpen,
      }}
    >
      {children}
    </UiContext.Provider>
  )
}

export const useUi = () => {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useUi باید داخل UiProvider استفاده شود')
  return ctx
}
