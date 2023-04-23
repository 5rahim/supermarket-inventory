import { cn } from '@/lib/tailwind/tailwind-utils'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva(null, {
   variants: {
      size: {
         sm: `max-w-screen-sm`,
         md: `max-w-screen-md`,
         lg: `max-w-screen-lg`,
         xl: `max-w-screen-xl`,
         '2xl': `max-w-screen-2xl`,
      }
   },
   defaultVariants: {
      size: 'md'
   },
})


export interface ContainerProps extends React.ComponentPropsWithRef<'div'>, VariantProps<typeof elementStyles> {

}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>((props, ref) => {
   
   const {
      children,
      className,
      size,
      ...rest
   } = props
   
   return (
      <>
         <div
            className={cn(
               `w-[100%] px-4`,
               elementStyles({ size }),
               `mx-auto`,
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
