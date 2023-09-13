// import { NextFunction, Request, Response } from 'express';

// // nesta classe são implementadas todas as validações de entrada de Teams
// class Validations {
//   static validateTeam(req: Request, res: Response, next: NextFunction): Response | void {
//     const team = req.body;
//     const requiredKeys = ['team_name'];
//     const notFoundKey = requiredKeys.find((key) => !(key in team));
//     if (notFoundKey) {
//       return res.status(404).json({ message: `${notFoundKey} is required` });
//     }

//     next();
//   }
// }

// export default Validations;
