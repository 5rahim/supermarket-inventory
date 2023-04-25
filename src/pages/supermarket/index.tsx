import { ProtectedPage } from '@/components/auth/ProtectedPage'
import { Layout } from '@/components/layout/Layout'
import { useDisclosure } from '@/hooks/use-disclosure'
import { useSupermarket } from '@/hooks/use-supermarket'
import { getServerAuthSession } from '@/server/auth'
import { InferType } from '@/types'
import { api } from '@/utils/api'
import { BiCart } from '@react-icons/all-files/bi/BiCart'
import { Button } from '@ui/main/forms/button/Button'
import { createTypesafeFormSchema } from '@ui/main/forms/typesafe-form/CreateTypesafeFormSchema'
import { Field } from '@ui/main/forms/typesafe-form/Field'
import { TypesafeForm } from '@ui/main/forms/typesafe-form/TypesafeForm'
import { Modal } from '@ui/main/overlay/modal/Modal'
import { LoadingSpinner } from '@ui/shared/loading-spinner/LoadingSpinner'
import ShowOnly from '@ui/shared/show-only/ShowOnly'
import { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export const supermarketSchema = createTypesafeFormSchema(({ z, presets }) => z.object({
   name: presets.name,
}))
const Page: NextPage = ({ supermarkets }: any) => {
   const { data: session } = useSession()
   const router = useRouter()
   const { supermarket, isLoading, isEmpty } = useSupermarket()
   
   const { mutate: createSupermarket, isLoading: isMutating } = api.supermarket.create.useMutation({
      onSuccess: () => {
         router.reload()
      },
      onError: (e) => {
      
      },
   });
   
   const createModal = useDisclosure(false)
   
   if(isLoading) return <LoadingSpinner />
   
   
   return (
      <ProtectedPage>
         <Layout>
            <pre>
               {JSON.stringify(supermarkets, null, 2)}
            </pre>
            <ShowOnly when={isEmpty}>
               <div className="flex flex-col items-center w-full gap-2">
                  <p className="text-lg">No supermarket is associated with your account.</p>
                  <Button intent="primary-subtle" size="lg" leftIcon={<BiCart />} onClick={createModal.open}>Create a supermarket</Button>
               </div>
            </ShowOnly>
            <ShowOnly when={!!supermarket}>
               <dl className="text-center sm:mx-auto sm:grid sm:max-w-3xl sm:grid-cols-3 sm:gap-8">
                  <div className="flex flex-col">
                     <dt className="order-2 mt-2 text-lg font-medium leading-6 text-brand-500">Products</dt>
                     <dd className="order-1 text-5xl font-bold tracking-tight">0</dd>
                  </div>
                  <div className="mt-10 flex flex-col sm:mt-0">
                     <dt className="order-2 mt-2 text-lg font-medium leading-6 text-brand-500">Pending orders</dt>
                     <dd className="order-1 text-5xl font-bold tracking-tight">0</dd>
                  </div>
                  <div className="mt-10 flex flex-col sm:mt-0">
                     <dt className="order-2 mt-2 text-lg font-medium leading-6 text-brand-500">Revenue</dt>
                     <dd className="order-1 text-5xl font-bold tracking-tight">$0</dd>
                  </div>
               </dl>
            </ShowOnly>
         </Layout>
         
         <Modal isOpen={createModal.isOpen} onClose={createModal.close} size="lg">
            <TypesafeForm<InferType<typeof supermarketSchema>>
               schema={supermarketSchema}
               onSubmit={data => {
                  createSupermarket({
                     name: data.name
                  })
               }}
            >
               <Field.Text name="name" label="Supermarket name" />
               <Field.Submit role="create" />
            </TypesafeForm>
         </Modal>
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
