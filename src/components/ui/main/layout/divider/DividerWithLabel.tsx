import { cn } from '@/lib/tailwind/tailwind-utils'
import React from 'react'

export interface DividerWithLabelProps extends React.ComponentPropsWithRef<'div'> {

}

export const DividerWithLabel = React.forwardRef<HTMLDivElement, DividerWithLabelProps>((props, ref) => {
   
   const {
      children,
      className,
      ...rest
   } = props
   
   return (
      <>
         <div
            className={cn(
               "relative",
               className,
            )}
            {...rest}
            ref={ref}
         >
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
               <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
               <span className="bg-white px-2 text-sm text-gray-500">{children}</span>
            </div>
         </div>
      </>
   )
   
})
