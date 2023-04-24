import { api } from '@/utils/api'
import { useSession } from 'next-auth/react'

export const useSupermarket = () => {
   
   const { data: session } = useSession()
   const { data: supermarket, status } = api.supermarket.getUserSupermarket.useQuery({ userId: session?.user.id })
   
   return { supermarket, isLoading: status === 'loading', isEmpty: status === 'success' && !supermarket }
   
}
