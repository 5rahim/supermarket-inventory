import { ProtectedPage } from '@/components/auth/ProtectedPage'
import { getServerAuthSession } from '@/server/auth'
import { GetServerSideProps, NextPage } from 'next'

const Page: NextPage = () => {
   
   return (
      <ProtectedPage>
         New supermarket
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
