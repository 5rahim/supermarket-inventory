import { cn } from '@/lib/tailwind/tailwind-utils'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva(null, {
   variants: {},
   defaultVariants: {},
})


export interface StackProps extends React.ComponentPropsWithRef<'div'>, VariantProps<typeof elementStyles> {
   horizontal?: boolean
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>((props, ref) => {
   
   const {
      children,
      className,
      horizontal,
      ...rest
   } = props
   
   return (
      <>
         <div
            className={cn(
               `inline-flex flex-col gap-2`,
               {
                  'flex-row': horizontal,
               },
               elementStyles({}),
               className,
            )}
            {...rest}
            ref={ref}
         >
            {children}
         </div>
      </>
   )
   
})
