import bcript from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Entity,
  Column,
  ObjectIdColumn,
  ObjectID,
} from 'typeorm';
import {
  UserInterface,
  UserProfileInterface,
} from '../interfaces/UserInterface';
import { Gender } from '../constants/Gender';
import { Roles } from '../constants/Roles';

export class UserProfile implements UserProfileInterface {
  constructor(fullName: string) {
    this.fullName = fullName;
  }

  @Column()
  public fullName: string;

  @Column()
  public imageUrl: string;

  @Column()
  public gender: Gender;

  @Column()
  public birthDate: Date;

  @Column()
  public adress: string;
}

@Entity({ name: 'users' })
export class User implements UserInterface {
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  public email: string;

  @Column()
  public email_verified: boolean;

  @Column()
  public phone: boolean;

  @Column()
  public phoneArea: string;

  @Column()
  public phone_verified: boolean;

  @Column()
  public locale: string;

  @Column()
  public last_delivery_adress: string;

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
    this.password = await User.hashPassword(this.password);
  }

  public toString(): string {
    return `User : ${this.userProfile.fullName}`;
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
