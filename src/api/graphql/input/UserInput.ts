import { Field, InputType } from 'type-graphql';
import { IsEmail } from 'class-validator';
import { IsEmailAlreadyExist, IsValidPassword } from '../../validators';
import { UserProfileInterface } from '../../interfaces/UserInterface';
import { Gender } from '../../constants/Gender';

@InputType()
export class CreateUserInput {
  @Field()
  public fullName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist()
  public email: string;

  @Field()
  @IsValidPassword()
  public password: string;
}

@InputType()
export class PasswordChangeInput {
  @Field()
  public oldPassword: string;

  @Field()
  @IsValidPassword()
  public newPassword: string;
}

@InputType()
export class UserProfileInput implements UserProfileInterface {
  @Field({ nullable: true })
  public fullName: string;

  @Field({ nullable: true })
  public imageUrl: string;

  @Field({ nullable: true })
  public gender: Gender;

  @Field({ nullable: true })
  public birthDate: Date;

  @Field({ nullable: true })
  public adress: string;
}
