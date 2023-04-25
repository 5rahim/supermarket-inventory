import { supplierSchema } from '@/pages/supermarket/suppliers'
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { Prisma, Supplier } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { v4 } from 'uuid'
import { z } from "zod"


export const supplierRouter = createTRPCRouter({
   getAll: protectedProcedure
      .input(z.object({ supermarketId: z.string().nullish() }))
      .query(async ({ ctx, input }) => {
         if (!input.supermarketId)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Supermarket id is empty' })
         
         const res = await ctx.prisma.$queryRaw<(Supplier)[]>(
            Prisma.sql`SELECT Supplier.*
                       FROM Supplier
                       WHERE Supplier.supermarketId = ${input.supermarketId}`,
         )
         
         return res
         
      }),
   create: protectedProcedure
      .input(supplierSchema)
      .mutation(async ({ ctx, input }) => {
         
         return await ctx.prisma.$executeRaw(
            Prisma.sql`
                INSERT INTO Supplier (id, name, email, supermarketId)
                VALUES (${v4()}, ${input.name}, ${input.email}, ${input.supermarketId})
            `,
         )
      }),
   update: protectedProcedure
      .input(supplierSchema)
      .mutation(async ({ ctx, input }) => {
         
         if (!input.id || !input.supermarketId)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: '' })
         
         return await ctx.prisma.$executeRaw(
            Prisma.sql`
                UPDATE Supplier
                SET name  = ${input.name},
                    email = ${input.email}
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
                       FROM Supplier
                       WHERE id = ${input.id}`,
         )
      }),
})
