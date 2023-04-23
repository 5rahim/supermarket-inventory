import { cn } from '@/lib/tailwind/tailwind-utils'
import { AiFillCheckCircle } from '@react-icons/all-files/ai/AiFillCheckCircle'
import { AiOutlineCheckCircle } from '@react-icons/all-files/ai/AiOutlineCheckCircle'
import { BiErrorCircle } from '@react-icons/all-files/bi/BiErrorCircle'
import { BiX } from '@react-icons/all-files/bi/BiX'
import { BsInfoCircleFill } from '@react-icons/all-files/bs/BsInfoCircleFill'
import { GoInfo } from '@react-icons/all-files/go/GoInfo'
import { MdError } from '@react-icons/all-files/md/MdError'
import { TiWarning } from '@react-icons/all-files/ti/TiWarning'
import { TiWarningOutline } from '@react-icons/all-files/ti/TiWarningOutline'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva(null, {
   variants: {
      intent: {
         info: 'bg-blue-50 text-blue-500',
         success: 'bg-green-50 text-green-500',
         warning: 'bg-orange-50 text-orange-500',
         alert: 'bg-red-50 text-red-500',
         'info-basic': 'bg-white text-gray-800 border',
         'success-basic': 'bg-white text-gray-800 border',
         'warning-basic': 'bg-white text-gray-800 border',
         'alert-basic': 'bg-white text-gray-800 border',
      },
   },
   defaultVariants: {
      intent: 'info',
   },
})

const iconStyles = cva(null, {
   variants: {
      intent: {
         'info-basic': 'text-blue-500',
         'success-basic': 'text-green-500',
         'warning-basic': 'text-orange-500',
         'alert-basic': 'text-red-500',
      },
   },
   defaultVariants: {
      intent: 'info-basic',
   },
})


export interface AlertProps extends React.ComponentPropsWithRef<'div'>, VariantProps<typeof elementStyles> {
   title?: string,
   description?: string,
   isClosable?: boolean,
   onClose?: () => void
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
   
   const {
      children,
      className,
      title,
      description,
      isClosable,
      onClose,
      intent = "info-basic",
      ...rest
   } = props
   
   let Icon: any = null
   
   if (intent?.includes('basic')) {
      switch (intent) {
         case 'info-basic':
            Icon = GoInfo
            break
         case 'warning-basic':
            Icon = TiWarningOutline
            break
         case 'alert-basic':
            Icon = BiErrorCircle
            break
         case 'success-basic':
            Icon = AiOutlineCheckCircle
            break
      }
   } else {
      switch (intent) {
         case 'info':
            Icon = BsInfoCircleFill
            break
         case 'warning':
            Icon = TiWarning
            break
         case 'alert':
            Icon = MdError
            break
         case 'success':
            Icon = AiFillCheckCircle
            break
      }
   }
   
   return (
      <>
         <div
            className={cn(
               "px-4 rounded-md",
               elementStyles({ intent }),
               className,
            )}
            {...rest}
            ref={ref}
         >
            <div className="flex justify-between py-3">
               <div className="flex">
                  <div className={cn("text-2xl mt-1", iconStyles({ intent: intent as any }))}>
                     {Icon && <Icon />}
                  </div>
                  <div className="self-center ml-3">
                     <span className="font-bold">
                        {title}
                     </span>
                     {!!description && <div>
                         <div className="mt-.5">
                            {description}
                         </div>
                     </div>}
                  </div>
               </div>
               {onClose && <button className="self-start text-2xl hover:opacity-50 transition ease-in cursor-pointer" onClick={onClose}>
                   <BiX />
               </button>}
            </div>
         </div>
      </>
   )
   
})
