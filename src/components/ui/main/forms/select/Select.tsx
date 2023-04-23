import { cn } from '@/lib/tailwind/tailwind-utils'
import { BasicField, BasicFieldOptions, extractBasicFieldProps } from '@ui/main/forms/basic-field/BasicField'
import { inputContainerStyle, inputLeftAddon, inputLeftIcon, inputRootStyle, InputStyling } from '@ui/main/forms/input/TextInput'
import React, { useId } from 'react'

export interface SelectProps extends Omit<React.ComponentPropsWithRef<'select'>, "size">, InputStyling, BasicFieldOptions {
   options?: { value: string | number, label?: string }[]
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
   
   const [{
      children,
      className,
      size = "md",
      intent = "basic",
      leftIcon,
      leftAddon,
      defaultValue,
      options = [],
      placeholder,
      ...rest
   }, basicFieldProps] = extractBasicFieldProps<SelectProps>(props, useId())
   
   return (
      <>
         <BasicField
            className={cn("w-full gap-1")}
            {...basicFieldProps}
         >
            <div className={cn(inputContainerStyle())}>
               {inputLeftAddon(leftAddon, leftIcon)}
               {inputLeftIcon(leftIcon)}
               <select
                  // type="text"
                  id={basicFieldProps.id}
                  name={basicFieldProps.name}
                  className={cn(
                     "form-select",
                     inputRootStyle({ size, intent, isDisabled: basicFieldProps.isDisabled, hasError: !!basicFieldProps.error, leftIcon, leftAddon }),
                     className,
                  )}
                  disabled={basicFieldProps.isDisabled}
                  {...rest}
                  defaultValue={defaultValue ? defaultValue : options[0]?.value}
                  ref={ref}
               >
                  {placeholder && <option value="" hidden>{placeholder}</option>}
                  {options.map(opt => (
                     <option key={opt.value} value={opt.value}>{opt.label ?? opt.value}</option>
                  ))}
               </select>
            </div>
         </BasicField>
      </>
   )
   
})
