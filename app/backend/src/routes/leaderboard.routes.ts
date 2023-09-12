import { Request, Router, Response } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';
// import Validations from '../middlewares/ValidationTeams';

const leaderboardController = new LeaderboardController();

const router = Router();

router.get(
  '/home',
  (req: Request, res: Response) => leaderboardController.findHomeLeaderboard(req, res),
);

export default router;
