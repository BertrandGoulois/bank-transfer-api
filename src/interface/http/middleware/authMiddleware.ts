import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Extend Express Request to include user
interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as string | JwtPayload;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;
