import useElementSize from '@/hooks/use-element-size'
import { cn } from '@/lib/tailwind/tailwind-utils'
import { BiChevronDown } from '@react-icons/all-files/bi/BiChevronDown'
import { BiChevronLeft } from '@react-icons/all-files/bi/BiChevronLeft'
import { BiChevronRight } from '@react-icons/all-files/bi/BiChevronRight'
import { BiChevronsLeft } from '@react-icons/all-files/bi/BiChevronsLeft'
import { BiChevronsRight } from '@react-icons/all-files/bi/BiChevronsRight'
import { BiChevronUp } from '@react-icons/all-files/bi/BiChevronUp'
import { BiSearch } from '@react-icons/all-files/bi/BiSearch'
import { FcCancel } from '@react-icons/all-files/fc/FcCancel'
import {
   ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable,
} from '@tanstack/react-table'
import { Skeleton } from '@ui/main/feedback/skeleton/Skeleton'
import { IndeterminateCheckbox } from '@ui/main/forms/checkbox/Checkbox'
import { NumberInput } from '@ui/main/forms/input/NumberInput'
import { TextInput, TextInputProps } from '@ui/main/forms/input/TextInput'
import { Select } from '@ui/main/forms/select/Select'
import { Stack } from '@ui/main/layout/stack/Stack'
import DataGridFilter from '@ui/shared/data-grid/DataGridFilter'
import LoadingScreen from '@ui/shared/loading-spinner/LoadingScreen'
import { cva } from 'class-variance-authority'
import _ from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'

export interface DataGridProps<T extends Array<any>> {
   columns: ColumnDef<T[0]>[]
   hideColumns?: { below: number, hide: string[] }[]
   data: T | null | undefined
   /**
    * Fetch this data point once from aggregation query
    */
   dataCount: number
   isLoading: boolean
   isFetching: boolean
   enableRowSelection: boolean
   onItemSelected?: (value: T) => void
   itemsPerPage?: number
}

