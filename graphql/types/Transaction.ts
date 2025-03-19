import { enumType, objectType } from "nexus";
import { User } from "./User"; // Importa User para la relación

export const Transaction = objectType({
    name: 'Transaction',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.float('amount');
        t.nonNull.string('concept');
        t.nonNull.field('type', { type: TypeTransaction });
        t.nonNull.field('user', {
            type: User,
            async resolve(parent, _args, ctx) {
                const transaction = await ctx.prisma.transaction.findUnique({
                    where: { id: parent.id },
                    include: { user: true }
                });
                if (!transaction?.user) {
                    throw new Error(`User not found for transaction ${parent.id}`);
                }
                return transaction.user;
            }
        });
        t.nonNull.int('userId');
    },
});

export const TypeTransaction = enumType({
    name: 'TypeTransaction',
    members: ['INGRESO', 'EGRESO'],
});