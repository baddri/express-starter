/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';

// global interceptor example
@Interceptor()
export class ExampleInterceptor implements InterceptorInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(action: Action, content: any): any {
    // do something
    // Action object has response, request and next method
    return content;
  }
}
