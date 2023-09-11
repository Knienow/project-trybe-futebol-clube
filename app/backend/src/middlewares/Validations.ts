import { NextFunction, Request, Response } from 'express';
import JWT from '../utils/JWT';

class Validations {
  static validateLogin(req: Request, res: Response, next: NextFunction): Response | void {
    // requisito 08
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (password.length < 6) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    next();
  }

  static validateToken(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'Token not found' });
    }
    try {
      const bearer = authorization.replace('Bearer ', '');
      const decoded = JWT.verify(bearer);
      console.log('teste middleware', decoded);
      req.body.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }

    // const validToken = await JWT.verify(token);
    // if (validToken === 'Token must be a valid token') {
    //   return res.status(401).json({ message: validToken });
    // }
    // next();
  }

  // static validateUser(req: Request, res: Response, next: NextFunction): Response | void {
  //   const user = req.body;
  //   const requiredKeys = ['email', 'password', 'username'];
  //   const notFoundKey = requiredKeys.find((key) => !(key in user));
  //   if (notFoundKey) {
  //     return res.status(400).json({ message: 'All fields must be filled' });
  //   }

  //   next();
  // }
}

export default Validations;
