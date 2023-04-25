import { categorySchema } from '@/pages/supermarket/categories'
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { Category, Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { v4 } from 'uuid'
import { z } from "zod"


export const categoryRouter = createTRPCRouter({
   getAll: protectedProcedure
      .input(z.object({ supermarketId: z.string().nullish() }))
      .query(async ({ ctx, input }) => {
         if (!input.supermarketId)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Supermarket id is empty' })
         
         const res = await ctx.prisma.$queryRaw<(Category)[]>(
            Prisma.sql`SELECT Category.*
                       FROM Category
                       WHERE Category.supermarketId = ${input.supermarketId}`,
         )
         
         return res
         
      }),
   create: protectedProcedure
      .input(categorySchema)
      .mutation(async ({ ctx, input }) => {
         
         return await ctx.prisma.$executeRaw(
            Prisma.sql`
                INSERT INTO Category (id, name, supermarketId)
                VALUES (${v4()}, ${input.name}, ${input.supermarketId})
            `,
         )
      }),
   update: protectedProcedure
      .input(categorySchema)
      .mutation(async ({ ctx, input }) => {
         
         if (!input.id || !input.supermarketId)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: '' })
         
         return await ctx.prisma.$executeRaw(
            Prisma.sql`
                UPDATE Category
                SET name  = ${input.name},
                WHERE id = ${input.id}
            `,
         )
      }),
   delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
         
         if (!input.id)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: '' })
         
         return await ctx.prisma.$executeRaw(
            Prisma.sql`DELETE
                       FROM Category
                       WHERE id = ${input.id}`,
         )
      }),
})
