import { useSession } from 'next-auth/react'
import React from 'react'

interface ProtectedPageProps {
   children?: React.ReactNode
}

export const ProtectedPage: React.FC<ProtectedPageProps> = (props) => {
   
   const { children, ...rest } = props
   const { data: session } = useSession()
   
   
   if (session) return (
      <>
         {children}
      </>
   )
   
   return <p>Access denied</p>
   
}
