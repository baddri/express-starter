import * as express from 'express';
import helmet from 'helmet';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class SecurityMiddleware implements ExpressMiddlewareInterface {
  public use(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    return helmet({
      contentSecurityPolicy: false,
    })(req, res, next);
  }
}
