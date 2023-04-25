import { ProtectedPage } from '@/components/auth/ProtectedPage'
import { Layout } from '@/components/layout/Layout'
import { useDisclosure } from '@/hooks/use-disclosure'
import { useSupermarket } from '@/hooks/use-supermarket'
import { getServerAuthSession } from '@/server/auth'
import { Button } from '@ui/main/forms/button/Button'
import { createTypesafeFormSchema } from '@ui/main/forms/typesafe-form/CreateTypesafeFormSchema'
import { PageHeader } from '@ui/main/layout/page-header/PageHeader'
import { Modal } from '@ui/main/overlay/modal/Modal'
import { LoadingSpinner } from '@ui/shared/loading-spinner/LoadingSpinner'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

export const productSchema = createTypesafeFormSchema(({ z, presets }) => z.object({
   id: z.string().nullish(),
   code: z.string(),
   name: z.string(),
   description: z.string(),
   unit: z.string(),
   cost: z.number().min(0),
   quantityLeft: z.number().min(0),
   dateDelivered: z.date(),
   supplierId: z.string(),
   categoryId: z.string(),
   supermarketId: z.string(),
}))

const Page: NextPage = () => {
   const router = useRouter()
   
   const creationModal = useDisclosure(false)
   const { supermarket, isLoading, isEmpty } = useSupermarket()
   
   if (isLoading) return <LoadingSpinner />
   if (isEmpty) router.push('/supermarket')
   if (supermarket) {
      return (
         <ProtectedPage>
            <Layout>
               <PageHeader title="Products" action={<>
                  <Button onClick={creationModal.open}>Add a product</Button>
               </>} />
               Inventory
            </Layout>
            
            <Modal title="Add a product" isOpen={creationModal.isOpen} onClose={creationModal.close} size="xl" actions={[{ action: 'close' }]}>
               <AddProductForm />
            </Modal>
            
         </ProtectedPage>
      )
   }
   
   return null
}

interface AddProductFormProps {
   children?: React.ReactNode
}

export const AddProductForm: React.FC<AddProductFormProps> = (props) => {
   
   const { children, ...rest } = props
   
   return <>
    AddProductForm
   </>
   
}


export default Page

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const session = await getServerAuthSession(ctx)
   return {
      props: { session },
   }
}
