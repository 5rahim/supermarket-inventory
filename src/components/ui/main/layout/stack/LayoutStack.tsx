import { cn } from '@/lib/tailwind/tailwind-utils'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva(null, {
   variants: {},
   defaultVariants: {},
})


export interface LayoutStackProps extends React.ComponentPropsWithRef<'div'>, VariantProps<typeof elementStyles> {

}

export const LayoutStack = React.forwardRef<HTMLDivElement, LayoutStackProps>((props, ref) => {
   
   const {
      children,
      className,
      ...rest
   } = props
   
   return (
      <>
         <LayoutStack
            className={cn(
               `place-items-start`,
               elementStyles({}),
               className,
            )}
            {...rest}
            ref={ref}
         >
            {children}
         </LayoutStack>
      </>
   )
   
})
