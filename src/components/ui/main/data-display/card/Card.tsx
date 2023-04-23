import { cn } from '@/lib/tailwind/tailwind-utils'
import { createPolymorphicComponent } from '@/utils/polymorphic-component'
import { IconDisplay } from '@ui/main/data-display/icon-display/IconDisplay'
import { Paper } from '@ui/main/layout/paper/Paper'
import { Stack } from '@ui/main/layout/stack/Stack'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva(null, {
   variants: {},
   defaultVariants: {},
})


export interface CardProps extends React.ComponentPropsWithRef<'div'>, VariantProps<typeof elementStyles> {

}

const _Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
   
   const {
      children,
      className,
      ...rest
   } = props
   
   return (
      <>
         <Paper
            className={cn(
               ``,
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


export interface CardBodyProps extends React.ComponentPropsWithRef<'div'> {
}

const CardBody: React.FC<CardBodyProps> = ({ children, className, ...rest }) => {
   return (
      <Stack className={cn("p-4 text-gray-800 gap-2", className)} {...rest}>{children}</Stack>
   )
}

export interface CardActionProps extends React.ComponentPropsWithRef<'div'> {
}

const CardAction: React.FC<CardActionProps> = ({ children, className, ...rest }) => {
   return (
      <Stack className={cn("flex w-full mt-2", className)} {...rest}>{children}</Stack>
   )
}

export interface CardTitleProps extends React.ComponentPropsWithRef<'h2'> {
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className, ...rest }) => {
   return (
      <h2 className={cn("flex items-center gap-2 font-bold text-xl md:text-2xl", className)} {...rest}>{children}</h2>
   )
}


export interface CardIconProps extends React.ComponentPropsWithRef<'div'> {
   icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>
}

const CardIcon: React.FC<CardIconProps> = ({ children, icon, className, ...rest }) => {
   return (
      <IconDisplay className={cn("mx-auto md:mx-0", className)} icon={icon} {...rest} />
   )
}

// @ts-ignore
_Card.Body = CardBody
// @ts-ignore
_Card.Icon = CardIcon
// @ts-ignore
_Card.Title = CardTitle
// @ts-ignore
_Card.Action = CardAction

export const Card = createPolymorphicComponent<'div', CardProps, {
   Body: typeof CardBody,
   Icon: typeof CardIcon,
   Title: typeof CardTitle,
   Action: typeof CardAction
}>(_Card)
