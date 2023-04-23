import { cn } from '@/lib/tailwind/tailwind-utils'
import { BiX } from '@react-icons/all-files/bi/BiX'
import { cva, VariantProps } from 'class-variance-authority'
import React, { CSSProperties } from 'react'


const elementStyles = cva(null, {
   variants: {
      intent: {
         gray: 'text-gray-800 bg-gray-100',
         primary: 'text-indigo-500 bg-indigo-50',
         success: 'text-green-500 bg-green-50',
         warning: 'text-orange-500 bg-orange-50',
         alert: 'text-red-500 bg-red-50',
         blue: 'text-blue-500 bg-blue-50',
         'basic': 'text-gray-900 bg-transparent',
         'primary-solid': 'text-white bg-indigo-500',
         'success-solid': 'text-white bg-green-500',
         'warning-solid': 'text-white bg-orange-500',
         'alert-solid': 'text-white bg-red-500',
         'blue-solid': 'text-white bg-blue-500',
         'gray-solid': 'text-white bg-gray-500',
      },
      size: {
         sm: 'h-4 px-2  text-xs',
         md: 'h-6 px-3 text-xs',
         lg: 'h-7 px-3 text-md',
         xl: 'h-8 px-4 text-lg',
      },
   },
   defaultVariants: {
      intent: 'primary',
      size: 'md',
   },
})


export interface BadgeProps extends React.ComponentPropsWithRef<'span'>, VariantProps<typeof elementStyles> {
   tag?: boolean,
   isClosable?: boolean,
   onClose?: () => void,
   leftIcon?: React.ReactElement<any, string | React.JSXElementConstructor<any>>
   iconSpacing?: CSSProperties['marginRight']
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>((props, ref) => {
   
   const {
      children,
      className,
      size,
      intent,
      tag = false,
      isClosable,
      onClose,
      leftIcon,
      iconSpacing = "0",
      ...rest
   } = props
   
   return (
      <>
         <span
            className={cn(
               `inline-flex text-base w-[fit-content] overflow-hidden justify-center items-center gap-2`,
               {
                  'font-bold tracking-wide rounded-full uppercase': !tag, // Badge
                  'font-semibold rounded-md': tag,
               },
               elementStyles({ size, intent }),
               className,
            )}
            {...rest}
            ref={ref}
         >
            {leftIcon && <span className="inline-flex self-center flex-shrink-0" style={{ marginRight: iconSpacing }}>{leftIcon}</span>}
            {children}
            {isClosable && <span className="text-lg -mr-1 cursor-pointer transition ease-in hover:opacity-60" onClick={onClose}><BiX /></span>}
         </span>
      </>
   )
   
})
