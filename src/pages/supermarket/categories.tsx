import { ProtectedPage } from '@/components/auth/ProtectedPage'
import { Layout } from '@/components/layout/Layout'
import { useDisclosure } from '@/hooks/use-disclosure'
import { useSupermarket } from '@/hooks/use-supermarket'
import { getServerAuthSession } from '@/server/auth'
import { InferType } from '@/types'
import { api } from '@/utils/api'
import { Category } from '@prisma/client'
import { BiEditAlt } from '@react-icons/all-files/bi/BiEditAlt'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@ui/main/forms/button/Button'
import { createTypesafeFormSchema } from '@ui/main/forms/typesafe-form/CreateTypesafeFormSchema'
import { Field } from '@ui/main/forms/typesafe-form/Field'
import { TypesafeForm } from '@ui/main/forms/typesafe-form/TypesafeForm'
import { PageHeader } from '@ui/main/layout/page-header/PageHeader'
import { Modal } from '@ui/main/overlay/modal/Modal'
import { DataGrid } from '@ui/shared/data-grid/DataGrid'
import { LoadingSpinner } from '@ui/shared/loading-spinner/LoadingSpinner'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { v4 } from 'uuid'

export const categorySchema = createTypesafeFormSchema(({ z, presets }) => z.object({
   id: z.string().nullish(),
   name: z.string(),
   supermarketId: z.string(),
}))

const Page: NextPage = () => {
   const router = useRouter()
   
   const creationModal = useDisclosure(false)
   const { supermarket, isLoading, isEmpty } = useSupermarket()
   const categoryQuery = api.category.getAll.useQuery({ supermarketId: supermarket?.id }, { enabled: !!supermarket })
   
   const columns = useMemo<ColumnDef<Category>[]>(() => {
      return [
         {
            accessorKey: 'name',
            header: 'Name',
            cell: info => <Item data={info.row.original} />,
            size: 100,
            footer: props => props.column.id,
         },
      ]
   }, [categoryQuery.data])
   
   if (isLoading) return <LoadingSpinner />
   if (isEmpty) router.push('/supermarket')
   if (supermarket) {
      return (
         <ProtectedPage>
            <Layout header={<PageHeader
               title="Categories" action={<>
               <Button onClick={creationModal.open}>Add a category</Button>
            </>}
            />}>
               <DataGrid<Category[]>
                  columns={columns}
                  data={categoryQuery.data}
                  dataCount={categoryQuery.data?.length ?? 0}
                  isLoading={isLoading}
                  isFetching={false}
                  itemsPerPage={15}
                  enableRowSelection={false}
                  onItemSelected={data => {
                     console.log(data)
                  }}
               />
               {/*<DebugData data={categoryQuery.data} />*/}
            </Layout>
            
            <Modal title="Add a category" isOpen={creationModal.isOpen} onClose={creationModal.close} size="xl" actions={[{ action: 'close' }]}>
               <AddForm supermarketId={supermarket.id} />
            </Modal>
         
         </ProtectedPage>
      )
   }
   
   return null
}

interface ItemProps {
   children?: React.ReactNode
   data: Category
}

export const Item: React.FC<ItemProps> = (props) => {
   
   const { children, data, ...rest } = props
   
   const modal = useDisclosure(false)
   
   return <>
      <a
         className="flex items-center gap-4 cursor-pointer"
         onClick={modal.open}
      >
         <span className="text-xl font-semibold flex-none">{data.name as string}</span>
         <BiEditAlt className="text-lg" />
      </a>
      <Modal isOpen={modal.isOpen} onClose={modal.close}>
         <EditForm category={data} />
      </Modal>
   </>
   
}

interface AddFormProps {
   children?: React.ReactNode
   supermarketId: string
}

export const AddForm: React.FC<AddFormProps> = (props) => {
   
   const { children, supermarketId, ...rest } = props
   const router = useRouter()
   
   const create = api.category.create.useMutation({
      onSuccess: data => {
         router.reload()
      },
   })
   
   return <>
      <TypesafeForm<InferType<typeof categorySchema>>
         schema={categorySchema}
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
         <Field.Text name="name" label="Category name" />
         <Field.Submit role="create" />
      </TypesafeForm>
   </>
   
}


interface EditFormProps {
   children?: React.ReactNode
   category: Category
}

export const EditForm: React.FC<EditFormProps> = (props) => {
   
   const { children, category, ...rest } = props
   const router = useRouter()
   
   const update = api.category.update.useMutation({
      onSuccess: data => {
         router.reload()
      },
   })
   
   return <>
      <TypesafeForm<InferType<typeof categorySchema>>
         schema={categorySchema}
         defaultValues={{
            id: category.id,
            name: category.name,
            supermarketId: category.supermarketId,
         }}
         onSubmit={data => {
            update.mutate(data)
         }}
      >
         <Field.Text name="id" hidden />
         <Field.Text name="supermarketId" hidden />
         <Field.Text name="name" label="Category name" />
         <Field.Submit role="update" />
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
