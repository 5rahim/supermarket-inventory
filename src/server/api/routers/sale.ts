import { ISale, saleSchema } from '@/pages/supermarket/sales'
import { bigIntToNumber } from '@/server/api/routers/supermarket'
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { v4 } from 'uuid'
import { z } from "zod"


export const saleRouter = createTRPCRouter({
   getAll: protectedProcedure
      .input(z.object({ supermarketId: z.string().nullish() }))
      .query(async ({ ctx, input }) => {
         if (!input.supermarketId)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Supermarket id is empty' })
         
         const res = await ctx.prisma.$queryRaw<ISale[]>(
            Prisma.sql`SELECT Sale.*, Product.name as productName, (Product.cost * Sale.quantity) total
                       FROM Sale
                                LEFT JOIN Product ON Product.id = Sale.productId
                       WHERE Sale.supermarketId = ${input.supermarketId}`,
         )
         
         const sales = res.map(n => ({
            ...n,
            total: bigIntToNumber(n.total)
         }))
         
         return sales
         
      }),
   create: protectedProcedure
      .input(saleSchema)
      .mutation(async ({ ctx, input }) => {
         
         await ctx.prisma.$executeRaw(
            Prisma.sql`
                INSERT INTO Sale (id, productId, supermarketId, quantity, saleDate)
                VALUES (${v4()}, ${input.productId}, ${input.supermarketId}, ${input.quantity}, ${input.saleDate})
            `,
         )
         
         await ctx.prisma.$executeRaw(
            Prisma.sql`
                UPDATE Product
                SET quantityLeft = Product.quantityLeft - ${input.quantity}
                WHERE id = ${input.productId}
            `,
         )
         
         return null
         
      }),
   update: protectedProcedure
      .input(saleSchema)
      .mutation(async ({ ctx, input }) => {
         
         if (!input.id || !input.supermarketId)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: '' })
         
         return await ctx.prisma.$executeRaw(
            Prisma.sql`
                UPDATE Sale
                SET productId  = ${input.productId},
                    supermarketId = ${input.supermarketId},
                    saleDate = ${input.saleDate}
                WHERE id = ${input.id}
            `,
         )
      }),
   delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
         
         if (!input.id)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: '' })
         
         const res = await ctx.prisma.$queryRaw<ISale[]>(
            Prisma.sql`SELECT *
                       FROM Sale
                       WHERE Sale.id = ${input.id} LIMIT 1`,
         )
         
         if(res[0]) {
            await ctx.prisma.$executeRaw(
               Prisma.sql`DELETE
                       FROM Sale
                       WHERE id = ${input.id}`,
            )
            
            await ctx.prisma.$executeRaw(
               Prisma.sql`
                UPDATE Product
                SET quantityLeft = Product.quantityLeft + ${res[0].quantity}
                WHERE id = ${res[0].productId}
            `,
            )
         }
         
         return null
         
      }),
})
