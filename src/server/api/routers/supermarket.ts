import { supermarketSchema } from '@/pages/supermarket'
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { Prisma, Supermarket } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { v4 } from 'uuid'
import { z } from "zod"

export const bigIntToNumber = (v: any) => typeof v === "bigint" ? Number((v as any).toString()) : v

export const supermarketRouter = createTRPCRouter({
   getUserSupermarket: protectedProcedure
      .input(z.object({ userId: z.string().nullish() }))
      .query(async ({ ctx, input }) => {
         if (!input.userId)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'User id is empty' })
         
         const supermarkets = await ctx.prisma.$queryRaw<Supermarket[]>(
            Prisma.sql`
                SELECT *
                FROM Supermarket
                WHERE userId = ${input.userId}
                LIMIT 1`,
         )
         
         return supermarkets?.[0] ?? null
         
      }),
   getStats: protectedProcedure
      .input(z.object({ supermarketId: z.string().nullish() }))
      .query(async ({ ctx, input }) => {
         if (!input.supermarketId)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'User id is empty' })
         
         // const res = await ctx.prisma.$queryRaw<any>(
         //    Prisma.sql`
         //        SELECT COUNT(Product.id) productCount
         //        FROM Product
         //        WHERE Product.supermarketId = ${input.supermarketId}
         //    `,
         // )
         
         const res2 = await ctx.prisma.$queryRaw<any>(
            Prisma.sql`
                SELECT COUNT(P.id) productCount, SUM(SL.quantity * P.cost) revenue
                FROM Supermarket S
                LEFT JOIN Product P ON P.supermarketId = S.id
                LEFT JOIN Sale SL ON SL.supermarketId = S.id
                WHERE S.id = ${input.supermarketId}
            `,
         )
         
         console.log(res2)
         
         const status: { productCount: number, orderCount: number, revenue: number } = {
            productCount: bigIntToNumber(res2[0].productCount),
            orderCount: bigIntToNumber(res2[0].orderCount) ?? 0,
            revenue: bigIntToNumber(res2[0].revenue) ?? 0,
         }
         
         return status
         
      }),
   create: protectedProcedure
      .input(
         supermarketSchema,
      )
      .mutation(async ({ ctx, input }) => {
         const userId = ctx.session.user.id
         
         const supermarket = await ctx.prisma.$executeRaw(
            Prisma.sql`INSERT INTO Supermarket (id, name, userId)
                       VALUES (${v4()}, ${input.name}, ${userId})`,
         )
         
         return supermarket
      }),
})
