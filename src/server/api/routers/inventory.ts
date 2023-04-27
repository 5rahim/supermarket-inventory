import { IProduct, productSchema } from '@/pages/supermarket/inventory'
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { v4 } from 'uuid'
import { z } from "zod"

export const inventoryRouter = createTRPCRouter({
   getAllProducts: protectedProcedure
      .input(z.object({ supermarketId: z.string().nullish() }))
      .query(async ({ ctx, input }) => {
         if (!input.supermarketId)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Supermarket id is empty' })
         
         const products = await ctx.prisma.$queryRaw<IProduct[]>(
            Prisma.sql`SELECT Product.*, Supplier.name supplierName, Category.name categoryName
                       FROM Product
                                LEFT JOIN Supplier ON Supplier.id = Product.supplierId
                                LEFT JOIN Category ON Category.id = Product.categoryId
                       WHERE Product.supermarketId = ${input.supermarketId}
                       GROUP BY Product.id
            `,
         )
         
         return products
         
      }),
   getProductCount: protectedProcedure
      .input(z.object({ supermarketId: z.string() }))
      .query(async ({ ctx, input }) => {
         if (!input.supermarketId)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Supermarket id is empty' })
         
         return await ctx.prisma.$queryRaw<number>(
            Prisma.sql`SELECT COUNT(id)
                       FROM Product
                       WHERE supermarketId = ${input.supermarketId}`,
         )
         
      }),
   getLowStockItem: protectedProcedure
      .input(z.object({ supermarketId: z.string(), threshold: z.number() }))
      .query(async ({ ctx, input }) => {
         if (!input.supermarketId)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Supermarket id is empty' })
         
         return await ctx.prisma.$queryRaw<{ itemName: string, itemQuantity: string, supplierName: string, supplierEmail: string }[]>(
            Prisma.sql`SELECT p.name itemName, p.quantityLeft itemQuantity, s.name supplierName, s.email supplierEmail
                       FROM Product p
                                LEFT JOIN Supplier s ON s.id = p.supplierId
                       WHERE p.supermarketId = ${input.supermarketId}
                         AND p.quantityLeft < ${input.threshold}
            `,
         )
         
      }),
   create: protectedProcedure
      .input(productSchema)
      .mutation(async ({ ctx, input }) => {
         
         return await ctx.prisma.$executeRaw(
            Prisma.sql`
                INSERT INTO Product (id, code, name, description, unit, cost, quantityLeft, supplierId, categoryId, supermarketId)
                VALUES (${v4()}, ${input.code}, ${input.name}, ${input.description}, ${input.unit}, ${input.cost}, ${input.quantityLeft},
                        ${input.supplierId}, ${input.categoryId}, ${input.supermarketId})
            `,
         )
      }),
   update: protectedProcedure
      .input(productSchema)
      .mutation(async ({ ctx, input }) => {
         
         if (!input.id || !input.supermarketId)
            new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: '' })
         
         return await ctx.prisma.$executeRaw(
            Prisma.sql`
                UPDATE Product
                SET code         = ${input.code},
                    name         = ${input.name},
                    description  = ${input.description},
                    unit         = ${input.unit},
                    cost         = ${input.cost},
                    quantityLeft = ${input.quantityLeft},
                    supplierId   = ${input.supplierId},
                    categoryId   = ${input.categoryId}
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
                       FROM Product
                       WHERE id = ${input.id}`,
         )
      }),
})
