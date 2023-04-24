import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { Prisma, Supermarket } from '@prisma/client'
import { TRPCError } from '@trpc/server'
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
   getBySlug: protectedProcedure
      .input(z.object({ slug: z.string().nullish() }))
      .query(async ({ ctx, input }) => {
         if (!input.slug)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Slug is empty' })
         
         const supermarkets = await ctx.prisma.$queryRaw<Supermarket[]>(
            Prisma.sql`SELECT * FROM Supermarket WHERE slug = ${input.slug} LIMIT 1`
         )
         
         return supermarkets?.[0]
         
      }),
})
