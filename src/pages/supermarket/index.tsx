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
import { Select } from '@ui/main/forms/select/Select'
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
import { useState } from 'react'

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
   
   const [lowStockThreshold, setLowStockThreshold] = useState(50)
   
   const { mutate: createSupermarket, isLoading: isMutating } = api.supermarket.create.useMutation({
      onSuccess: () => {
         router.reload()
      },
   })
   
   const statsQuery = api.supermarket.getStats.useQuery({ supermarketId: supermarket?.id }, { enabled: !!supermarket })
   const lowStockQuery = api.inventory.getLowStockItem.useQuery({ supermarketId: supermarket?.id!, threshold: lowStockThreshold }, { enabled: !!supermarket })
   
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
            <div className="space-y-8">
               {statsQuery.isLoading && <LoadingSpinner />}
               {!statsQuery.isLoading && <ShowOnly when={!isEmpty}>
                   <div>
                       <h2 className="text-center w-full text-lg text-gray-500">Your supermarket</h2>
                       <h2 className="text-center w-full text-3xl font-medium mb-8">{supermarket?.name}</h2>
                   </div>
                   <dl className="text-center sm:mx-auto sm:grid sm:max-w-3xl sm:grid-cols-4 sm:gap-8">
                       <div className="flex flex-col">
                           <dt className="order-2 mt-2 text-lg font-medium leading-6 text-brand-500">Products</dt>
                           <dd className="order-1 text-5xl font-bold tracking-tight">{statsQuery.data?.productCount ?? "0"}</dd>
                       </div>
                       <div className="mt-10 flex flex-col sm:mt-0">
                           <dt className="order-2 mt-2 text-lg font-medium leading-6 text-brand-500">Suppliers</dt>
                           <dd className="order-1 text-5xl font-bold tracking-tight">{statsQuery.data?.supplierCount ?? "0"}</dd>
                       </div>
                       <div className="mt-10 flex flex-col sm:mt-0">
                           <dt className="order-2 mt-2 text-lg font-medium leading-6 text-brand-500">Sales</dt>
                           <dd className="order-1 text-5xl font-bold tracking-tight">{statsQuery.data?.saleCount ?? "0"}</dd>
                       </div>
                       <div className="mt-10 flex flex-col sm:mt-0">
                           <dt className="order-2 mt-2 text-lg font-medium leading-6 text-brand-500">Revenue</dt>
                           <dd className="order-1 text-5xl font-bold tracking-tight">{statsQuery.data?.revenue === 0
                              ? '$0'
                              : priceFormatter.toFormat(statsQuery.data?.revenue ?? 0)}</dd>
                       </div>
                   </dl>
               </ShowOnly>}
               
               <div className="space-y-4">
                  <h2 className="text-center font-semibold text-2xl">Items low in stock</h2>
                  {/*<DebugData data={lowStockQuery.data} />*/}
                  <Select
                     label="Threshold"
                     leftAddon="Quantity"
                     options={[{ value: 500 }, { value: 400 }, { value: 300 }, { value: 200 }, { value: 100 }, { value: 50 }]}
                     value={lowStockThreshold}
                     onChange={e => setLowStockThreshold(parseInt(e.target.value))}
                  />
                  <ShowOnly when={!lowStockQuery.isLoading}>
                     <div className="divide-y border rounded-md">
                        {lowStockQuery.data?.map(lsq => {
                           return (
                              <div key={lsq.itemName + lsq.supplierName} className="p-2 flex justify-between">
                                 <span className="text-lg"><span className="font-bold">{lsq.itemName}</span> (Quantity left: <span className="font-semibold text-red-500">{lsq.itemQuantity}</span>)</span>
                                 <span className="text-md">{lsq.supplierName} <span className="italic text-gray-500">({lsq.supplierEmail})</span></span>
                              </div>
                           )
                        })}
                     </div>
                  </ShowOnly>
                  <ShowOnly when={lowStockQuery.isLoading}>
                     <LoadingSpinner />
                  </ShowOnly>
               </div>
            </div>
         
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
