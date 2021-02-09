import bcript from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Entity,
  Column,
  ObjectIdColumn,
  ObjectID,
} from 'typeorm';
import { Roles } from '../constants/Roles';

export interface UserProfileInterface {
  firstName: string;
  lastName: string;
}

export class UserProfile {
  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public imageUrl: string;
}

@Entity({ name: 'users' })
export class User {
  // mongodb usr ObjectIdColumn instead Primary Column
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  public email: string;

  @Column()
  public role: Roles;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Column(type => UserProfile)
  public userProfile: UserProfile;

  @Column()
  @Exclude()
  public password: string;

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    this.role = Roles.User;
    this.password = await User.hashPassword(this.password);
  }

  public toString(): string {
    return `User : ${this.userProfile.firstName} ${this.userProfile.lastName}`;
  }

  public static hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcript.hash(password, 10, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  }

  public static comparePassword(
    user: User,
    password: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcript.compare(password, user.password, (err, match) => {
        if (err) {
          return reject(err);
        }
        resolve(match === true);
      });
    });
  }
}
