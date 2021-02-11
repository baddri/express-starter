/* eslint-disable @typescript-eslint/no-unused-vars */
import { Gender } from '../../constants/Gender';
import { Field, ID, ObjectType } from 'type-graphql';
import { ObjectID } from 'typeorm';
import { Roles } from '../../constants/Roles';
import {
  UserProfileInterface,
  UserInterface,
} from '../../interfaces/UserInterface';

@ObjectType()
export class UserProfile implements UserProfileInterface {
  @Field()
  public fullName: string;

  @Field({ nullable: true })
  public imageUrl: string;

  @Field({ nullable: true })
  public birthDate: Date;

  @Field({ nullable: true })
  public gender: Gender;

  @Field({ nullable: true })
  public adress: string;
}

@ObjectType({
  description: 'User Object',
})
export class User implements UserInterface {
  @Field(type => ID)
  public id: ObjectID;

  @Field()
  public email: string;

  @Field()
  public email_verified: boolean;

  @Field({ nullable: true })
  public phone: boolean;

  @Field({ nullable: true })
  public phoneArea: string;

  @Field({ nullable: true })
  public phone_verified: boolean;

  @Field({ nullable: true })
  public locale: string;

  @Field({ nullable: true })
  public last_delivery_adress: string;

  @Field()
  public role: Roles;

  @Field(type => UserProfile)
  public userProfile: UserProfile;
}
