import { Context } from "./context";

export const resolvers = {
    DateTime: {
        serialize: (value: Date) => value.toISOString(),
        parseValue: (value: string) => new Date(value),
    },
    Query: {
        transactions: async (_parent: any, _args: any, ctx: Context) => await ctx.prisma.transaction.findMany(),
        users: async (_parent: any, _args: any, ctx: Context) => await ctx.prisma.user.findMany(),
    },
    Mutation: {
        updateUser: async (_parent: any, args: any, ctx: Context) => await ctx.prisma.user.update({
            where: { id: args.id },
            data: {
                name: args.name,
                role: args.role,
            }
        }),
        createTransaction: async (_parent: any, args: any, ctx: Context) => await ctx.prisma.transaction.create({
            data: {
                amount: args.amount,
                concept: args.concept,
                type: args.type,
                date: new Date(args.date),
                userId: args.userId
            },
        }),
    },
}