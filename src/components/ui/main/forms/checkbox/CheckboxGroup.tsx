import { cn } from '@/lib/tailwind/tailwind-utils'
import { BasicField, BasicFieldOptions, extractBasicFieldProps } from '@ui/main/forms/basic-field/BasicField'
import { Checkbox, CheckboxProps } from '@ui/main/forms/checkbox/Checkbox'
import { Stack } from '@ui/main/layout/stack/Stack'
import { cva, VariantProps } from 'class-variance-authority'
import React, { createContext, useCallback, useContext, useEffect, useId, useState } from 'react'

interface CheckboxGroupContextValue {
   group_selectedValues: string[]
   group_size: CheckboxProps['size']
   
   group_handleValueChange(value: string, isChecked: boolean | "indeterminate"): void
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null)
export const CheckboxGroupProvider = CheckboxGroupContext.Provider
export const useCheckboxGroupContext = () => useContext(CheckboxGroupContext)

const elementStyles = cva(null, {
   variants: {},
   defaultVariants: {},
})


export interface CheckboxGroupProps extends BasicFieldOptions, VariantProps<typeof elementStyles> {
   defaultValues?: string[]
   onChange?: (values: string[]) => void
   size?: CheckboxProps['size']
   stackClassName?: string
   checkboxWrapperClassName?: string
   checkboxLabelClassName?: string
   checkboxControlClassName?: string
   options: { value: string, label?: string }[]
}

export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>((props, ref) => {
   
   const [{
      defaultValues = [],
      onChange,
      stackClassName,
      checkboxLabelClassName,
      checkboxControlClassName,
      checkboxWrapperClassName,
      options,
      size = undefined,
   }, basicFieldProps] = extractBasicFieldProps<CheckboxGroupProps>(props, useId())
   
   const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues)
   
   useEffect(() => {
      if (defaultValues !== selectedValues) {
         onChange && onChange(selectedValues)
      }
   }, [selectedValues])
   
   const handleValueChange = useCallback((value: string, isChecked: boolean | "indeterminate") => {
      setSelectedValues(p => {
         let newArr = [...p]
         if (isChecked === true) {
            if (p.indexOf(value) === -1) newArr.push(value)
         } else if (isChecked === false) {
            newArr = newArr.filter(v => v !== value)
         }
         return newArr
      })
   }, [selectedValues])
   
   return (
      <>
         <CheckboxGroupProvider value={{ group_selectedValues: selectedValues, group_handleValueChange: handleValueChange, group_size: size }}>
            <BasicField
               {...basicFieldProps}
               ref={ref}
            >
               <Stack className={cn("gap-1", stackClassName)}>
                  {options.map((opt) => (
                     <Checkbox
                        key={opt.value}
                        label={opt.label}
                        value={opt.value}
                        error={basicFieldProps.error}
                        noErrorMessage
                        labelClassName={checkboxLabelClassName}
                        controlClassName={checkboxControlClassName}
                        rootLabelClassName={checkboxWrapperClassName}
                        isDisabled={basicFieldProps.isDisabled}
                        isReadOnly={basicFieldProps.isReadOnly}
                     />
                  ))}
               </Stack>
            </BasicField>
         </CheckboxGroupProvider>
      </>
   )
   
})
