import { ProtectedPage } from '@/components/auth/ProtectedPage'
import { Layout } from '@/components/layout/Layout'
import { useDisclosure } from '@/hooks/use-disclosure'
import { usePriceFormatter } from '@/hooks/use-price-formatter'
import { useSupermarket } from '@/hooks/use-supermarket'
import { getServerAuthSession } from '@/server/auth'
import { InferType } from '@/types'
import { api } from '@/utils/api'
import { Product, Sale } from '@prisma/client'
import { BiEditAlt } from '@react-icons/all-files/bi/BiEditAlt'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@ui/main/forms/button/Button'
import { createTypesafeFormSchema } from '@ui/main/forms/typesafe-form/CreateTypesafeFormSchema'
import { Field } from '@ui/main/forms/typesafe-form/Field'
import { TypesafeForm } from '@ui/main/forms/typesafe-form/TypesafeForm'
import { PageHeader } from '@ui/main/layout/page-header/PageHeader'
import { Modal } from '@ui/main/overlay/modal/Modal'
import { DangerZone } from '@ui/shared/danger-zone/DangerZone'
import { DataGrid } from '@ui/shared/data-grid/DataGrid'
import { LoadingSpinner } from '@ui/shared/loading-spinner/LoadingSpinner'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { memo, useMemo } from 'react'
import { v4 } from 'uuid'

export const saleSchema = createTypesafeFormSchema(({ z, presets }) => z.object({
   id: z.string().nullish(),
   quantity: z.number().min(0),
   supermarketId: z.string(),
   productId: z.string(),
   saleDate: z.date()
}))

export type ISale = Sale & { productName: string, total: number }

const Page: NextPage = () => {
   const router = useRouter()
   
   const creationModal = useDisclosure(false)
   const { supermarket, isLoading, isEmpty } = useSupermarket()
   const priceFormatter = usePriceFormatter()
   const saleQuery = api.sale.getAll.useQuery({ supermarketId: supermarket?.id }, { enabled: !!supermarket, refetchOnWindowFocus: false, refetchOnMount: false })
   const productQuery = api.inventory.getAllProducts.useQuery({ supermarketId: supermarket?.id }, { enabled: !!supermarket, refetchOnWindowFocus: false, refetchOnMount: false })
   
   const columns = useMemo<ColumnDef<ISale>[]>(() => {
      return [
         {
            accessorKey: 'productName',
            header: 'Product name',
            cell: info => <Item data={info.row.original} products={productQuery.data ?? []} />,
            size: 60,
            footer: props => props.column.id,
         },
         {
            accessorKey: 'quantity',
            header: 'Quantity',
            cell: info => <span>{info.getValue() as number}</span>,
            size: 60,
            footer: props => props.column.id,
         },
         {
            accessorKey: 'total',
            header: 'Total',
            cell: info => <span>{priceFormatter.toFormat(info.getValue() as number)}</span>,
            size: 60,
            footer: props => props.column.id,
         },
      ]
   }, [saleQuery.data])
   
   if (isLoading) return <LoadingSpinner />
   if (isEmpty) router.push('/supermarket')
   if (supermarket) {
      return (
         <ProtectedPage>
            <Layout header={<PageHeader
               title="Sales" action={<>
               <Button onClick={creationModal.open}>Add a sale</Button>
            </>}
            />}>
               <DataGrid<ISale[]>
                  columns={columns}
                  data={saleQuery.data}
                  dataCount={saleQuery.data?.length ?? 0}
                  isLoading={isLoading}
                  isFetching={false}
                  itemsPerPage={15}
                  enableRowSelection={false}
                  onItemSelected={data => {
                     console.log(data)
                  }}
               />
               {/*<DebugData data={saleQuery.data} />*/}
            </Layout>
            
            <Modal title="Add a sale" isOpen={creationModal.isOpen} onClose={creationModal.close} size="xl" actions={[{ action: 'close' }]}>
               <AddForm supermarketId={supermarket.id} products={productQuery.data ?? []} />
            </Modal>
         
         </ProtectedPage>
      )
   }
   
   return null
}

interface ItemProps {
   children?: React.ReactNode
   data: ISale
   products: Product[]
}

export const Item: React.FC<ItemProps> = memo((props) => {
   
   const { children, data, products, ...rest } = props
   
   const modal = useDisclosure(false)
   
   return <>
      <a
         className="flex items-center gap-4 cursor-pointer"
         onClick={modal.open}
      >
         <span className="text-lg font-semibold flex-none">{data.productName as string}</span>
         <BiEditAlt className="text-lg" />
      </a>
      <Modal isOpen={modal.isOpen} onClose={modal.close}>
         <EditForm sale={data} products={products} />
      </Modal>
   </>
   
})

interface AddFormProps {
   children?: React.ReactNode
   supermarketId: string
   products: Product[]
}

export const AddForm: React.FC<AddFormProps> = (props) => {
   
   const { children, supermarketId, products, ...rest } = props
   const router = useRouter()
   
   const create = api.sale.create.useMutation({
      onSuccess: data => {
         router.reload()
      },
   })
   
   return <>
      <TypesafeForm<InferType<typeof saleSchema>>
         schema={saleSchema}
         defaultValues={{
            id: v4(),
            productId: products[0]?.id,
            supermarketId: supermarketId,
         }}
         onSubmit={data => {
            create.mutate(data)
         }}
      >
         <Field.Text name="id" hidden />
         <Field.Text name="supermarketId" hidden />
         <Field.Select name="productId" label="Product" options={products.map(o => ({ value: o.id, label: o.name }))} />
         <Field.Number name="quantity" label="Quantity" />
         <Field.DatePicker name="saleDate" label="Date of purchase" />
         <Field.Submit role="create" />
      </TypesafeForm>
   </>
   
}


interface EditFormProps {
   children?: React.ReactNode
   sale: ISale
   products: Product[]
}

export const EditForm: React.FC<EditFormProps> = (props) => {
   
   const { children, sale, products, ...rest } = props
   const router = useRouter()
   
   const update = api.sale.update.useMutation({
      onSuccess: data => {
         router.reload()
      },
   })
   
   const deleteObject = api.sale.delete.useMutation({
      onSuccess: data => {
         router.reload()
      },
   })
   
   return <>
      {/*<TypesafeForm<InferType<typeof saleSchema>>*/}
      {/*   schema={saleSchema}*/}
      {/*   defaultValues={{*/}
      {/*      id: sale.id,*/}
      {/*      quantity: sale.quantity,*/}
      {/*      productId: sale.productId,*/}
      {/*      supermarketId: sale.supermarketId,*/}
      {/*   }}*/}
      {/*   onSubmit={data => {*/}
      {/*      update.mutate(data)*/}
      {/*   }}*/}
      {/*>*/}
      {/*   <Field.Text name="id" hidden />*/}
      {/*   <Field.Text name="supermarketId" hidden />*/}
      {/*   <Field.Select name="productId" label="Product" options={products.map(o => ({ value: o.id, label: o.name }))} />*/}
      {/*   <Field.Number name="quantity" label="Quantity" />*/}
      {/*   <Field.Submit role="update" />*/}
      {/*   */}
      {/*</TypesafeForm>*/}
         <DangerZone action="Delete this sale" onDelete={() => deleteObject.mutate({ id: sale.id })} />
   </>
   
}


export default Page

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const session = await getServerAuthSession(ctx)
   return {
      props: { session },
   }
}
