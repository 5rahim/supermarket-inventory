import { IconType } from '@react-icons/all-files'
import { BuiltInFilterFn } from '@tanstack/table-core/src/filterFns'
import { Select } from '@ui/main/forms/select/Select'
import { FilterDropdown } from '@ui/shared/data-grid/FilterDropdown'
import React from 'react'

export type DataGridFilterObject = {
   filter: {
      type: 'select' | 'radio' | 'checkbox' | 'boolean'
      placeholder: string,
      icon: IconType
      options?: { value: string | boolean, label?: string }[]
   }
}

export const useDataGridFilterFn = (type: DataGridFilterObject['filter']['type']): { filterFn: BuiltInFilterFn } => {
   let fn: BuiltInFilterFn = "equals"
   switch (type) {
      case 'select':
         fn = "equals"
         break
      case 'boolean':
         fn = "equals"
         break
      case 'checkbox':
         fn = "arrIncludesSome"
         break
      case 'radio':
         fn = "equalsString"
         break
   }
   return { filterFn: fn }
}

export const useDataGridFilter = (
   type: DataGridFilterObject['filter']['type'],
   placeholder: DataGridFilterObject['filter']['placeholder'],
   icon: DataGridFilterObject['filter']['icon'],
   options?: DataGridFilterObject['filter']['options'],
): DataGridFilterObject => {
   return {
      filter: {
         placeholder,
         type,
         icon,
         options,
      },
   }
}

interface DataGridFilterProps {
   children?: React.ReactNode
   filter: DataGridFilterObject['filter']
   filterValue: any
   setFilterValue: (updater: any) => void
}

const DataGridFilter: React.FC<DataGridFilterProps> = (props) => {
   
   const { children, filter, setFilterValue, filterValue, ...rest } = props
   
   const Icon = filter.icon
   const options = filter.options ?? []
   
   if (filter.type === 'select') return <>
      <Select
         leftIcon={<Icon className="text-2xl" />}
         leftAddon={filter.placeholder}
         options={[...options as any]}
         onChange={e =>
            setFilterValue(e.target.value.toLowerCase())
         }
         fieldClassName="sm:w-auto"
      />
   </>
   
   if (filter.type === 'checkbox' || filter.type === 'boolean' || filter.type === 'radio') return <>
      <FilterDropdown
         type={filter.type}
         icon={Icon}
         placeholder={filter.placeholder}
         filter={filter}
         value={filterValue}
         onChange={e =>
            setFilterValue(e)
         }
      />
   </>
   
   return (
      <>
      
      </>
   )
   
}

export default DataGridFilter
