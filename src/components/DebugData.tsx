import React from 'react'

interface DebugDataProps {
   children?: React.ReactNode
    data: any
}

const DebugData: React.FC<DebugDataProps> = (props) => {
   
   const { children,  data, ...rest } = props
   
   return (
      <pre>
          {JSON.stringify(data, null, 2)}
      </pre>
   )
   
}

export default DebugData
