'use client'

import RawLink from '@/components/ui/shared/links/RawLink'
import { Button, ButtonProps } from '@ui/main/forms/button/Button'
import React from 'react'

interface LinkButtonProps {
   to: string
   parameters?: { key: string, value: string }[]
}

const LinkButton: React.FC<LinkButtonProps & ButtonProps> = (props) => {
   
   const { to, parameters, ...rest } = props
   
   return (
      <>
         <RawLink href={to} className="[display:contents;]">
            <Button {...rest} />
         </RawLink>
      </>
   )
   
}

export default LinkButton
