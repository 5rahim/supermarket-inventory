import { cn } from '@/lib/tailwind/tailwind-utils'
import { createPolymorphicComponent } from '@/utils/polymorphic-component'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva(null, {
   variants: {},
   defaultVariants: {},
})


export interface CTAProps extends React.ComponentPropsWithRef<'section'>, VariantProps<typeof elementStyles> {
   textCentered?: boolean
}

const _CTA = React.forwardRef<HTMLDivElement, CTAProps>((props, ref) => {
   
   const {
      children,
      className,
      textCentered = false,
      ...rest
   } = props
   
   return (
      <>
         <section
            className={cn(
               "overflow-hidden",
               elementStyles({}),
               className,
            )}
            {...rest}
            ref={ref}
         >
            <div
               className={cn(
                  "",
                  {
                     "text-center": textCentered,
                  },
               )}
            >
               
               {children}
            
            </div>
         </section>
      </>
   )
   
})

export interface CTATitleProps extends React.ComponentPropsWithRef<'h2'> {
}

const _Title: React.FC<CTATitleProps> = ({ children, className, ...rest }) => {
   return (
      <h2 className={cn("text-2xl font-bold text-gray-900 md:text-3xl", className)} {...rest}>
         {children}
      </h2>
   )
}

export interface CTADescriptionProps extends React.ComponentPropsWithRef<'p'> {
}

const _Description: React.FC<CTADescriptionProps> = ({ children, className, ...rest }) => {
   return (
      <p className={cn("text-lg text-gray-500 mt-2", className)} {...rest}>
         {children}
      </p>
   )
}

export interface CTAActionProps extends React.ComponentPropsWithRef<'div'> {
}

const _Action: React.FC<CTAActionProps> = ({ children, className, ...rest }) => {
   return (
      <div className={cn("mt-4", className)}>
         {children}
      </div>
   )
}

// @ts-ignore
_CTA.Title = _Title
// @ts-ignore
_CTA.Description = _Description
// @ts-ignore
_CTA.Action = _Action


export const CTA = createPolymorphicComponent<'div', CTAProps, {
   Title: typeof _Title,
   Description: typeof _Description
   Action: typeof _Action
}>(_CTA)
