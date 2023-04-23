import { Button, ButtonProps } from '@ui/main/forms/button/Button'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva(null, {
   variants: {},
   defaultVariants: {},
})


export interface ResponsiveButtonProps extends Omit<ButtonProps, "size">, VariantProps<typeof elementStyles> {
   sizes?: (ButtonProps['size'] | null | undefined)[]
}

export const ResponsiveButton = React.forwardRef<HTMLButtonElement, ResponsiveButtonProps>((props, ref) => {
   
   const {
      children,
      className,
      sizes,
      ...rest
   } = props
   
   return (
      <>
         <span className="inline-block sm:hidden"><Button size={sizes?.[0]} {...rest} ref={ref}>{children}</Button></span>
         <span className="hidden sm:inline-block md:hidden"><Button size={sizes?.[1]} {...rest} ref={ref}>{children}</Button></span>
         <span className="hidden sm:hidden md:inline-block"><Button size={sizes?.[2]} {...rest} ref={ref}>{children}</Button></span>
      </>
   )
   
})
