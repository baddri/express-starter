import 'reflect-metadata';

import { bootstrapMicroframework } from 'microframework-w3tec';

import { Logger } from './lib/logger';
import { banner } from './lib/banner';

import { iocLoader } from './loaders/iocLoader';
import { eventDispatchLoader } from './loaders/eventDispatchLoader';
import { typeormLoader } from './loaders/typeormLoader';
import { expressLoader } from './loaders/expressLoader';
import { homeLoader } from './loaders/homeLoader';
import { graphqlLoader } from './loaders/graphqlLoader';
// import { publicLoader } from 'loaders/publicLoader';

const log = new Logger(__filename);

bootstrapMicroframework({
  loaders: [
    iocLoader,
    eventDispatchLoader,
    typeormLoader,
    expressLoader,
    homeLoader,
    graphqlLoader,
    // publicLoader
  ],
})
  .then(() => banner(log))
  .catch(error => log.error('Application is crashed: ' + error));
