import { z as zod, ZodType } from 'zod'

export type Nullable<T> = T | null | undefined

export type SiteConfig = {
   name: string
   description: string
   baseUrl: string
   domain: string
   i18n: boolean
   settingsId: string
   protectedPages: string[]
}

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

declare module '@react-pdf/renderer/lib/react-pdf.browser.es.min.js';
