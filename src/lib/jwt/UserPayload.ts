import { ObjectID } from 'typeorm';
import { Roles } from '../../api/constants/Roles';

export class UserPayload {
  constructor(public id: ObjectID, public email: string, public role: Roles) {}
  public iat!: number;
  public exp!: number;
}
