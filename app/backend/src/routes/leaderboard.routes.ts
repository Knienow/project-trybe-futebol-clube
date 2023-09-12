import { Request, Router, Response } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';
// import Validations from '../middlewares/ValidationTeams';

const leaderboardController = new LeaderboardController();

const router = Router();

router.get(
  '/',
  (req: Request, res: Response) => leaderboardController.findLeaderboard(req, res),
);
router.get(
  '/home',
  (req: Request, res: Response) => leaderboardController.findHomeLeaderboard(req, res),
);

router.get(
  '/away',
  (req: Request, res: Response) => leaderboardController.findAwayLeaderboard(req, res),
);

export default router;
