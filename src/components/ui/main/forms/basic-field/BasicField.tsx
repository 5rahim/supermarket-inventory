import { cn } from '@/lib/tailwind/tailwind-utils'
import ShowOnly from '@ui/shared/show-only/ShowOnly'
import React from 'react'

export function extractBasicFieldProps<Props extends BasicFieldOptions>(props: Props, id: string) {
   const {
      name,
      label,
      labelProps,
      help,
      error,
      isRequired,
      isDisabled = false,
      isReadOnly = false,
      fieldDetailsClassName,
      fieldLabelClassName,
      fieldClassName,
      id: _id,
      ...rest
   } = props
   return [
      rest,
      {
         id: _id ?? id,
         name,
         label,
         help,
         error,
         isDisabled,
         isRequired,
         isReadOnly,
         fieldDetailsClassName,
         fieldLabelClassName,
         fieldClassName,
         labelProps,
      },
   ] as [Omit<Props, "name" | "help" | "error" | "isDisabled" | "isReadOnly" | "fieldDetailsClassName" | "fieldLabelClassName" | "fieldClassName" | "id" | "labelProps">, Omit<BasicFieldOptions, "id"> & {
      id: string
   }]
}

export interface BasicFieldOptions {
   id?: string | undefined
   name?: string
   label?: React.ReactNode
   labelProps?: object
   help?: React.ReactNode
   error?: string
   isRequired?: boolean
   isDisabled?: boolean
   isReadOnly?: boolean
   fieldClassName?: string
   fieldDetailsClassName?: string
   fieldLabelClassName?: string
}

export interface BasicFieldProps extends Omit<React.ComponentPropsWithRef<'div'>, "onChange">, BasicFieldOptions {

}

export const BasicField = React.memo(React.forwardRef<HTMLDivElement, BasicFieldProps>((props, ref) => {
   
   const {
      children,
      className,
      fieldClassName,
      labelProps,
      id,
      label,
      error,
      help,
      isDisabled,
      isReadOnly,
      isRequired,
      fieldDetailsClassName,
      fieldLabelClassName,
      ...rest
   } = props
   
   
   return (
      <>
         <div
            className={cn(
               `flex w-full flex-col gap-1`,
               className,
               fieldClassName,
            )}
            {...rest}
            ref={ref}
         >
            <ShowOnly when={!!label}>
               <label
                  htmlFor={id}
                  className={cn(
                     "text-[1rem] font-semibold self-start",
                     {
                        "text-red-500": !!error,
                     },
                     fieldLabelClassName,
                  )}
                  {...labelProps}
               >
                  {label}
                  <ShowOnly when={isRequired}>
                     <span className="ml-1 text-red-500 text-sm">*</span>
                  </ShowOnly>
               </label>
            </ShowOnly>
            
            {children}
            
            <ShowOnly when={!!help || !!error}>
               <div className={cn("", fieldDetailsClassName)}>
                  {!!help && <p className="text-sm text-gray-500">{help}</p>}
                  {!!error && <p className="text-sm text-red-500">{error}</p>}
               </div>
            </ShowOnly>
         </div>
      </>
   )
   
}))
