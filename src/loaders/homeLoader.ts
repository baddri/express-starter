import {
  MicroframeworkLoader,
  MicroframeworkSettings,
} from 'microframework-w3tec';
import { Application, Request, Response, NextFunction } from 'express';

import { env } from '../env';

export const homeLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined,
) => {
  if (settings) {
    const expressApp: Application = settings.getData('express_app');

    expressApp.get(
      env.app.routePrefix,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (req: Request, res: Response, next: NextFunction) => {
        return res.json({
          name: env.app.name,
          version: env.app.version,
          description: env.app.description,
        });
      },
    );
  }
};
