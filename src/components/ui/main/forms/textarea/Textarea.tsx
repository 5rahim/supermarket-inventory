import { cn } from '@/lib/tailwind/tailwind-utils'
import { BasicField, BasicFieldOptions, extractBasicFieldProps } from '@ui/main/forms/basic-field/BasicField'
import { inputStyles } from '@ui/main/forms/input/TextInput'
import { VariantProps } from 'class-variance-authority'
import React, { useId } from 'react'

export interface TextareaProps extends Omit<React.ComponentPropsWithRef<'textarea'>, "size">, VariantProps<typeof inputStyles>, BasicFieldOptions {
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
   
   const [{
      children,
      className,
      size = "md",
      intent = "basic",
      placeholder,
      ...rest
   }, basicFieldProps] = extractBasicFieldProps(props, useId())
   
   return (
      <>
         <BasicField
            className={cn("w-full gap-1")}
            {...basicFieldProps}
         >
            <textarea
               // type="text"
               id={basicFieldProps.id}
               placeholder={placeholder}
               className={cn(
                  "form-textarea",
                  inputStyles({ size, intent, incorrect: !!basicFieldProps.error ? "yes" : "no" }),
                  className,
               )}
               {...rest}
               ref={ref}
            />
         </BasicField>
      </>
   )
   
})
