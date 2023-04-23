import { z as zod, ZodType } from 'zod'

export type Nullable<T> = T | null | undefined

export type MaybeRenderProp<P> =
   | React.ReactNode
   | ((props: P) => React.ReactNode)

export type InferType<S extends ZodType<any, any, any>> = zod.infer<S>

declare global {
   namespace JSX {
      interface Element extends React.ReactElement<any, any> {
      }
   }
}
