import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { DeepPartial, DeleteResult } from 'typeorm';

import {
  EventDispatcher,
  EventDispatcherInterface,
} from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { User, UserProfile } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { UserEvent } from '../subscribers/events';

@Service()
export class UserService {
  constructor(
    @OrmRepository() private userRepository: UserRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  public async userCount(): Promise<number> {
    return await this.userRepository.count();
  }

  public async find(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async findUser(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ email });
  }

  public async create(user: User): Promise<User> {
    const newUser = await this.userRepository.save(user);
    this.eventDispatcher.dispatch(UserEvent.Created, newUser);
    return newUser;
  }

  public async update(
    user: User,
    update: DeepPartial<UserProfile>,
  ): Promise<User> {
    this.userRepository.merge(user, { userProfile: update });
    return await this.userRepository.save(user);
  }

  public async updatePassword(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  public async delete(email: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ email });
  }
}
