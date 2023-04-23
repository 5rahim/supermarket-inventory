import { cn } from '@/lib/tailwind/tailwind-utils'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva(null, {
   variants: {},
   defaultVariants: {},
})


export interface PaperProps extends React.ComponentPropsWithRef<'div'>, VariantProps<typeof elementStyles> {

}

export const Paper = React.forwardRef<HTMLDivElement, PaperProps>((props, ref) => {
   
   const {
      children,
      className,
      ...rest
   } = props
   
   return (
      <>
         <div
            className={cn(
               "block bg-white border rounded-md relative",
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
