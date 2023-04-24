import { ProtectedPage } from '@/components/auth/ProtectedPage'
import { Layout } from '@/components/layout/Layout'
import { useSupermarket } from '@/hooks/use-supermarket'
import { getServerAuthSession } from '@/server/auth'
import { LoadingSpinner } from '@ui/shared/loading-spinner/LoadingSpinner'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'

const Page: NextPage = () => {
   const router = useRouter()
   
   const { supermarket, isLoading, isEmpty } = useSupermarket()
   
   if (isLoading) return <LoadingSpinner />
   if (isEmpty) router.push('/supermarket')
   
   if (supermarket) {
      return (
         <ProtectedPage>
            <Layout>
               Inventory
            </Layout>
         </ProtectedPage>
      )
   }
   
   return null
}
export default Page

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const session = await getServerAuthSession(ctx)
   return {
      props: { session },
   }
}
