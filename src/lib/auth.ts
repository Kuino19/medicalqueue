import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET is not set in environment variables');
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signJwt(payload: object) {
  return jwt.sign(payload, secret!, { expiresIn: '1d' });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, secret!);
    return decoded;
  } catch (error) {
    return null;
  }
}
