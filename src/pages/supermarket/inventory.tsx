import { ProtectedPage } from '@/components/auth/ProtectedPage'
import { Layout } from '@/components/layout/Layout'
import { useDisclosure } from '@/hooks/use-disclosure'
import { useSupermarket } from '@/hooks/use-supermarket'
import { getServerAuthSession } from '@/server/auth'
import { InferType } from '@/types'
import { api } from '@/utils/api'
import { Category, Product, Supplier } from '@prisma/client'
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
import _ from 'lodash'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { v4 } from 'uuid'

export const productSchema = createTypesafeFormSchema(({ z, presets }) => z.object({
   id: z.string().nullish(),
   code: z.string(),
   name: z.string(),
   description: z.string(),
   unit: z.string(),
   cost: z.number().min(0),
   quantityLeft: z.number().min(0),
   supplierId: z.string(),
   supermarketId: z.string(),
   categoryId: z.string(),
}))

export const _units = ['Unit', 'Liter', 'Gallon', 'Kilogram', 'Pound']

const Page: NextPage = () => {
   const router = useRouter()
   
   const creationModal = useDisclosure(false)
   const { supermarket, isLoading, isEmpty } = useSupermarket()
   const productQuery = api.inventory.getAllProducts.useQuery({ supermarketId: supermarket?.id }, { enabled: !!supermarket, refetchOnWindowFocus: false, refetchOnMount: false })
   const categoryQuery = api.category.getAll.useQuery({ supermarketId: supermarket?.id }, {
      enabled: !!supermarket?.id, refetchOnWindowFocus: false, refetchOnMount: false,
   })
   const supplierQuery = api.supplier.getAll.useQuery({ supermarketId: supermarket?.id }, {
      enabled: !!supermarket?.id, refetchOnWindowFocus: false, refetchOnMount: false,
   })
   
   const columns = useMemo<ColumnDef<Product>[]>(() => {
      return [
         {
            accessorKey: 'name',
            header: 'Name',
            cell: info => <Item data={info.row.original} categories={categoryQuery.data ?? []} suppliers={supplierQuery.data ?? []} />,
            size: 100,
         },
         {
            accessorKey: 'code',
            header: 'Code',
            cell: info => <span>{info.getValue() as string}</span>,
            size: 60,
         },
         {
            accessorKey: 'quantityLeft',
            header: 'Quantity left',
            cell: info => <div className="">{info.getValue() as number}</div>,
            size: 60,
         },
         {
            accessorKey: 'categoryId',
            header: 'Category',
            cell: info => <span>{_.find(categoryQuery.data, n => n.id === info.getValue())?.name ?? "Loading..."}</span>,
            size: 60,
         },
         {
            accessorKey: 'supplierId',
            header: 'Supplier',
            cell: info => <span>{_.find(supplierQuery.data, n => n.id === info.getValue())?.name ?? "Loading..."}</span>,
            size: 60,
         },
      ]
   }, [productQuery.data])
   
   
   if (isLoading) return <LoadingSpinner />
   if (isEmpty) router.push('/supermarket')
   if (supermarket) {
      return (
         <ProtectedPage>
            <Layout
               header={<PageHeader
                  title="Products" action={<>
                  <Button onClick={creationModal.open}>Add a product</Button>
               </>}
               />}
            >
               <DataGrid<Product[]>
                  columns={columns}
                  data={productQuery.data}
                  dataCount={productQuery.data?.length ?? 0}
                  isLoading={isLoading}
                  isFetching={false}
                  itemsPerPage={15}
                  enableRowSelection={false}
                  onItemSelected={data => {
                     console.log(data)
                  }}
               />
               {/*<DebugData data={productQuery.data} />*/}
            </Layout>
            
            <Modal title="Add a product" isOpen={creationModal.isOpen} onClose={creationModal.close} actions={[{ action: 'close' }]}>
               <AddForm supermarketId={supermarket.id} categories={categoryQuery.data ?? []} suppliers={supplierQuery.data ?? []} />
            </Modal>
         
         </ProtectedPage>
      )
   }
   
   return null
}

interface ItemProps {
   children?: React.ReactNode
   data: Product
   categories: Category[]
   suppliers: Supplier[]
}

