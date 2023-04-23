import { cn } from '@/lib/tailwind/tailwind-utils'
import { Paper } from '@ui/main/layout/paper/Paper'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva(null, {
   variants: {},
   defaultVariants: {},
})


export interface LayoutPaperProps extends React.ComponentPropsWithRef<'div'>, VariantProps<typeof elementStyles> {
   hasGradient?: boolean
}

export const LayoutPaper = React.forwardRef<HTMLDivElement, LayoutPaperProps>((props, ref) => {
   
   const {
      children,
      className,
      hasGradient,
      ...rest
   } = props
   
   return (
      <>
         <Paper
            className={cn(
               `transition ease-in`,
               "shadow-sm",
               {
                  "after:content-['*'] after:absolute after:bg-gradient-to-r after:from-indigo-100 after:to-yellow-100 after:inset-14 after:filter after:blur-2xl after:w-full after:h-full after:top-0 after:left-0 after:z-[-1]": hasGradient
               },
               elementStyles({}),
               className,
            )}
            {...rest}
            ref={ref}
         >
            {children}
         </Paper>
      </>
   )
   
})
