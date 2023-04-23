import { cn } from '@/lib/tailwind/tailwind-utils'
import { BasicField, BasicFieldOptions, extractBasicFieldProps } from '@ui/main/forms/basic-field/BasicField'
import { cva, VariantProps } from 'class-variance-authority'
import React, { useId } from 'react'


export const inputStyles = cva([
      "w-full rounded-md border-gray-300 placeholder-gray-400",
      "disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-500 disabled:shadow-none disabled:pointer-events-none",
      "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",
      'outline-none focus:outline-none',
      "transition duration-150",
      "shadow-sm",
   ],
   {
      variants: {
         size: {
            sm: "px-2 py-1.5 text-sm",
            md: "px-2 py-1 text-[.95rem]",
            lg: "px-4 py-2.5 text-lg",
         },
         intent: {
            basic: "hover:border-gray-300",
            filled: "bg-gray-100 border-gray-100 focus:bg-white",
         },
         incorrect: {
            no: "",
            yes: "border-red-500 hover:border-red-200",
         },
         untouchable: {
            no: "",
            yes: "bg-gray-50 border-gray-200 text-gray-500 shadow-none pointer-events-none",
         },
      },
      defaultVariants: {
         size: "md",
         intent: "basic",
         incorrect: "no",
      },
   })

export interface InputStyling extends VariantProps<typeof inputStyles> {
   leftAddon?: string
   leftIcon?: React.ReactNode
}

export interface TextInputProps extends Omit<React.ComponentPropsWithRef<'input'>, "size" | "disabled">, InputStyling, BasicFieldOptions {
}

export const inputContainerStyle = () => cn("flex relative")
export const inputRootStyle = ({
   size = "md",
   intent = "basic",
   hasError,
   isDisabled,
   leftAddon,
   leftIcon,
}: {
   size?: TextInputProps['size'],
   intent?: TextInputProps['intent'],
   hasError?: boolean,
   isDisabled?: boolean,
   leftAddon?: TextInputProps['leftAddon'],
   leftIcon?: TextInputProps['leftIcon']
}) => {
   return cn(
      inputStyles({ size, intent, incorrect: hasError ? "yes" : "no", untouchable: isDisabled ? "yes" : "no" }),
      {
         "border-l-none rounded-l-none": !!leftAddon,
         "pl-10": !!leftIcon && !leftAddon && (size == 'md' || size == 'sm'),
         "pl-12": !!leftIcon && !leftAddon && size == 'lg',
      },
   )
}
export const inputLeftIcon = (leftIcon: TextInputProps['leftIcon'] | undefined, size: TextInputProps['size'] = 'md', props?: Omit<React.ComponentPropsWithoutRef<'span'>, "className">) => {
   return !!leftIcon && <span
       className={cn(
          "pointer-events-none absolute inset-y-0 left-0 grid w-12 place-content-center text-gray-500 text-lg z-[1]",
          {
             "w-14 text-2xl": !!leftIcon && size == 'lg',
          },
       )}
       {...props}
   >
      {leftIcon}
   </span>
}
export const inputLeftAddon = (leftAddon: TextInputProps['leftAddon'] | undefined, leftIcon: TextInputProps['leftIcon'] | undefined, size: TextInputProps['size'] = 'md', props?: Omit<React.ComponentPropsWithoutRef<'span'>, "className">) => {
   return !!leftAddon &&
       <span
           className={cn(
              "bg-gray-50 rounded-l-md inline-flex items-center px-3 border-t border-l border-b border-gray-300 text-gray-800 shadow-sm text-sm sm:text-md",
              {
                 "pl-10": (size == 'md' || size == 'sm') && !!leftIcon,
                 "pl-12": size == 'lg' && !!leftIcon,
              },
           )}
           {...props}
       >
          {leftAddon}
       </span>
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
   
   const [{
      className,
      size = "md",
      intent = "basic",
      incorrect = "no",
      untouchable = "no",
      leftAddon = undefined,
      leftIcon = undefined,
      ...rest
   }, basicFieldProps] = extractBasicFieldProps<TextInputProps>(props, useId())
   
   return (
      <>
         <BasicField
            className={cn("w-full gap-1")}
            {...basicFieldProps}
         >
            <div className={cn(inputContainerStyle())}>
               
               {inputLeftIcon(leftIcon)}
               
               {inputLeftAddon(leftAddon, leftIcon)}
               
               <input
                  // type="text"
                  id={basicFieldProps.id}
                  name={basicFieldProps.name}
                  className={cn(
                     "form-input",
                     inputRootStyle({ size, intent, isDisabled: basicFieldProps.isDisabled, hasError: !!basicFieldProps.error, leftIcon, leftAddon }),
                     className,
                  )}
                  disabled={basicFieldProps.isDisabled}
                  {...rest}
                  ref={ref}
               />
            </div>
         </BasicField>
      </>
   )
   
})
