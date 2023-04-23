import React from 'react'

interface ShowOnlyProps {
   children?: React.ReactNode
   when: boolean | undefined
}

const ShowOnly: React.FC<ShowOnlyProps> = (props: any) => {
   
   const { children, when, ...rest } = props
   
   return (
      <>
         {when ? children : null}
      </>
   )
   
}

export default ShowOnly
