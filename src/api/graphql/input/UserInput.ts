import { Field, InputType } from 'type-graphql';
import { IsEmail } from 'class-validator';
import { IsEmailAlreadyExist, IsValidPassword } from '../../validators';

@InputType()
export class UserInput {
  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist()
  public email: string;

  @Field()
  @IsValidPassword()
  public password: string;
}
