import bcrypt from 'bcrypt';
import { connectMongo } from '@utils/mongodb/connect';
import { withErrorHandler } from '@utils/with-error-handler';
import { NextApiRequest, NextApiResponse } from 'next';
import { validateEnv } from '@utils/index';
import { User, UserSchema, UserWithoutId } from 'types/user';

const saltRound = Number(validateEnv('SALT_ROUND'));

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const body: UserWithoutId = await UserSchema.validateAsync(req.body);

    const { db } = await connectMongo();
    const userCol = db.collection<User>('users');

    if (await userCol.findOne({ name: body.name })) {
      throw new Error('Duplicated username');
    }

    body.password = await bcrypt.hash(body.password, saltRound); // encrypt password
    const result = await userCol.insertOne(body);
    res.json({
      id: result.insertedId,
    });
  }
};

export default withErrorHandler(handler);
