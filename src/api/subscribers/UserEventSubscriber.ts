import { EventSubscriber, On } from 'event-dispatch';

import { Logger } from '../../lib/logger';
import { User } from '../entities/User';
import { UserEvent } from './events';

const log = new Logger(__filename);

@EventSubscriber()
export class UserEventSubscriber {
  @On(UserEvent.Created)
  public onUserCreate(user: User): void {
    log.info(`${user.toString()} created!`);
  }
}
