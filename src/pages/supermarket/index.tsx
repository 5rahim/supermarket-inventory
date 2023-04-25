import { ProtectedPage } from '@/components/auth/ProtectedPage'
import { Layout } from '@/components/layout/Layout'
import { useDisclosure } from '@/hooks/use-disclosure'
import { usePriceFormatter } from '@/hooks/use-price-formatter'
import { useSupermarket } from '@/hooks/use-supermarket'
import { getServerAuthSession } from '@/server/auth'
import { InferType } from '@/types'
import { api } from '@/utils/api'
import { BiCart } from '@react-icons/all-files/bi/BiCart'
import { Button } from '@ui/main/forms/button/Button'
import { createTypesafeFormSchema } from '@ui/main/forms/typesafe-form/CreateTypesafeFormSchema'
import { Field } from '@ui/main/forms/typesafe-form/Field'
import { TypesafeForm } from '@ui/main/forms/typesafe-form/TypesafeForm'
import { PageHeader } from '@ui/main/layout/page-header/PageHeader'
import { Modal } from '@ui/main/overlay/modal/Modal'
import { LoadingSpinner } from '@ui/shared/loading-spinner/LoadingSpinner'
import ShowOnly from '@ui/shared/show-only/ShowOnly'
import { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const replacer = (key: any, value: any) =>
   typeof value === "bigint" ? Number(value.toString()) : value

export const supermarketSchema = createTypesafeFormSchema(({ z, presets }) => z.object({
   name: presets.name,
}))
const Page: NextPage = ({ supermarkets }: any) => {
   const { data: session } = useSession()
   const router = useRouter()
   const { supermarket, isLoading, isEmpty } = useSupermarket()
   const priceFormatter = usePriceFormatter()
   
   const { mutate: createSupermarket, isLoading: isMutating } = api.supermarket.create.useMutation({
      onSuccess: () => {
         router.reload()
      },
   })
   
   const statsQuery = api.supermarket.getStats.useQuery({ supermarketId: supermarket?.id }, { enabled: !!supermarket })
   
   const createModal = useDisclosure(false)
   
   if (isLoading) return <LoadingSpinner />
   
   
   return (
      <ProtectedPage>
         <Layout header={<PageHeader title={supermarket?.name ?? ""} />}>
            <ShowOnly when={isEmpty}>
               <div className="flex flex-col items-center w-full gap-2">
                  <p className="text-lg">No supermarket is associated with your account.</p>
                  <Button intent="primary-subtle" size="lg" leftIcon={<BiCart />} onClick={createModal.open}>Create a supermarket</Button>
               </div>
            </ShowOnly>
            <ShowOnly when={!isEmpty}>
               <h2 className="text-center w-full text-lg text-gray-500">Your supermarket</h2>
               <h2 className="text-center w-full text-3xl font-medium mb-8">{supermarket?.name}</h2>
               <dl className="text-center sm:mx-auto sm:grid sm:max-w-3xl sm:grid-cols-3 sm:gap-8">
                  <div className="flex flex-col">
                     <dt className="order-2 mt-2 text-lg font-medium leading-6 text-brand-500">Products</dt>
                     <dd className="order-1 text-5xl font-bold tracking-tight">{statsQuery.data?.productCount ?? "0"}</dd>
                  </div>
                  <div className="mt-10 flex flex-col sm:mt-0">
                     <dt className="order-2 mt-2 text-lg font-medium leading-6 text-brand-500">Pending orders</dt>
                     <dd className="order-1 text-5xl font-bold tracking-tight">{statsQuery.data?.orderCount ?? "0"}</dd>
                  </div>
                  <div className="mt-10 flex flex-col sm:mt-0">
                     <dt className="order-2 mt-2 text-lg font-medium leading-6 text-brand-500">Revenue</dt>
                     <dd className="order-1 text-5xl font-bold tracking-tight">${priceFormatter.toFormat(statsQuery.data?.revenue ?? 0)}</dd>
                  </div>
               </dl>
            </ShowOnly>
         </Layout>
         
         <Modal isOpen={createModal.isOpen} onClose={createModal.close} size="lg">
            <TypesafeForm<InferType<typeof supermarketSchema>>
               schema={supermarketSchema}
               onSubmit={data => {
                  createSupermarket({
                     name: data.name,
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
