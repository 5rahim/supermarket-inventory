import { cn } from '@/lib/tailwind/tailwind-utils'
import { LoadingSpinner } from '@ui/shared/loading-spinner/LoadingSpinner'
import React from 'react'

interface LoadingScreenProps {
   children?: React.ReactNode
   show: boolean
}

const LoadingScreen: React.FC<LoadingScreenProps & React.ComponentPropsWithoutRef<'div'>> = (props) => {
   
   const { children, show, className, ...rest } = props
   
   if (!show) return null
   
   return (
      <>
         <div className={cn("fixed bg-white bg-opacity-70 w-full h-full z-10 inset-0 pt-4 flex items-center justify-center", className)} {...rest}>
            <LoadingSpinner className="justify-auto" />
         </div>
      </>
   )
   
}

export default LoadingScreen
