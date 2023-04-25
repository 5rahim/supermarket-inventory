import { cn } from '@/lib/tailwind/tailwind-utils'
import "@/styles/globals.css"

import { api } from "@/utils/api"
import { Inter } from '@next/font/google'
import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { type AppType } from "next/app"
import { Toaster } from 'react-hot-toast'

const inter = Inter({
   subsets: ["latin"],
   variable: "--font-inter",
   display: 'swap',
})

const MyApp: AppType<{ session: Session | null }> = ({
   Component,
   pageProps: { session, ...pageProps },
}) => {
   return (
      <SessionProvider session={session}>
         <main
            className={cn(
               "bg-white font-sans text-gray-900 antialiased",
               inter.variable,
            )}
         >
            <Component {...pageProps} />
            <Toaster position="bottom-center" />
         </main>
      </SessionProvider>
   )
}

export default api.withTRPC(MyApp)
