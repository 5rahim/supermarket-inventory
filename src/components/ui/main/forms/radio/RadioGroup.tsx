'use client'

import { cn } from '@/lib/tailwind/tailwind-utils'
import { GoPrimitiveDot } from '@react-icons/all-files/go/GoPrimitiveDot'
import { BasicField, BasicFieldOptions, extractBasicFieldProps } from '@ui/main/forms/basic-field/BasicField'
import { Stack } from '@ui/main/layout/stack/Stack'
import * as radio from "@zag-js/radio-group"
import { normalizeProps, useMachine } from '@zag-js/react'
import { cva, VariantProps } from 'class-variance-authority'
import React, { useEffect, useId } from 'react'


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


export interface RadioGroupProps extends BasicFieldOptions, VariantProps<typeof controlStyles> {
   value?: string
   defaultValue?: string
   options: { value: string, label?: React.ReactNode, help?: React.ReactNode }[]
   onChange?: (value: string | null) => void
   stackClassName?: string
   radioWrapperClassName?: string
   radioLabelClassName?: string
   radioControlClassName?: string
   radioHelpClassName?: string
   checkedIcon?: React.ReactNode
}

export const RadioGroup = React.forwardRef<HTMLInputElement, RadioGroupProps>((props, ref) => {
   
   const [{
      size = "md",
      value,
      defaultValue,
      onChange,
      options,
      stackClassName,
      radioLabelClassName,
      radioControlClassName,
      radioWrapperClassName,
      radioHelpClassName,
      checkedIcon,
   }, basicFieldProps] = extractBasicFieldProps<RadioGroupProps>(props, useId())
   
   const [state, send] = useMachine(radio.machine({
      id: basicFieldProps.id,
      value,
      name: basicFieldProps.name,
      disabled: basicFieldProps.isDisabled,
      readOnly: basicFieldProps.isReadOnly,
      onChange(details) {
         onChange && onChange(details.value)
      },
   }))
   
   
   const api = radio.connect(state, send, normalizeProps)
   
   useEffect(() => {
      defaultValue && api.setValue(defaultValue)
   }, [])
   
   return (
      <>
         <BasicField
            {...basicFieldProps}
            ref={ref}
         >
            <Stack className={cn("gap-2", stackClassName)} {...api.rootProps}>
               
               {options.map((opt) => (
                  
                  <label
                     key={opt.value}
                     {...api.getRadioProps({ value: opt.value })}
                     className={cn(
                        "inline-flex gap-2 items-center relative",
                        radioWrapperClassName,
                     )}
                  >
                     
                     <div
                        className={cn(
                           "inline-flex flex-none justify-center items-center border border-gray-300 rounded-full text-white bg-white cursor-pointer transition duration-10 relative",
                           "hover:bg-indigo-100",
                           "data-checked:bg-indigo-500 data-checked:border-indigo-500",
                           "data-disabled:bg-gray-100 data-disabled:border-gray-200 data-disabled:text-gray-100 data-disabled:cursor-default",
                           "data-disabled:data-checked:bg-indigo-100 data-disabled:data-checked:border-indigo-100",
                           {
                              "border-red-500": !!basicFieldProps.error,
                           },
                           controlStyles({ size }),
                           radioControlClassName,
                        )}
                        {...api.getRadioControlProps({ value: opt.value })}>
                        {checkedIcon ? checkedIcon : <GoPrimitiveDot />}
                     </div>
                     
                     <div
                        className={cn(
                           "font-normal",
                           labelStyles({ size }),
                           radioLabelClassName,
                        )}
                        {...api.getRadioLabelProps({ value: opt.value })}
                     >
                        {opt.label ?? opt.value}
                     </div>
                     
                     {!!opt.help && <div
                         className={cn(
                            "text-gray-500 data-disabled:text-gray-300",
                            radioHelpClassName,
                         )}
                         {...api.getRadioLabelProps({ value: opt.value })}
                     >
                        {opt.help}
                     </div>}
                     
                     <input {...api.getRadioInputProps({ value: opt.value })} ref={ref} />
                  
                  </label>
               
               ))}
            
            </Stack>
         </BasicField>
      </>
   )
   
})

export const SegmentedControl = React.forwardRef<HTMLInputElement, RadioGroupProps>((props, ref) => {
   // console.log(props.value)
   
   return (
      <RadioGroup
         fieldClassName="flex w-full"
         fieldLabelClassName="text-md"
         stackClassName="flex flex-row gap-2 p-0 bg-gray-50 rounded-md border w-[fit-content]"
         radioWrapperClassName="block w-[fit-content] py-1 px-2 cursor-pointer border border-transparent transition rounded-md data-checked:bg-white data-checked:border-gray-300 data-checked:shadow-sm text-gray-500 data-checked:text-black"
         radioControlClassName="hidden"
         radioLabelClassName="font-semibold flex-none flex"
         radioHelpClassName="text-base"
         {...props}
         ref={ref}
      />
   )
   
})
