import { cn } from '@/lib/tailwind/tailwind-utils'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva('border', {
   variants: {
      intent: {
         primary: 'border-transparent bg-indigo-500 text-white',
         success: 'border-transparent bg-green-500 text-white',
         alert: 'border-transparent bg-red-500 text-white',
         warning: 'border-transparent bg-orange-500 text-white',
         gray: 'border-transparent bg-gray-500 text-white',
         
         'primary-subtle': 'border-transparent bg-indigo-50 text-indigo-500',
         'success-subtle': 'border-transparent bg-green-50 text-green-500',
         'alert-subtle': 'border-transparent bg-red-50 text-red-500',
         'warning-subtle': 'border-transparent bg-orange-50 text-orange-500',
         'gray-subtle': 'border-transparent bg-gray-50 text-gray-500',
         
         'primary-outline': 'border-indigo-500 text-indigo-500 bg-transparent',
         'success-outline': 'border-green-500 text-green-500 bg-transparent',
         'alert-outline': 'border-red-500 text-red-500 bg-transparent',
         'warning-outline': 'border-orange-500 text-orange-500 bg-transparent',
         'gray-outline': 'border-gray-500 text-gray-500 bg-transparent',
         
         'primary-basic': 'border-transparent text-indigo-500 bg-transparent',
         'success-basic': 'border-transparent text-green-500 bg-transparent',
         'alert-basic': 'border-transparent text-red-500 bg-transparent',
         'warning-basic': 'border-transparent text-orange-500 bg-transparent',
         'gray-basic': 'border-transparent text-gray-500 bg-transparent',
         'white-basic': 'border-transparent text-white bg-transparent',
         
      },
      size: {
         sm: 'w-8 h-8 text-lg',
         md: 'w-10 h-10 text-2xl',
         lg: 'w-14 h-14 text-3xl',
      },
   },
   defaultVariants: {
      intent: 'primary',
      size: 'md',
   },
})


export interface IconDisplayProps extends React.ComponentPropsWithRef<'div'>, VariantProps<typeof elementStyles> {
   icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>
   rounded?: boolean
}

export const IconDisplay = React.forwardRef<HTMLDivElement, IconDisplayProps>((props, ref) => {
   
   const {
      children,
      className,
      intent,
      size,
      icon,
      rounded,
      ...rest
   } = props
   
   return (
      <>
         <div
            className={cn(
               `inline-flex rounded-md items-center justify-center`,
               {
                  'rounded-full': rounded,
               },
               elementStyles({ intent, size }),
               className,
            )}
            {...rest}
            ref={ref}
         >
            {icon}
         </div>
      </>
   )
   
})
