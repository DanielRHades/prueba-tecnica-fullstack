import { enumType, extendType, objectType, nonNull, intArg, stringArg, arg } from "nexus";
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

export const UpdateUserMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('updateUser', {
            type: 'User',
            args: {
                id: nonNull(intArg()),
                name: stringArg(),
                role: arg({ type: Role }),
            },
            async resolve(_parent, args, ctx) {
                const { id, name, role } = args;

                if (!name && !role) {
                    throw new Error('Debes proporcionar al menos un nombre o un rol para actualizar.');
                }

                return ctx.prisma.user.update({
                    where: { id },
                    data: {
                        name: name || undefined,
                        role: role || undefined,
                    },
                });
            },
        });
    },
});