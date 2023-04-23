import { clientEnv } from '@/env/schema.mjs'

export const formatFullPath = (path: string) => {
   if (process.env.NODE_ENV === 'development')
      return `http://${clientEnv.NEXT_PUBLIC_BASE_DOMAIN}${path}`
   return `https://${clientEnv.NEXT_PUBLIC_BASE_DOMAIN}${path}`
}
export const formatRelativePath = (path: string) => {
   return path.replace('http://', '').replace('https://', '').replace(clientEnv.NEXT_PUBLIC_BASE_DOMAIN ?? '', '')
}
/**
 * Handle subdomains and custom applications
 */
export const formatAppLink = (href: string, isSubdomainRoute: boolean, ...parameters: { key: string, value: string }[]) => {
   
   /**
    * Transform absolute path into relative path when there's a subdomain
    */
   if (isSubdomainRoute) {
      let returnLink = href
      
      // Detect the presence of an application
      const isAppLink =
         returnLink.includes(`/s/[sid]`) ||
         returnLink.includes(`/r/[rid]`) ||
         returnLink.includes(`/agricwork`)
      
      // Remove the leading path from the returned link
      returnLink = returnLink.replace(`/s/[sid]`, ``)
                             .replace(`/r/[rid]`, '')
                             .replace(`/agricwork`, '')
      
      for (const parameter of parameters) {
         returnLink = returnLink.replaceAll(`[${parameter.key}]`, parameter.value)
      }
      
      return isAppLink ? returnLink : formatFullPath(returnLink)
   }
   
   /**
    * Default behavior
    */
   let returnLink = href
   
   if (parameters) {
      for (const parameter of parameters) {
         returnLink = returnLink.replaceAll(`[${parameter.key}]`, parameter.value)
      }
   }
   
   // When there's "undefined" in the path, it is indicative that there's a subdomain.
   // Remove the undefined part of the link and return the relative path
   returnLink.replace(`/s/undefined`, ``).replace(`/r/undefined`, '').replace('/undefined', '')
   
   return returnLink
}
