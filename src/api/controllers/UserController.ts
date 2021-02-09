import {
  Authorized,
  Get,
  Post,
  Body,
  Delete,
  JsonController,
  OnUndefined,
  CurrentUser,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { DeleteResult } from 'typeorm';

import { getUserToken } from '../../lib/jwt';

import { UserService } from '../services/UserService';
import { User, UserProfile } from '../entities/User';
import { Roles } from '../constants/Roles';
import { UserNotfoundError } from '../errors/UserNotFoundError';
import { WrongPasswordError } from '../errors/WrongPasswordError';
import { LoginError } from '../errors/LoginError';
import { UserExistError } from '../errors/UserExistError';

@JsonController('/users')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public async find(): Promise<User[]> {
    return await this.userService.find();
  }

  @Post('/availableuser')
  public async availableUser(
    @Body() { email }: { email: string },
  ): Promise<boolean> {
    if (await this.userService.findUser(email)) {
      return false;
    }
    return true;
  }

  @Get('/count')
  @Authorized(Roles.Admin)
  public async userCount(): Promise<number> {
    return await this.userService.userCount();
  }

  @Authorized()
  @Get('/me')
  @OnUndefined(UserNotfoundError)
  public async getMe(
    @CurrentUser({ required: true }) user: User,
  ): Promise<User> {
    return user;
  }

  @Authorized()
  @OnUndefined(WrongPasswordError)
  @Post('/update-password')
  public async updatePassword(
    @CurrentUser({ required: true }) user: User,
    @Body()
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
  ): Promise<User | undefined> {
    if (await User.comparePassword(user, oldPassword)) {
      user.password = await User.hashPassword(newPassword);
      return this.userService.updatePassword(user);
    }
    return undefined;
  }

  @Post('/login')
  @OnUndefined(LoginError)
  // @ResponseSchema(UserResponse)
  public async login(
    @Body() { email, password }: { email: string; password: string },
  ): Promise<Record<string, unknown> | undefined> {
    const user = await this.userService.findUser(email);
    if (!user) return undefined;
    if (await User.comparePassword(user, password)) {
      return {
        authToken: getUserToken(user),
        id: user.id.toString(),
        email: user.email,
        role: user.role,
        imageUrl: user.userProfile.imageUrl,
        firstName: user.userProfile.firstName,
        lastName: user.userProfile.lastName,
      };
    }
  }

  @Post()
  @OnUndefined(UserExistError)
  public async create(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ): Promise<User | undefined> {
    const userProfile = new UserProfile(body.firstName, body.lastName);
    const user = new User();
    user.userProfile = userProfile;
    user.email = body.email;
    user.password = body.password;
    return await this.userService.create(user);
  }

  /**
   * return undefined, Promise<void> or void will throws 404
   * http error. handle with OnUndefined
   */
  @Delete('/me')
  @OnUndefined(200)
  public async delete(
    @CurrentUser({ required: true }) user: User,
  ): Promise<DeleteResult> {
    return await this.userService.delete(user.email);
  }
}