export const Item: React.FC<ItemProps> = (props) => {
   
   const { children, data, categories, suppliers, ...rest } = props
   
   const modal = useDisclosure(false)
   
   return <>
      <a
         className="flex items-center gap-4 cursor-pointer"
         onClick={modal.open}
      >
         <span className="text-lg font-semibold flex-none">{data.name as string}</span>
         <BiEditAlt className="text-lg" />
      </a>
      <Modal isOpen={modal.isOpen} onClose={modal.close}>
         <EditForm product={data} categories={categories} suppliers={suppliers}  />
      </Modal>
   </>
   
}

interface AddFormProps {
   children?: React.ReactNode
   supermarketId: string
   categories: Category[]
   suppliers: Supplier[]
}

export const AddForm: React.FC<AddFormProps> = (props) => {
   
   const { children, supermarketId, categories, suppliers, ...rest } = props
   const router = useRouter()
   
   const create = api.inventory.create.useMutation({
      onSuccess: data => {
         router.reload()
      },
   })
   
   
   if (categories.length > 0 && suppliers.length > 0) {
      return <>
         <TypesafeForm<InferType<typeof productSchema>>
            schema={productSchema}
            defaultValues={{
               id: v4(),
               unit: 'Unit',
               categoryId: categories[0]?.id,
               supplierId: suppliers[0]?.id,
               supermarketId: supermarketId,
               cost: 0,
               quantityLeft: 0,
            }}
            onError={console.log}
            onSubmit={data => {
               // console.log(data)
               create.mutate(data)
            }}
         >
            <Field.Text name="id" hidden />
            <Field.Text name="supermarketId" hidden />
            <Field.Text name="supermarketId" hidden />
            <Field.Text name="name" label="Product name" />
            <Field.Text name="code" label="Product code" />
            <Field.Text name="description" label="Description" />
            <Field.Select name="unit" label="Unit" options={_units.map(o => ({ value: o, label: o }))} />
            <Field.Select name="categoryId" label="Category" options={categories.map(o => ({ value: o.id, label: o.name }))} />
            <Field.Select name="supplierId" label="Supplier" options={suppliers.map(o => ({ value: o.id, label: o.name }))} />
            <Field.Price name="cost" label="Product cost" />
            <Field.Number name="quantityLeft" label="Quantity" />
            <Field.Submit role="create" />
         </TypesafeForm>
      </>
   } else {
      return <p className="text-center">You need to add categories and suppliers before adding items.</p>
   }
   
}


interface EditFormProps {
   children?: React.ReactNode
   product: Product
   categories: Category[]
   suppliers: Supplier[]
}

export const EditForm: React.FC<EditFormProps> = (props) => {
   
   const { children, product, categories, suppliers, ...rest } = props
   const router = useRouter()
   
   const update = api.inventory.update.useMutation({
      onSuccess: data => {
         router.reload()
      },
   })
   
      
      if (categories.length > 0 && suppliers.length > 0) {
         return <>
            <TypesafeForm<InferType<typeof productSchema>>
               schema={productSchema}
               defaultValues={{
                  id: product.id,
                  name: product.name,
                  unit: product.unit,
                  code: product.code,
                  description: product.description,
                  categoryId: product.categoryId,
                  supplierId: product.supplierId,
                  supermarketId: product.supermarketId,
                  cost: product.cost,
                  quantityLeft: product.quantityLeft,
               }}
               onSubmit={data => {
                  update.mutate(data)
               }}
            >
               <Field.Text name="id" hidden />
               <Field.Text name="supermarketId" hidden />
               <Field.Text name="supermarketId" hidden />
               <Field.Text name="name" label="Product name" />
               <Field.Text name="code" label="Product code" />
               <Field.Text name="description" label="Description" />
               <Field.Select name="unit" label="Unit" options={_units.map(o => ({ value: o, label: o }))} />
               <Field.Select name="categoryId" label="Category" options={categories.map(o => ({ value: o.id, label: o.name }))} />
               <Field.Select name="supplierId" label="Supplier" options={suppliers.map(o => ({ value: o.id, label: o.name }))} />
               <Field.Price name="cost" label="Product cost" />
               <Field.Number name="quantityLeft" label="Quantity" />
               <Field.Submit role="update" />
            </TypesafeForm>
         </>
      } else {
         return <></>
      }
   
}


export default Page

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   const session = await getServerAuthSession(ctx)
   return {
      props: { session },
   }
}
