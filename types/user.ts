import { ObjectId } from 'mongodb';
import Joi from 'joi';
import { JwtPayload } from 'jsonwebtoken';

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
}

export type UserWithoutId = Omit<User, '_id'>;

export const UserSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string().required(),
});

export interface CustomJwtPayload extends JwtPayload {
  _id: string;
  name: string;
  email: string;
}

export function toJwtPayload(user: User, jwt?: JwtPayload): CustomJwtPayload {
  return {
    ...jwt,
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}
