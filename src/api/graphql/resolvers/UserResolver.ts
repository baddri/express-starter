/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Resolver, Arg, Mutation } from 'type-graphql';
import { Service } from 'typedi';
import { User as UserEntity, UserProfile } from '../../entities/User';
import { UserService } from '../../services/UserService';
import { User } from '../types/User';
import { UserInput } from '../input/UserInput';

@Service()
@Resolver(of => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(returns => [User])
  public async users(): Promise<UserEntity[]> {
    return await this.userService.find();
  }

  @Query(returns => User)
  public async user(
    @Arg('email') email: string,
  ): Promise<UserEntity | undefined> {
    return await this.userService.findUser(email);
  }

  @Mutation(returns => User)
  // @Authorized()
  public create(@Arg('user') user: UserInput): Promise<UserEntity> {
    const newUser = new UserEntity();
    const userProfile = new UserProfile(user.firstName, user.lastName);
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.userProfile = userProfile;
    return this.userService.create(newUser);
  }
}
