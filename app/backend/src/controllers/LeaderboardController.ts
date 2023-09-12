import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardService()) {}

  public async findHomeLeaderboard(req: Request, res: Response) {
    const homeLeaderboard = await this.leaderboardService.getHomeLeaderboard();
    res.status(200).json(homeLeaderboard);
  }
}
