/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Resolver, Arg, Mutation, Authorized } from 'type-graphql';
import { Service } from 'typedi';
import {
  User as UserEntity,
  UserProfile as UserProfileEntity,
} from '../../entities/User';
import { UserService } from '../../services/UserService';
import { User, UserProfile } from '../types/User';
import {
  CreateUserInput,
  PasswordChangeInput,
  UserProfileInput,
} from '../input/UserInput';
import { Roles } from '../../constants/Roles';
import { getUserToken } from '../../../lib/jwt';
import { CurrentUser } from '../decorators/CurrentUser';

import { UserNotfoundError } from '../../errors/UserNotFoundError';
import { LoginError } from '../../errors/LoginError';
import { WrongPasswordError } from '../../errors/WrongPasswordError';

@Service()
@Resolver(of => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(returns => User)
  public create(@Arg('user') user: CreateUserInput): Promise<UserEntity> {
    const newUser = new UserEntity();
    const userProfile = new UserProfileEntity(user.fullName);
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.userProfile = userProfile;
    newUser.email_verified = false;
    newUser.role = Roles.User;
    return this.userService.create(newUser);
  }

  @Mutation(returns => String)
  public async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ): Promise<string> {
    const user = await this.userService.findUser(email);
    if (!user) throw UserNotfoundError;
    if (!(await UserEntity.comparePassword(user, password))) {
      throw LoginError;
    }
    return getUserToken(user);
  }

  @Mutation(returns => User)
  public async changePassword(
    @Arg('passwords') passwords: PasswordChangeInput,
    @CurrentUser() user: UserEntity | undefined,
  ): Promise<UserEntity> {
    if (!user) throw UserNotfoundError;
    if (!(await UserEntity.comparePassword(user, passwords.oldPassword)))
      throw WrongPasswordError;
    user.password = await UserEntity.hashPassword(passwords.newPassword);
    return await this.userService.updatePassword(user);
  }

  @Mutation(returns => User)
  public async updateProfile(
    @Arg('userProfile') userProfile: UserProfileInput,
    @CurrentUser() user: UserEntity | undefined,
  ): Promise<UserEntity> {
    if (!user) throw UserNotfoundError;
    return await this.userService.update(user, userProfile);
  }

  @Query(returns => Boolean)
  public async availableEmail(@Arg('email') email: string): Promise<boolean> {
    const user = await this.userService.findUser(email);
    if (user) return false;
    return true;
  }

  @Authorized(Roles.Admin)
  @Query(returns => [User])
  public async users(): Promise<UserEntity[]> {
    return await this.userService.find();
  }

  @Query(returns => User)
  public user(@CurrentUser() user: UserEntity | undefined): UserEntity {
    if (!user) {
      throw UserNotfoundError;
    }
    return user;
  }
}
