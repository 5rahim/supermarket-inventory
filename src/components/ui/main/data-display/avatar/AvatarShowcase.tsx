import { cn } from '@/lib/tailwind/tailwind-utils'
import { AvatarProps } from '@ui/main/data-display/avatar/Avatar'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva(null, {
   variants: {},
   defaultVariants: {},
})


export interface AvatarShowcaseProps extends React.ComponentPropsWithRef<'div'>, VariantProps<typeof elementStyles> {
   avatar: React.ReactElement<AvatarProps, string | React.JSXElementConstructor<AvatarProps>> | undefined,
   name: string
   description?: string
}

export const AvatarShowcase = React.forwardRef<HTMLDivElement, AvatarShowcaseProps>((props, ref) => {
   
   const {
      children,
      className,
      avatar,
      name,
      description,
      ...rest
   } = props
   
   return (
      <>
         <div
            className={cn(
               "flex items-center",
               className,
            )}
            {...rest}
            ref={ref}
         >
            {avatar}
            <div className="ml-3">
               <h1 className="font-semibold text-gray-900">{name}</h1>
               {!!description && <span className="block text-sm text-gray-500">{description}</span>}
            </div>
         </div>
      </>
   )
   
})
