import { cn } from '@/lib/tailwind/tailwind-utils'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva(null, {
   variants: {
      size: {
         md: "text-xl",
         lg: "text-2xl",
         xl: "text-3xl",
      },
   },
   defaultVariants: {
      size: 'md',
   },
})


export interface TitleProps extends React.ComponentPropsWithRef<'p'>, VariantProps<typeof elementStyles> {

}

export const Title = React.forwardRef<HTMLParagraphElement, TitleProps>((props, ref) => {
   
   const {
      children,
      size,
      className,
      ...rest
   } = props
   
   return (
      <>
         <p
            className={cn(
               "text-lg font-semibold",
               elementStyles({ size }),
               className,
            )}
            {...rest}
            ref={ref}
         >
            {children}
         </p>
      </>
   )
   
})
