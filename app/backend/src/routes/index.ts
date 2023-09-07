import { Router } from 'express';
import teamRouter from './team.routes';
import loginRouter from './userroutes';

const router = Router();

router.use('/teams', teamRouter);
router.use('/login', loginRouter);

export default router;
