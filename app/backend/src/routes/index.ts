import { Router } from 'express';
import teamRouter from './team.routes';
import loginRouter from './user.routes';
// import matchRouter from './matches.routes';

const router = Router();

router.use('/teams', teamRouter);
router.use('/login', loginRouter);
// router.use('/matches', matchRouter);

export default router;
