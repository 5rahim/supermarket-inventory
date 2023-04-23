import { cn } from '@/lib/tailwind/tailwind-utils'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva(null, {
   variants: {},
   defaultVariants: {},
})


export interface DividerProps extends React.ComponentPropsWithRef<'div'>, VariantProps<typeof elementStyles> {
   vertically?: boolean
}

export const Divide = React.forwardRef<HTMLDivElement, DividerProps>((props, ref) => {
   
   const {
      children,
      className,
      vertically,
      ...rest
   } = props
   
   return (
      <>
         <div
            className={cn(
               `relative w-full`,
               {
                  'divide-y': !vertically,
                  'flex divide-x': !!vertically,
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
