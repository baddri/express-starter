import {
  MicroframeworkLoader,
  MicroframeworkSettings,
} from 'microframework-w3tec';
import { createConnection, ConnectionOptions } from 'typeorm';
import { env } from '../env';

export const typeormLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined,
) => {
  const connection = await createConnection({
    type: env.db.type,
    port: env.db.port,
    host: env.db.host,
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    synchronize: env.db.synchronize,
    logging: [env.db.logging],
    logger: env.db.logger,
    entities: env.app.dirs.entities,
  } as ConnectionOptions);

  if (settings) {
    settings.setData('connection', connection);
    settings.onShutdown(() => connection.close());
  }
};
