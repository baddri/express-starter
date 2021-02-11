import {
  MicroframeworkLoader,
  MicroframeworkSettings,
} from 'microframework-w3tec';
import { Application } from 'express';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { ApolloServer } from 'apollo-server-express';
import { Connection } from 'typeorm';

import { env } from '../env';
import { graphqlAuthChecker } from '../auth/graphqlAuthChecker';

export const apolloLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined,
) => {
  if (settings) {
    const expressApp: Application = settings.getData('express_app');
    const connection: Connection = settings.getData('connection');

    const schema = await buildSchema({
      resolvers: env.app.dirs.resolvers as [string, ...string[]],
      emitSchemaFile: env.graphql.output,
      authChecker: graphqlAuthChecker(connection),
      container: Container,
    });

    const apollo = new ApolloServer({
      schema,
      context: ({ req, res }) => ({
        req,
        res,
      }),
    });

    apollo.applyMiddleware({ app: expressApp, path: env.graphql.route });
  }
};
