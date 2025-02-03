import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // TODO: verify the token exists and add the user data to the request object

  // Step 1: Get the token from Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // Format: "Bearer token"

  if (!token) {
      return res.status(401).json({ message: 'No token provided' });
  }

  // Step 2: Verify the token using your secret or public key
  jwt.verify(token, process.env.JWT_SECRET, (err:any, decoded:any) => {
      if (err) {
          return res.status(403).json({ message: 'Token is not valid' });
      }

      // Step 3: Add decoded user data to the request object
      req.user = decoded;  // `decoded` usually contains the user info or claims

      // Step 4: Continue to the next middleware or route handler
      next();
  });
};