export function DataGrid<T extends Array<any>>(props: DataGridProps<T>) {
   const {
      columns,
      data,
      dataCount,
      hideColumns = [],
      isLoading,
      isFetching,
      enableRowSelection,
      onItemSelected,
      itemsPerPage = 5,
   } = props
   
   
   const _limit = useMemo(() => itemsPerPage, [itemsPerPage])
   
   /** Select Checkbox **/
   const _columns = useMemo<ColumnDef<T[0]>[]>(() => [{
      id: 'select',
      size: 1,
      disableSortBy: true,
      disableGlobalFilter: true,
      header: ({ table }) => (
         <IndeterminateCheckbox
            {...{
               checked: table.getIsAllRowsSelected(),
               indeterminate: table.getIsSomeRowsSelected(),
               onChange: table.getToggleAllRowsSelectedHandler(),
            }}
         />
      ),
      cell: ({ row }) => (
         <div className="px-1">
            <IndeterminateCheckbox
               checked={row.getIsSelected()}
               disabled={!row.getCanSelect()}
               indeterminate={row.getIsSomeSelected()}
               onChange={row.getToggleSelectedHandler()}
            />
         </div>
      ),
   }, ...columns], [columns])
   
   const [globalFilter, setGlobalFilter] = useState('')
   const [rowSelection, setRowSelection] = useState({})
   const [sorting, setSorting] = useState<SortingState>([])
   const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: _limit })
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
   const [columnVisibility, setColumnVisibility] = useState({})
   
   const pagination = useMemo(
      () => {
         return {
            pageIndex,
            pageSize,
         }
      },
      [pageIndex, pageSize],
   )
   
   const defaultData = React.useMemo(() => [], [])
   const pageCount = useMemo(() => Math.ceil(dataCount / pageSize) ?? -1, [dataCount, pageSize])
   
   const table = useReactTable({
      data: data ?? defaultData,
      columns: enableRowSelection ? _columns : columns,
      pageCount: pageCount,
      globalFilterFn: (row, columnId, filterValue) => {
         const safeValue: string = ((): string => {
            const value: any = row.getValue(columnId)
            return typeof value === 'number' ? String(value) : value
         })()
         
         return safeValue?.toLowerCase().includes(filterValue.toLowerCase())
      },
      state: {
         sorting,
         pagination,
         rowSelection,
         globalFilter,
         columnFilters,
         columnVisibility,
      },
      enableRowSelection: enableRowSelection,
      onColumnVisibilityChange: setColumnVisibility,
      onGlobalFilterChange: setGlobalFilter,
      onColumnFiltersChange: setColumnFilters,
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      onRowSelectionChange: setRowSelection,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      // debugTable: true,
   })
   
   const [tableRef, { width: tableWidth }] = useElementSize<HTMLDivElement>()
   
   useEffect(() => {
      console.log(tableWidth)
      hideColumns.map(({ below, hide }) => {
         table.getAllLeafColumns().map(column => {
            if (hide.includes(column.id)) {
               if (tableWidth !== 0 && tableWidth < below) {
                  if (column.getIsVisible()) column.toggleVisibility(false)
               } else {
                  if (!column.getIsVisible()) column.toggleVisibility(true)
               }
            }
         })
      })
   }, [hideColumns, tableWidth])
   
   /** onItemSelected **/
   useEffect(() => {
      const selectedIndexArr = _.keys(table.getState().rowSelection).map(v => parseInt(v))
      onItemSelected && onItemSelected(data?.filter((v: any, i: number) => selectedIndexArr.includes(i)) as T)
   }, [table.getState().rowSelection])
   
   if (isLoading) return <Stack className="w-full">
      <Skeleton className="h-14" />
      <Skeleton className="h-14" />
      <Skeleton className="h-14" />
   </Stack>
   
   return (
      <div>
         <div className="flex justify-between">
            <div className="block space-y-4 w-full">
               {/* Search Box */}
               <GlobalSearchInput value={globalFilter ?? ''} onChange={value => setGlobalFilter(String(value))} />
               
               <div className="flex w-full items-center gap-2 flex-wrap">
                  {table.getAllLeafColumns().map(column => {
                     if (column.getCanFilter() && (column.columnDef.meta as any)?.filter) {
                        return <DataGridFilter
                           key={column.id}
                           filterValue={column.getFilterValue()}
                           filter={(column.columnDef.meta as any)?.filter as any}
                           setFilterValue={column.setFilterValue}
                        />
                     }
                     return null
                  })}
               </div>
            </div>
         </div>
         
         {/* Table */}
         <div
            className="flex flex-col mt-4 overflow-y-hidden overflow-x-auto border rounded-md"
            ref={tableRef}
         >
            <div className="relative">
               <div className="align-middle inline-block min-w-full relative">
                  <LoadingScreen show={isFetching} className="absolute" />
                  <table
                     className="w-full divide-y divide-gray-200 overflow-x-auto relative table-fixed"
                  >
                     
                     {/*Head*/}
                     
                     <thead className="">
                     {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                           {headerGroup.headers.map((header, index) => (
                              <th
                                 key={header.id}
                                 colSpan={header.colSpan}
                                 scope="col"
                                 className={cn(
                                    "px-3 h-12 text-left text-sm font-bold",
                                    {
                                       "px-3 sm:px-1 text-center": index === 0 && enableRowSelection,
                                    },
                                 )}
                                 style={{ width: header.getSize() }}
                              >
                                 {((index !== 0 && enableRowSelection) || !enableRowSelection) ? <div
                                    className={cn(
                                       "flex items-center justify-between",
                                       {
                                          "cursor-pointer": header.column.getCanSort(),
                                       },
                                    )}
                                    // onClick={() => onSortData(column.id)}
                                 >
                                    {header.isPlaceholder ? null : (
                                       <div
                                          className="flex relative items-center"
                                          {...{
                                             onClick: header.column.getToggleSortingHandler(),
                                          }}
                                       >
                                          {flexRender(
                                             header.column.columnDef.header,
                                             header.getContext(),
                                          )}
                                          <span className="absolute flex items-center inset-y-0 top-1 -right-9">
                                             {header.column.getIsSorted() === 'asc' &&
                                                 <BiChevronUp className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 relative bottom-0.5" />}
                                             {header.column.getIsSorted() === 'desc' &&
                                                 <BiChevronDown className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 relative bottom-0.5" />}
                                             {header.column.getIsSorted() === false &&
                                                 <BiChevronDown className="mr-3 h-5 w-5 text-transparent group-hover:text-gray-500 relative bottom-0.5" />}
                                          </span>
                                       </div>
                                    )}
                                 </div> : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                 )}
                              </th>
                           ))}
                        </tr>
                     ))}
                     </thead>
                     
                     {/*Body*/}
                     
                     {!isLoading && (
                        <tbody
                           className="bg-white divide-y divide-gray-200 w-full"
                        >
                        {table.getRowModel().rows.slice(table.getState().pagination.pageIndex * pageSize, (table.getState().pagination.pageIndex + 1) * pageSize).map((row) => {
                           return (
                              <tr key={row.id} className="hover:bg-gray-50 truncate">
                                 {row.getVisibleCells().map((cell, index) => {
                                    
                                    return (
                                       <td
                                          key={cell.id}
                                          className={cn(
                                             "px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 truncate overflow-ellipsis",
                                             {
                                                "px-2 sm:px-0 text-center": index === 0 && enableRowSelection,
                                             },
                                          )}
                                          style={{ width: cell.column.getSize(), maxWidth: cell.column.columnDef.maxSize }}
                                       >
                                          {flexRender(
                                             cell.column.columnDef.cell,
                                             cell.getContext(),
                                          )}
                                       </td>
                                    )
                                    
                                 })}
                              </tr>
                           )
                        })}
                        </tbody>
                     )}
                  </table>
                  {(!isLoading && table.getRowModel().rows.slice(table.getState().pagination.pageIndex * pageSize, (table.getState().pagination.pageIndex + 1) * pageSize).length === 0) && <>
                      <div className="flex w-full text-3xl py-4 items-center justify-center"><FcCancel /></div>
                  </>}
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row w-full items-center gap-2 justify-between border-t p-2 mt-2 overflow-x-auto max-w-full">
               
               <div className="flex gap-1 flex-none">
                  <button
                     className={cn(paginationItemStyles())}
                     onClick={() => table.setPageIndex(0)}
                     disabled={!table.getCanPreviousPage()}
                  >
                     <BiChevronsLeft />
                  </button>
                  <button
                     className={cn(paginationItemStyles())}
                     onClick={() => table.previousPage()}
                     disabled={!table.getCanPreviousPage()}
                  >
                     <BiChevronLeft />
                  </button>
                  <button
                     className={cn(paginationItemStyles())}
                     onClick={() => table.nextPage()}
                     disabled={!table.getCanNextPage()}
                  >
                     <BiChevronRight />
                  </button>
                  <button
                     className={cn(paginationItemStyles())}
                     onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                     disabled={!table.getCanNextPage()}
                  >
                     <BiChevronsRight />
                  </button>
                  <div className="flex flex-none items-center gap-1 ml-2">
                     <div>Page</div>
                     <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                     </strong>
                  </div>
               </div>
               
               <div className="flex flex-none items-center gap-2">
                  <span className="flex flex-none items-center gap-1">
                     Go to page:
                     <div className="w-[3rem]">
                        <NumberInput
                           discrete
                           defaultValue={table.getState().pagination.pageIndex + 1}
                           min={1}
                           max={pageCount}
                           onChange={v => {
                              const page = v ? v - 1 : 0
                              table.setPageIndex(page)
                           }}
                        />
                     </div>
                  </span>
                  <Select
                     value={table.getState().pagination.pageSize}
                     onChange={e => {
                        table.setPageSize(Number(e.target.value))
                     }}
                     options={[Number(_limit), 10, 20, 30, 40, 50].map(pageSize => ({ value: pageSize, label: ` ${pageSize}` }))}
                     className="w-[fit-content]"
                  />
               </div>
            
            </div>
         
         </div>
         
         {/*<pre>{JSON.stringify(table.getState(), null, 2)}</pre>*/}
      </div>
   )
}

function GlobalSearchInput({
   value: initialValue,
   onChange,
   debounce = 500,
   ...props
}: {
   value: string | number
   onChange: (value: string | number) => void
   debounce?: number
} & TextInputProps) {
   const [value, setValue] = useState(initialValue)
   
   useEffect(() => {
      setValue(initialValue)
   }, [initialValue])
   
   useEffect(() => {
      const timeout = setTimeout(() => {
         onChange(value)
      }, debounce)
      
      return () => clearTimeout(timeout)
   }, [value])
   
   return (
      <TextInput {...props} value={value} onChange={e => setValue(e.target.value)} leftIcon={<BiSearch />} />
   )
}

export const paginationItemStyles = cva(
   cn("relative inline-flex justify-center items-center h-10 w-10 text-xl border border-gray-200 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50",
      "disabled:bg-gray-100 disabled:text-gray-400 disabled:pointer-events-none"),
)
