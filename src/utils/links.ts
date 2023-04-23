import { siteLinks, SiteLinks, SiteRoute } from '@/config/links.config'
import { siteConfig } from '@/config/site.config'
import { clientEnv } from '@/env/schema.mjs'
import { formatAppLink } from '@/utils/link-formatting'

export const rootLinkTo = (path: string, lng: string | null, subdomain?: string) => {
   
   return (process.env.NODE_ENV === 'development' ? 'http://' : 'https://') + (subdomain
      ? subdomain + '.'
      : '') + (clientEnv.NEXT_PUBLIC_BASE_DOMAIN ?? '') + ((siteConfig.i18n && lng) ? `/${lng}${path}` : path)
   
}
export const linkTo = (path: string, lng: string | null) => {
   
   return (siteConfig.i18n && lng) ? `/${lng}${path}` : path
   
}

export const siteLinkTo = (callback: (links: SiteLinks) => SiteRoute, lng: string, ...parameters: { key: string, value: string }[]) => {
   
   let returnLink = (clientEnv.NEXT_PUBLIC_BASE_URL ?? '') + `/${lng}` + callback(siteLinks).href
   
   if (parameters) {
      for (const parameter of parameters) {
         returnLink = returnLink.replaceAll(`[${parameter.key}]`, parameter.value)
      }
   }
   
   return returnLink
}

export const appLinkTo = (callback: (links: SiteLinks) => SiteRoute, lng: string, ...parameters: {
   key: string,
   value: string
}[]) => (subdomain: string | undefined) => {
   let returnLink = `/${lng}` + callback(siteLinks).href
   const isSubdomainRoute = !!subdomain || (callback(siteLinks).subdomain ?? false)
   
   return formatAppLink(returnLink, isSubdomainRoute, ...parameters)
}
