import { cn } from '@/lib/tailwind/tailwind-utils'
import { Menu, Transition } from '@headlessui/react'
import { IconType } from '@react-icons/all-files'
import { CheckboxGroup } from '@ui/main/forms/checkbox/CheckboxGroup'
import { RadioGroup } from '@ui/main/forms/radio/RadioGroup'
import { DataGridFilterObject } from '@ui/shared/data-grid/DataGridFilter'
import _ from 'lodash'
import React, { Fragment, useState } from 'react'

export interface FilterDropdownProps extends React.ComponentPropsWithRef<'div'> {
   placeholder: string
   icon: IconType,
   type: 'checkbox' | 'radio' | 'boolean'
   value: any,
   filter: DataGridFilterObject['filter']
   onChange: (value: any) => void
}

export const FilterDropdown = React.forwardRef<HTMLDivElement, FilterDropdownProps>((props, ref) => {
   
   const {
      children,
      className,
      icon,
      placeholder,
      filter,
      type,
      value,
      onChange,
      ...rest
   } = props
   
   const Icon = icon
   const options = filter.options ?? []
   const [selectedValues, setSelectedValues] = useState<string[]>([])
   
   return (
      <>
         <Menu as="div" className="inline-block text-right relative w-full sm:w-auto">
            <div>
               <Menu.Button
                  // disabled={!selectedRows.length}
                  className={cn(
                     // !selectedRows.length ? 'text-gray-400' : 'text-gray-700',
                     'inline-flex gap-2 items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 pl-1 bg-white text-md font-medium ring-offset-1 hover:bg-gray-50 focus:outline-none',
                     {
                        "border-brand-500 text-brand-800": selectedValues[0] && selectedValues[0].length > 0,
                     },
                  )}
               >
                  <Icon className="ml-2 text-2xl text-gray-600" />
                  {placeholder}
                  {(selectedValues.length > 0 && selectedValues[0] && selectedValues[0].length > 0) && <>
                      <span className="font-bold flex gap-1 flex-wrap">{selectedValues.join(', ')}</span>
                  </>}
               </Menu.Button>
            </div>
            
            <Transition
               as={Fragment}
               enter="transition ease-out duration-100"
               enterFrom="transform opacity-0 scale-95"
               enterTo="transform opacity-100 scale-100"
               leave="transition ease-in duration-75"
               leaveFrom="transform opacity-100 scale-100"
               leaveTo="transform opacity-0 scale-95"
            >
               <Menu.Items className="origin-top-left overflow-y-auto truncate z-20 absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="p-2">
                     <div>
                        {type === 'checkbox' && <>
                            <CheckboxGroup
                                defaultValues={value}
                               // defaultValues={value === undefined ? filter.options.map(v => v.value) : value}
                                options={[...options as any]}
                                onChange={e => {
                                   onChange(e)
                                   setSelectedValues(e.map(v => _.find(options as any, ['value', v])?.label))
                                }}
                                checkboxWrapperClassName="py-1 px-2 rounded-md cursor-pointer hover:bg-gray-50"
                            />
                        </>}
                        {type === 'radio' && <>
                            <RadioGroup
                                defaultValue={value === undefined ? '-' : value}
                                options={[{ value: '-', label: 'All' }, ...options as any]}
                                onChange={e => {
                                   onChange(e === '-' ? '' : e)
                                   setSelectedValues([_.find(options as any, ['value', e])?.label])
                                }}
                                stackClassName="gap-0"
                                radioWrapperClassName="py-1 px-2 rounded-md cursor-pointer hover:bg-gray-50"
                            />
                        </>}
                        {type === 'boolean' && <>
                            <RadioGroup
                                value={value === undefined ? '-' : (value === true ? 'true' : 'false')}
                                options={[{ value: '-', label: 'All' }, { value: 'true', label: 'Yes' },
                                   { value: 'false', label: 'No' }]}
                                onChange={e => {
                                   onChange(e === '-' ? '' : e === 'true')
                                   const text = e === '-' ? '' : (e === 'true' ? 'Yes' : 'No')
                                   e && setSelectedValues([text])
                                }}
                                stackClassName="gap-0"
                                radioWrapperClassName="py-1 px-2 rounded-md cursor-pointer hover:bg-gray-50"
                            />
                        </>}
                     </div>
                  </div>
               </Menu.Items>
            </Transition>
         </Menu>
      </>
   )
   
})
