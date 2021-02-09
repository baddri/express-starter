import * as express from 'express';
import nocache from 'nocache';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class SecurityNoCacheMiddleware implements ExpressMiddlewareInterface {
  public use(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    return nocache()(req, res, next);
  }
}
