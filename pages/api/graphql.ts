// pages/api/graphql.ts
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { schema } from '../../graphql/schema';
import { Context } from '../../graphql/context';
import { prisma } from '../../lib/prisma';

const apolloServer = new ApolloServer<Context>({ schema });

export default startServerAndCreateNextHandler(apolloServer, {
    context: async (req, res) => ({ req, res, prisma }),
});