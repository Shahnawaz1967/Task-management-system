import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?:User
}
type User ={
  id:number
}
const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = { id: parseInt((decoded as User).id.toString() )};
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

export default authenticate;
