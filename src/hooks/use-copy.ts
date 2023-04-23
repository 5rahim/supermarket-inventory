import { useState } from 'react'

function useCopy({ timeout = 2000 } = {}) {
   const [error, setError] = useState<Error | null>(null)
   const [copied, setCopied] = useState(false)
   const [copyTimeout, setCopyTimeout] = useState<NodeJS.Timeout | null>(null)
   
   const handleCopyResult = (value: boolean) => {
      clearTimeout(copyTimeout as NodeJS.Timeout)
      setCopyTimeout(setTimeout(() => setCopied(false), timeout))
      setCopied(value)
   }
   
   const copy = (valueToCopy: any) => {
      if ('clipboard' in navigator) {
         navigator.clipboard
                  .writeText(valueToCopy)
                  .then(() => handleCopyResult(true))
                  .catch((err) => setError(err))
      } else {
         setError(new Error('useCopy: navigator.clipboard is not supported'))
      }
   }
   
   const reset = () => {
      setCopied(false)
      setError(null)
      clearTimeout(copyTimeout as NodeJS.Timeout)
   }
   
   return { copy, reset, error, copied }
}

export default useCopy
