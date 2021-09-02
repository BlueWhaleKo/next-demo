import type { NextApiRequest, NextApiResponse } from 'next';
import { withErrorHandler } from '@utils/with-error-handler';
import { connectMongo } from '@utils/mongodb/connect';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { db } = await connectMongo('sample_mflix');

    const movie = await db.collection('movies').findOne();
    return res.json({ status: 'ok', movie });
  }
};

export default withErrorHandler(handler);
