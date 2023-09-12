import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';
import HomeLeaderboardService from '../services/HomeLeaderboardService';
import AwayLeaderboardService from '../services/AwayLeaderboardService';

export default class LeaderboardController {
  constructor(
    private _leaderboardService = new LeaderboardService(),
    private _homeleaderboardService = new HomeLeaderboardService(),
    private _awayleaderboardService = new AwayLeaderboardService(),
  ) {}

  public async findLeaderboard(req: Request, res: Response) {
    const leaderboard = await this._leaderboardService.getSortedLeaderboard();
    res.status(200).json(leaderboard);
  }

  public async findHomeLeaderboard(req: Request, res: Response) {
    const homeLeaderboard = await this._homeleaderboardService.getHomeLeaderboard();
    res.status(200).json(homeLeaderboard);
  }

  public async findAwayLeaderboard(req: Request, res: Response) {
    const awayLeaderboard = await this._awayleaderboardService.getAwayLeaderboard();
    res.status(200).json(awayLeaderboard);
  }
}
