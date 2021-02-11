import { ObjectID } from 'typeorm';
import { Gender } from '../constants/Gender';
import { Roles } from '../constants/Roles';

export interface UserProfileInterface {
  fullName: string;
  imageUrl: string;
  gender: Gender;
  birthDate: Date;
  adress: string;
}

export interface UserInterface {
  id: ObjectID;
  email: string;
  email_verified: boolean;
  phone: boolean;
  phoneArea: string;
  phone_verified: boolean;
  locale: string;
  last_delivery_adress: string;
  role: Roles;
  userProfile: UserProfileInterface;
}
