import clientPromise from '.';

export const connectMongo = async (dbName: string = 'sample_mflix') => ({
  db: (await clientPromise).db(dbName),
});
