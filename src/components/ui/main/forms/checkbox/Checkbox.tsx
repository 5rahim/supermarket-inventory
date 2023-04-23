'use client'

import { cn } from '@/lib/tailwind/tailwind-utils'
import { ImCheckmark } from '@react-icons/all-files/im/ImCheckmark'
import { BasicField, BasicFieldOptions, extractBasicFieldProps } from '@ui/main/forms/basic-field/BasicField'
import * as checkbox from "@zag-js/checkbox"
import { normalizeProps, useMachine } from '@zag-js/react'
import { cva, VariantProps } from 'class-variance-authority'
import React, { ComponentPropsWithoutRef, useEffect, useId, useMemo } from 'react'
import { useCheckboxGroupContext } from './CheckboxGroup'


const controlStyles = cva(null, {
   variants: {
      size: {
         md: "h-5 w-5 text-xs",
         lg: "h-6 w-6 text-sm",
      },
   },
   defaultVariants: {
      size: "md",
   },
})

const labelStyles = cva(null, {
   variants: {
      size: {
         md: "text-md",
         lg: "text-lg",
      },
   },
   defaultVariants: {
      size: "md",
   },
})


export interface CheckboxProps extends VariantProps<typeof controlStyles>,
   BasicFieldOptions {
   checked?: boolean
   defaultChecked?: boolean
   onChange?: (value: boolean | "indeterminate") => void
   value?: string
   controlClassName?: string
   labelClassName?: string
   rootLabelClassName?: string
   noErrorMessage?: boolean
}

export function IndeterminateCheckbox({
   indeterminate,
   className = '',
   ...rest
}: { indeterminate?: boolean } & ComponentPropsWithoutRef<'input'>) {
   const ref = React.useRef<HTMLInputElement>(null!)
   
   React.useEffect(() => {
      if (typeof indeterminate === 'boolean') {
         ref.current.indeterminate = !rest.checked && indeterminate
      }
   }, [ref, indeterminate])
   
   return (
      <input
         type="checkbox"
         ref={ref}
         className={cn("form-checkbox cursor-pointer rounded-md w-5 h-5 border-gray-300 hover:bg-white",
            "checked:bg-indigo-500 hover:checked:bg-indigo-500 focus:checked:bg-indigo-500 indeterminate:bg-gray-400 hover:indeterminate:bg-gray-400 focus:indeterminate:bg-gray-400 focus:ring-indigo-500",
            className,
         )}
         {...rest}
      />
   )
}

export const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>((props, ref) => {
   
   const [{
      size = "md",
      value,
      checked,
      defaultChecked = false,
      noErrorMessage = false,
      onChange,
      controlClassName,
      labelClassName,
      rootLabelClassName,
   }, { id, error, label, ...basicFieldProps }] = extractBasicFieldProps<CheckboxProps>(props, useId())
   
   const groupContext = useCheckboxGroupContext()
   
   const _defaultChecked = useMemo(() => {
      let r: boolean = defaultChecked
      if (!!value && !!groupContext?.group_selectedValues && groupContext.group_selectedValues.length > 0)
         r = groupContext?.group_selectedValues.includes(value)
      return r
   }, [])
   
   const [state, send] = useMachine(checkbox.machine({
      id: id,
      name: basicFieldProps.name,
      disabled: basicFieldProps.isDisabled,
      readOnly: basicFieldProps.isReadOnly,
      onChange({ checked }) {
         if (groupContext?.group_handleValueChange && value) {
            // console.log(value, checked)
            groupContext.group_handleValueChange(value, checked)
         }
         onChange && onChange(checked)
      },
   }))
   
   useEffect(() => {
      api.setChecked(checked ?? _defaultChecked)
   }, [])
   
   useEffect(() => {
      checked && api.setChecked(checked)
   }, [checked])
   
   const api = checkbox.connect(state, send, normalizeProps)
   
   
   return (
      <>
         <BasicField
            fieldDetailsClassName={cn(
               {
                  "ml-5 pl-2": size == "md",
                  "ml-6 pl-2": size == "lg",
               },
            )}
            id={api.inputProps.id}
            error={noErrorMessage ? undefined : error}
            {...basicFieldProps} // We do not include basic id, label and error
            ref={ref}
         >
            <label className={cn("inline-flex gap-2 items-center", rootLabelClassName)} {...api.rootProps}>
               <input type="checkbox" {...api.inputProps} />
               <div
                  className={cn(
                     "inline-flex justify-center items-center border border-gray-300 rounded text-white bg-white cursor-pointer transition duration-10",
                     "hover:bg-indigo-100",
                     "data-checked:bg-indigo-500 data-checked:border-indigo-500",
                     "data-disabled:bg-gray-100 data-disabled:border-gray-200 data-disabled:text-gray-100 data-disabled:cursor-default",
                     "data-disabled:data-checked:bg-indigo-100  data-disabled:data-checked:border-indigo-100",
                     {
                        "border-red-500": !!error,
                     },
                     controlStyles({ size: groupContext?.group_size ?? size }),
                     controlClassName,
                  )} {...api.controlProps}>
                  <ImCheckmark />
               </div>
               {(!!label || !!value) && <span
                   className={cn(
                      "font-normal",
                      "data-disabled:text-gray-300",
                      labelStyles({ size: groupContext?.group_size ?? size }),
                      labelClassName,
                   )}
                   {...api.labelProps}
               >
                  {label ?? value}
               </span>}
            </label>
         </BasicField>
      </>
   )
   
})

