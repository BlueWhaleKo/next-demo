import { ObjectId } from 'mongodb';
import { verifyToken } from '@utils/jwt';
import { Movie, movieSchema, MovieWithoutId } from 'types/movie';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectMongo } from '@utils/mongodb/connect';
import Joi from 'joi';
import { withErrorHandler } from '@utils/with-error-handler';

const DB = 'sample_mflix';
const COLLECTION = 'movies';

async function getMovieCollection() {
  const { db } = await connectMongo();
  return db.collection<Movie>('movies');
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const movieId = await Joi.string().validateAsync(req.query.movieId);

  if (req.method === 'GET') {
    const movieCol = await getMovieCollection();
    const movie = await movieCol.findOne(
      { _id: new ObjectId(movieId) },
      { projection: { _id: 0 } },
    );

    if (!movie) {
      throw new Error('movie not exists');
    }

    res.json(movie);
  }
};

export default withErrorHandler(handler);
