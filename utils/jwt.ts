import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextApiRequest } from 'next';

function getTokenFromHeader(req: NextApiRequest): string | null {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

// Custom Authentication Middleware
export function verifyToken(req: NextApiRequest, secret: string): string | JwtPayload | Error {
  const token = getTokenFromHeader(req);

  if (!token) {
    return new Error('Authorization token not found');
  }

  const payload = jwt.verify(token, secret);
  return payload;
}
