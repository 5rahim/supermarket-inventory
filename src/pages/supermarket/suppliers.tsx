import { ProtectedPage } from '@/components/auth/ProtectedPage'
import DebugData from '@/components/DebugData'
import { Layout } from '@/components/layout/Layout'
import { useDisclosure } from '@/hooks/use-disclosure'
import { useSupermarket } from '@/hooks/use-supermarket'
import { getServerAuthSession } from '@/server/auth'
import { InferType } from '@/types'
import { api } from '@/utils/api'
import { Button } from '@ui/main/forms/button/Button'
import { createTypesafeFormSchema } from '@ui/main/forms/typesafe-form/CreateTypesafeFormSchema'
import { Field } from '@ui/main/forms/typesafe-form/Field'
import { TypesafeForm } from '@ui/main/forms/typesafe-form/TypesafeForm'
import { PageHeader } from '@ui/main/layout/page-header/PageHeader'
import { Modal } from '@ui/main/overlay/modal/Modal'
import { LoadingSpinner } from '@ui/shared/loading-spinner/LoadingSpinner'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { v4 } from 'uuid'

export const supplierSchema = createTypesafeFormSchema(({ z, presets }) => z.object({
   id: z.string().nullish(),
   name: z.string(),
   email: z.string(),
   supermarketId: z.string(),
}))

const Page: NextPage = () => {
   const router = useRouter()
   
   const creationModal = useDisclosure(false)
   const { supermarket, isLoading, isEmpty } = useSupermarket()
   const supplierQuery = api.supplier.getAll.useQuery({ supermarketId: supermarket?.id }, { enabled: !!supermarket })
   
   if (isLoading) return <LoadingSpinner />
   if (isEmpty) router.push('/supermarket')
   if (supermarket) {
      return (
         <ProtectedPage>
            <Layout>
               <PageHeader
                  title="Suppliers" action={<>
                  <Button onClick={creationModal.open}>Add a supplier</Button>
               </>}
               />
               {/*<DataGrid<TableOrders>*/}
               {/*   columns={columns}*/}
               {/*   data={data}*/}
               {/*   dataCount={data?.length ?? 0}*/}
               {/*   isLoading={isLoading}*/}
               {/*   isFetching={false}*/}
               {/*   itemsPerPage={15}*/}
               {/*   hideColumns={[*/}
               {/*      { below: 600, hide: ['total'] },*/}
               {/*      { below: 500, hide: ['created_at'] },*/}
               {/*      { below: 400, hide: ['table_id'] },*/}
               {/*   ]}*/}
               {/*   enableRowSelection={false}*/}
               {/*   onItemSelected={data => {*/}
               {/*      console.log(data)*/}
               {/*   }}*/}
               {/*/>*/}
               <DebugData data={supplierQuery.data} />
            </Layout>
            
            <Modal title="Add a supplier" isOpen={creationModal.isOpen} onClose={creationModal.close} size="xl" actions={[{ action: 'close' }]}>
               <AddSupplierForm supermarketId={supermarket.id} />
            </Modal>
         
         </ProtectedPage>
      )
   }
   
   return null
}

interface AddSupplierFormProps {
   children?: React.ReactNode
   supermarketId: string
}

export const AddSupplierForm: React.FC<AddSupplierFormProps> = (props) => {
   
   const { children, supermarketId, ...rest } = props
   const router = useRouter()
   
   const create = api.supplier.create.useMutation({
      onSuccess: data => {
         router.reload()
      },
   })
   
   return <>
      <TypesafeForm<InferType<typeof supplierSchema>>
         schema={supplierSchema}
         defaultValues={{
            id: v4(),
            supermarketId: supermarketId,
         }}
         onSubmit={data => {
            create.mutate(data)
         }}
      >
         <Field.Text name="id" hidden />
         <Field.Text name="supermarketId" hidden />
         <Field.Text name="name" label="Supplier name" />
         <Field.Text name="email" label="Supplier email" />
         <Field.Submit role="create" />
      </TypesafeForm>
   </>
   
}


export default Page

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const session = await getServerAuthSession(ctx)
   return {
      props: { session },
   }
}
