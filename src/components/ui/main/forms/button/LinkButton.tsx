import { Button, ButtonProps } from '@ui/main/forms/button/Button'
import Link from 'next/link'
import React from 'react'

interface LinkButtonProps {
   to: string
   parameters?: { key: string, value: string }[]
}

const LinkButton: React.FC<LinkButtonProps & ButtonProps> = (props) => {
   
   const { to, parameters, ...rest } = props
   
   return (
      <>
         <Link href={to} className="[display:contents;]">
            <Button {...rest} />
         </Link>
      </>
   )
   
}

export default LinkButton
