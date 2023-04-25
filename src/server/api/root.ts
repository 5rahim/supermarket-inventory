import { exampleRouter } from "@/server/api/routers/example"
import { inventoryRouter } from '@/server/api/routers/inventory'
import { supermarketRouter } from '@/server/api/routers/supermarket'
import { supplierRouter } from '@/server/api/routers/supplier'
import { createTRPCRouter } from "@/server/api/trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
   example: exampleRouter,
   supermarket: supermarketRouter,
   inventory: inventoryRouter,
   supplier: supplierRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter;
