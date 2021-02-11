import {
  MicroframeworkLoader,
  MicroframeworkSettings,
} from 'microframework-w3tec';
import { Application, Request, Response, NextFunction } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';

import { env } from '../env';
import { getErrorCode, getErrorMessage, handlingErrors } from '../lib/graphql';

export const graphqlLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined,
) => {
  if (settings) {
    const expressApp: Application = settings.getData('express_app');

    const schema = await buildSchema({
      resolvers: env.app.dirs.resolvers as [string, ...string[]],
      emitSchemaFile: env.graphql.output,
      container: Container,
    });

    handlingErrors(schema);

    // TODO: Handle validation error
    // TODO: add Documentation
    expressApp.use(
      env.graphql.route,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (request: Request, response: Response, next: NextFunction) => {
        // Build GraphQLContext
        const requestId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); // uuid-like
        const container = Container.of(requestId); // get scoped container
        const context = { requestId, container, request, response }; // create our context
        container.set('context', context); // place context or other data in container

        // Setup GraphQL server
        graphqlHTTP({
          schema,
          context,
          graphiql: env.graphql.editor,
          customFormatErrorFn: error => ({
            code: getErrorCode(error.message),
            message: getErrorMessage(error.message),
            path: error.path,
            extensions: error.extensions,
            locations: error.locations,
          }),
        })(request, response);
      },
    );
  }
};
