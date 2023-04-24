import { ProtectedPage } from '@/components/auth/ProtectedPage'
import { Layout } from '@/components/layout/Layout'
import { getServerAuthSession } from '@/server/auth'
import { api } from '@/utils/api'
import { Button } from '@ui/main/forms/button/Button'
import { LoadingSpinner } from '@ui/shared/loading-spinner/LoadingSpinner'
import { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'

const Page: NextPage = () => {
   const { data: session } = useSession()
   const { data: supermarket, status } = api.supermarket.getUserSupermarket.useQuery({ userId: session?.user.id })
   
   if(status === 'loading') return <LoadingSpinner />
   
   return (
      <ProtectedPage>
         <Layout>
            {!supermarket && <Button>Create a supermarket</Button>}
         </Layout>
      </ProtectedPage>
   )
}
export default Page

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const session = await getServerAuthSession(ctx)
   
   return {
      props: { session },
   }
}
