import { ObjectId } from 'mongodb';
import { verifyToken } from '@utils/jwt';
import { Movie, movieSchema, MovieWithoutId } from 'types/movie';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectMongo } from '@utils/mongodb/connect';
import { withErrorHandler } from '@utils/with-error-handler';

const DB = 'sample_mflix';
const COLLECTION = 'movies';

async function getMovieCollection() {
  const { db } = await connectMongo();
  return db.collection<Movie>('movies');
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const movieCol = await getMovieCollection();

    const movies = await movieCol
      .find({ runtime: { $lt: 15 } })
      .sort({ title: 1 })
      .limit(100)
      .project<MovieWithoutId>({ _id: 0 })
      .toArray();

    res.json(movies);
  } else if (req.method === 'POST') {
    const movieCol = await getMovieCollection();
    const value = await movieSchema.validateAsync(req.body);
    const result = await movieCol.insertOne(value);
    res.json({
      id: result.insertedId,
      text: 'ok',
    });
  }
};

export default withErrorHandler(handler);
