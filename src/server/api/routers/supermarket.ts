import { supermarketSchema } from '@/pages/supermarket'
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { Prisma, Supermarket } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { uuid } from '@zag-js/utils'
import { z } from "zod"

export const supermarketRouter = createTRPCRouter({
   getUserSupermarket: protectedProcedure
      .input(z.object({ userId: z.string().nullish() }))
      .query(async ({ ctx, input }) => {
         if (!input.userId)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'User id is empty' })
         
         const supermarkets = await ctx.prisma.$queryRaw<Supermarket[]>(
            Prisma.sql`SELECT * FROM Supermarket WHERE userId = ${input.userId} LIMIT 1`
         )
         
         return supermarkets?.[0] ?? null
         
      }),
   testJoin: protectedProcedure
      .input(z.object({ userId: z.string().nullish() }))
      .query(async ({ ctx, input }) => {
         if (!input.userId)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'User id is empty' })
         
         const supermarkets = await ctx.prisma.$queryRaw<Supermarket[]>(
            Prisma.sql`SELECT S.name Sname, U.name Uname FROM User as U JOIN Supermarket as S ON S.userId = U.id WHERE U.id = ${input.userId}`
         )
         
         return supermarkets
         
      }),
   create: protectedProcedure
      .input(
         supermarketSchema
      )
      .mutation(async ({ ctx, input }) => {
         const userId = ctx.session.user.id;
         
         const supermarket = await ctx.prisma.$executeRaw(
            Prisma.sql`INSERT INTO Supermarket (id, name, userId) VALUES (${uuid()}, ${input.name}, ${userId})`
         )
         
         return supermarket;
      }),
})
