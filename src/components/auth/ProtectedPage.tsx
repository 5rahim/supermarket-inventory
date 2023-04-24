import { Layout } from '@/components/layout/Layout'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'

interface ProtectedPageProps {
   children?: React.ReactNode
}

export const ProtectedPage: React.FC<ProtectedPageProps> = (props) => {
   
   const { children, ...rest } = props
   const { data: session } = useSession()
   const router = useRouter()
   
   
   if(session) return (
      <Layout>
         {JSON.stringify(session)}
         {children}
      </Layout>
   )
   
   return <p>Access denied</p>
   
}
