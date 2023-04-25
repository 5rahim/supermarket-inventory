import { cn } from '@/lib/tailwind/tailwind-utils'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'

const headingStyles = cva("font-bold text-gray-900", {
   variants: {
      size: {
         lg: "text-2xl sm:text-3xl",
         xl: "text-2xl sm:text-3xl",
      },
   },
   defaultVariants: {
      size: "xl",
   },
})


export interface PageHeaderProps extends React.ComponentPropsWithRef<'div'>, VariantProps<typeof headingStyles> {
   title?: string
   description?: string
   action?: React.ReactNode
   imageSrc?: string
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>((props, ref) => {
   
   const {
      children,
      className,
      size = "xl",
      title,
      description,
      action,
      imageSrc,
      ...rest
   } = props
   
   return (
      <>
         <header aria-label={title}>
            <div
               className={cn(
                  "mx-auto max-w-screen-xl",
                  className,
               )}
            >
               <div className="sm:flex sm:items-center sm:justify-between gap-2 md:gap-4">
                  
                  <div className="text-center sm:text-left">
                     
                     <div
                        className={cn(
                           "flex gap-6 items-center w-full justify-center sm:justify-start",
                           {
                              "flex-col gap-2 sm:flex-row sm:gap-6": !!imageSrc,
                           },
                        )}
                     >
                        {imageSrc && <div className="relative w-20 h-20">
                            <img src={imageSrc} alt="page header icon" className="object-fit" />
                        </div>}
                        
                        <h1 className={cn(headingStyles({ size }))}>
                           {title}
                        </h1>
                     </div>
                     
                     {!!description && <p className="mt-1.5 text-md text-gray-500">
                        {description}
                     </p>}
                  </div>
                  
                  {!!action && <div className="mt-2 flex flex-col flex-wrap gap-2 sm:gap-4 sm:mt-0 sm:flex-row items-center">
                     {action}
                  </div>}
               </div>
            </div>
         </header>
      </>
   )
   
})
