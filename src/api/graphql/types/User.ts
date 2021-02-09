/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from 'type-graphql';
import { ObjectID } from 'typeorm';

@ObjectType()
class UserProfile {
  @Field()
  public firstName: string;

  @Field()
  public lastName: string;
}

// tslint:disable-next-line: max-classes-per-file
@ObjectType({
  description: 'User Object.',
})
export class User {
  @Field(type => ID)
  public id: ObjectID;

  @Field()
  public email: string;

  @Field(type => UserProfile)
  public userProfile: UserProfile;
}
