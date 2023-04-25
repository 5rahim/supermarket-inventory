import { cn } from '@/lib/tailwind/tailwind-utils'
import { BasicField, BasicFieldOptions, extractBasicFieldProps } from '@ui/main/forms/basic-field/BasicField'
import * as checkbox from "@zag-js/checkbox"
import { normalizeProps, useMachine } from '@zag-js/react'
import { cva, VariantProps } from 'class-variance-authority'
import React, { useEffect, useId } from 'react'


const controlWrapperStyles = cva(null, {
   variants: {
      size: {
         md: "h-6 w-10",
         lg: "h-7 w-12",
      },
   },
   defaultVariants: {
      size: "md",
   },
})
const controlKnobStyles = cva(null, {
   variants: {
      size: {
         md: "m-1 h-4 w-4 data-checked:translate-x-4",
         lg: "m-1 h-5 w-5 data-checked:translate-x-5",
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


export interface SwitchProps extends VariantProps<typeof controlWrapperStyles>,
   BasicFieldOptions {
   defaultChecked?: boolean
   onChange?: (value: boolean | "indeterminate") => void
   value?: string
   controlClassName?: string
   labelClassName?: string
   rootLabelClassName?: string
}

export const Switch = React.forwardRef<HTMLDivElement, SwitchProps>((props, ref) => {
   
   const [{
      size = "md",
      value,
      defaultChecked = false,
      onChange,
      controlClassName,
      labelClassName,
      rootLabelClassName,
   }, { label, ...basicFieldProps }] = extractBasicFieldProps(props, useId())
   
   
   const [state, send] = useMachine(checkbox.machine({
      id: basicFieldProps.id,
      name: basicFieldProps.name,
      disabled: basicFieldProps.isDisabled,
      readOnly: basicFieldProps.isReadOnly,
      onChange({ checked }) {
         onChange && onChange(checked)
      },
   }))
   
   useEffect(() => {
      api.setChecked(defaultChecked)
   }, [])
   
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
            {...basicFieldProps} // We do not include the label
            id={api.inputProps.id}
         >
            <label className={cn("relative inline-flex gap-2 items-center flex-none", rootLabelClassName)} {...api.rootProps}>
               <input type="checkbox" {...api.inputProps} />
               
               <div
                  className={cn(
                     "relative h-8 w-14 relative overflow-hidden cursor-pointer flex-none",
                     controlWrapperStyles({ size }),
                  )}
               >
                  
                  <span
                     className={cn(
                        "absolute inset-0 rounded-full bg-gray-300 transition",
                        "hover:bg-gray-400",
                        "data-checked:bg-brand-500 data-checked:border-brand-500",
                        "data-disabled:bg-gray-200 data-disabled:text-gray-200 data-disabled:cursor-default",
                        {
                           "border-red-500": !!basicFieldProps.error,
                        },
                        // controlStyles({ size }),
                        controlClassName,
                     )} {...api.controlProps} />
                  <span
                     className={cn(
                        "absolute inset-0 rounded-full bg-white transition",
                        controlKnobStyles({ size }),
                     )}
                     {...api.controlProps}
                  />
               </div>
               
               
               {(!!label || !!value) && <span
                   className={cn(
                      "relative font-normal",
                      "data-disabled:text-gray-300",
                      labelStyles({ size }),
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

