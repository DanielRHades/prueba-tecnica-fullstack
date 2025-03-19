import { prisma } from '../lib/prisma';

export const resolvers = {
    Query: {
        transactions: async () => await prisma.transaction.findMany(),
    },
}