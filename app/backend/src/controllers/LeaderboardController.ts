import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';
import HomeLeaderboardService from '../services/HomeLeaderboardService';
import AwayLeaderboardService from '../services/AwayLeaderboardService';

export default class LeaderboardController {
  constructor(
    private homeleaderboardService = new HomeLeaderboardService(),
    private awayleaderboardService = new AwayLeaderboardService(),
    private leaderboardService = new LeaderboardService(),
  ) {}

  public async findHomeLeaderboard(req: Request, res: Response) {
    const homeLeaderboard = await this.homeleaderboardService.findHomeLeaderboard();
    res.status(200).json(homeLeaderboard);
  }

  public async findAwayLeaderboard(req: Request, res: Response) {
    const awayLeaderboard = await this.awayleaderboardService.findAwayLeaderboard();
    res.status(200).json(awayLeaderboard);
  }

  public async findLeaderboard(req: Request, res: Response) {
    const leaderboard = await this.leaderboardService.leaderboard();
    res.status(200).json(leaderboard);
  }
}
