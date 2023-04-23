import { cn } from '@/lib/tailwind/tailwind-utils'
import { _isEmpty } from '@/utils/common'
import { BasicField, BasicFieldOptions, extractBasicFieldProps } from '@ui/main/forms/basic-field/BasicField'
import * as combobox from "@zag-js/combobox"
import { normalizeProps, useMachine } from "@zag-js/react"
import _ from 'lodash'
import React, { useEffect, useId, useMemo, useState } from 'react'
import { inputLeftAddon, inputLeftIcon, inputRootStyle, InputStyling } from '../input/TextInput'

export interface ComboboxProps extends Omit<React.ComponentPropsWithRef<'input'>, "onChange" | "size">, BasicFieldOptions, InputStyling {
   options: { value: string, label?: string }[]
   withFiltering?: boolean
   onInputChange?: (value: string) => void
   onChange?: (value: string | undefined) => void
   placeholder?: string
   noOptionsMessage?: string
   allowCustomValue?: boolean
   defaultValue?: string
   valueInputRef?: React.Ref<HTMLInputElement>
   returnValueOrLabel?: "value" | "label"
}

export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>((props, ref) => {
   
   const [{
      size,
      intent,
      leftIcon,
      leftAddon,
      children,
      className,
      options,
      withFiltering = true,
      placeholder,
      noOptionsMessage,
      allowCustomValue = false,
      onInputChange,
      valueInputRef,
      defaultValue,
      onChange,
      returnValueOrLabel = "value",
      ...rest
   }, { id, ...basicFieldProps }] = extractBasicFieldProps<ComboboxProps>(props, useId())
   
   const [data, setData] = useState(options)
   
   const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined)
   
   const [state, send] = useMachine(
      combobox.machine({
         id: useId(),
         allowCustomValue: allowCustomValue,
         inputBehavior: "autohighlight",
         openOnClick: true,
         loop: true,
         blurOnSelect: true,
         placeholder: placeholder,
         onOpen() {
            setData(options)
         },
         onSelect: (details) => {
            if (returnValueOrLabel === "value") {
               setSelectedValue(details.value)
               onChange && onChange(details.value)
               
            } else if (returnValueOrLabel === "label") {
               setSelectedValue(details.label)
               onChange && onChange(details.label)
            }
         },
         onInputChange({ value }) {
            if (withFiltering) {
               const filtered = options.filter((item) => {
                     if (item.label) {
                        return item.label.toLowerCase().includes(value.toLowerCase())
                     } else {
                        return item.value.toLowerCase().includes(value.toLowerCase())
                     }
                  },
               )
               setData(filtered.length > 0 ? filtered : data)
            }
            onInputChange && onInputChange(value)
         },
      }),
   )
   
   const api = combobox.connect(state, send, normalizeProps)
   
   useEffect(() => {
      // if(defaultValue) api.setInputValue(defaultValue)
      if (returnValueOrLabel === "value") {
         if (defaultValue) {
            setSelectedValue(defaultValue)
            api.setInputValue(_.find(options, ['value', defaultValue])?.label ?? '')
            api.setValue(_.find(options, ['value', defaultValue])?.value ?? '')
         }
      }
      if (returnValueOrLabel === "label") {
         if (defaultValue) {
            setSelectedValue(_.find(options, ['label', defaultValue])?.value ?? defaultValue)
            api.setInputValue(_.find(options, ['label', defaultValue])?.label ?? defaultValue)
            api.setValue(_.find(options, ['label', defaultValue])?.value ?? defaultValue)
         }
      }
   }, [defaultValue])
   
   const list = useMemo(() => {
      return withFiltering ? data : options
   }, [options, withFiltering, data])
   
   // useEffect(() => {
   //    console.log(selectedValue)
   // }, [selectedValue])
   
   // useEffect(() => {
   //     const t = setTimeout(() => {
   //        console.log(api.selectedValue)
   //        api.selectedValue && api.setValue(api.selectedValue)
   //     }, 500)
   //    return () => clearTimeout(t)
   // }, [api.selectedValue])
   
   return (
      <>
         <BasicField
            {...basicFieldProps}
            id={api.inputProps.id}
            ref={ref}
         >
            <input type="text" hidden value={selectedValue ?? ''} onChange={() => {}} ref={valueInputRef} />
            <div {...api.rootProps}>
               <div {...api.controlProps} className="relative">
                  {inputLeftAddon(leftAddon, leftIcon)}
                  {inputLeftIcon(leftIcon, undefined, { ...api.triggerProps })}
                  <input
                     className={cn(
                        "unstyled",
                        inputRootStyle({
                           size, intent, isDisabled: basicFieldProps.isDisabled, hasError: !!basicFieldProps.error, leftIcon, leftAddon,
                        }),
                     )}
                     onBlur={() => {
                        /** If we do not allow custom values and the user blurs the input, we reset the input **/
                        if (!allowCustomValue) {
                           if (options.length === 0 && !api.selectedValue || (api.selectedValue && api.selectedValue.length === 0)) {
                              api.setInputValue('')
                           }
                           
                           if (options.length > 0 && (!_isEmpty(_.find(options, ['value',
                              api.selectedValue])?.label) || !_isEmpty(_.find(options, ['value', api.selectedValue])?.value))) {
                              api.selectedValue && api.setValue(api.selectedValue)
                              // api.setInputValue(options[0]!.label ?? options[0]!.value)
                           }
                        }
                     }}
                     {...rest}
                     ref={ref}
                     {...api.inputProps}
                  />
                  {/*<button {...api.triggerProps}>▼</button>*/}
               </div>
            </div>
            <div {...api.positionerProps} className="z-10">
               {(!!noOptionsMessage || list.length > 0) && (
                  <ul
                     className="absolute z-20 -bottom-0.5 left-0 translate-y-full max-h-56 w-full overflow-auto rounded-md bg-white p-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                     {...api.contentProps}
                  >
                     {(list.length === 0 && !!noOptionsMessage) && <div className="text-base text-center py-1 text-gray-500">{noOptionsMessage}</div>}
                     {list.map((item, index) => (
                        <li
                           className={cn(
                              'relative cursor-pointer py-2 pl-3 pr-9 rounded-md data-highlighted:bg-gray-100 text-base',
                           )}
                           key={`${item.value}:${index}`}
                           {...api.getOptionProps({
                              label: item.label ?? item.value,
                              value: item.value,
                              index,
                              disabled: basicFieldProps.isDisabled,
                           })}
                        >
                           {item.label}
                        </li>
                     ))}
                  </ul>
               )}
            </div>
         </BasicField>
      </>
   )
   
})
