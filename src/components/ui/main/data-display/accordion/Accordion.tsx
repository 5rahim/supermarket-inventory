import { cn } from '@/lib/tailwind/tailwind-utils'
import { createPolymorphicComponent } from '@/utils/polymorphic-component'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva(null, {
   variants: {},
   defaultVariants: {},
})


export interface AccordionProps extends React.ComponentPropsWithRef<'div'>, VariantProps<typeof elementStyles> {

}

const _Accordion = React.forwardRef<HTMLDivElement, AccordionProps>((props, ref) => {
   
   const {
      children,
      className,
      ...rest
   } = props
   
   return (
      <>
         <div
            className={cn(
               `space-y-2`,
               elementStyles({}),
               className,
            )}
            {...rest}
            ref={ref}
         >
            {children}
         </div>
      
      </>
   )
   
})

export interface AccordionItemProps extends React.ComponentPropsWithRef<'div'> {
   title: string,
   children?: React.ReactNode
   textContent?: string
}

const AccordionItem: React.FC<AccordionItemProps> = ({ children, className, title, textContent, ...rest }) => {
   
   return (
      <details
         className={cn(
            "group [&_summary::-webkit-details-marker]:hidden",
            className,
         )}
      >
         <summary
            className="flex items-center justify-between p-4 rounded-lg cursor-pointer bg-gray-50"
         >
            <h2 className="font-medium text-gray-900">
               {title}
            </h2>
            <svg
               className="ml-1.5 h-5 w-5 flex-shrink-0 transition duration-300 group-open:-rotate-180"
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
               />
            </svg>
         </summary>
         
         {textContent && <div className="px-4 mt-4 leading-relaxed text-gray-700">
            {textContent}
         </div>}
         {children && <div>
            {children}
         </div>}
      </details>
   )
}

// @ts-ignore
_Accordion.Item = AccordionItem

export const Accordion = createPolymorphicComponent<'div', AccordionProps, {
   Item: typeof AccordionItem,
}>(_Accordion)
