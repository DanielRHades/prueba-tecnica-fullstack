import { enumType, extendType, objectType } from "nexus";
import { Transaction } from "./Transaction";

export const User = objectType({
    name: 'User',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.string('name');
        t.nonNull.string('email');
        t.string('phone');
        t.nonNull.field('role', { type: Role });
        t.list.field('transactions', {
            type: Transaction,
            async resolve(parent, _args, ctx) {
                return await ctx.prisma.user.findUnique({
                    where: { id: parent.id }
                }).transactions();
            }
        });
    },
});

export const Role = enumType({
    name: 'Role',
    members: ['ADMIN', 'USER'],
});

export const UsersQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('users', {
            type: 'User',
            resolve(_parent, _args, ctx) {
                return ctx.prisma.user.findMany();
            }
        })
    }
})

