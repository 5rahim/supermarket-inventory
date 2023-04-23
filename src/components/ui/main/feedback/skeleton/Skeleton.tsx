import { cn } from '@/lib/tailwind/tailwind-utils'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva('h-2 bg-gray-100 rounded-md animate-purple', {
   variants: {
      type: {
         box: '',
         text: '',
      },
   },
   defaultVariants: {},
})


export interface SkeletonProps extends React.ComponentPropsWithRef<'div'>, VariantProps<typeof elementStyles> {
   type?: 'box' | 'text'
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>((props, ref) => {
   
   const {
      children,
      className,
      type = 'box',
      ...rest
   } = props
   
   if (type === 'text') {
      return (
         <>
            <div className="flex flex-col gap-3">
               <div className={cn('w-full', elementStyles({ type }), className)} {...rest} ref={ref}></div>
               <div className={cn('w-full', elementStyles({ type }), className)} {...rest} ref={ref}></div>
               <div className={cn('w-full', elementStyles({ type }), className)} {...rest} ref={ref}></div>
               <div className={cn('w-[98%]', elementStyles({ type }), className)} {...rest} ref={ref}></div>
               <div className={cn('w-[95%]', elementStyles({ type }), className)} {...rest} ref={ref}></div>
               <div className={cn('w-[90%]', elementStyles({ type }), className)} {...rest} ref={ref}></div>
            </div>
         </>
      )
   }
   
   return (
      <>
         <div
            className={cn(
               'h-14 bg-gray-200 w-full rounded-md animate-pulse',
               elementStyles({ type }),
               className,
            )}
            {...rest}
            ref={ref}
         ></div>
      </>
   )
   
})
