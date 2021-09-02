import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectMongo } from '@utils/mongodb/connect';
import { toJwtPayload, User, UserSchema, UserWithoutId } from 'types/user';
import { validateEnv } from '@utils/index';
import { withErrorHandler } from '@utils/with-error-handler';

const secret = validateEnv('JWT_SECRET');
const saltRound = Number(validateEnv('SALT_ROUND'));

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { name, password } = await UserSchema.validateAsync(req.body);

    const { db } = await connectMongo();
    const user = await db.collection<User>('users').findOne({
      name,
    });

    if (!user) {
      throw new Error('User does not exists');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid password');
    }

    const payload = toJwtPayload(user);
    const opt = {
      expiresIn: '1d',
      issuer: 'koko8624',
    };

    const token = jwt.sign(payload, secret, opt);
    res.json({ token });
  }
};

export default withErrorHandler(handler);
