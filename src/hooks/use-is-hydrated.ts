import React from 'react'

export const useIsHydrated = () => {
   const [hydrated, setHydrated] = React.useState(false)
   React.useEffect(() => {
      // This forces a rerender, so the component is rendered the second time but not the first
      setHydrated(true)
   }, [])
   return hydrated
}
