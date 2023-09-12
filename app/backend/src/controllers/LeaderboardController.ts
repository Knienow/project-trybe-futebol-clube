import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';
import HomeLeaderboardService from '../services/HomeLeaderboardService';
import AwayLeaderboardService from '../services/AwayLeaderboardService';

export default class LeaderboardController {
  constructor(
    private _homeleaderboardService = new HomeLeaderboardService(),
    private _awayleaderboardService = new AwayLeaderboardService(),
    private _leaderboardService = new LeaderboardService(),
  ) {}

  public async findHomeLeaderboard(req: Request, res: Response) {
    const homeLeaderboard = await this._homeleaderboardService.getHomeLeaderboard();
    res.status(200).json(homeLeaderboard);
  }

  public async findAwayLeaderboard(req: Request, res: Response) {
    const awayLeaderboard = await this._awayleaderboardService.getAwayLeaderboard();
    res.status(200).json(awayLeaderboard);
  }

  public async findLeaderboard(req: Request, res: Response) {
    const leaderboard = await this._leaderboardService.sortedLeaderboard();
    res.status(200).json(leaderboard);
  }
}
