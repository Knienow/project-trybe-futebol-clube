import ILeaderboard from '../Interfaces/ILeaderboard';
import TeamModel from '../models/TeamModel';
import { ITeamModel } from '../Interfaces/ITeamModel';
import HomeLeaderboardService from './HomeLeaderboardService';
import AwayLeaderboardService from './AwayLeaderboardService';

export default class LeaderboardService {
  private teamModel: ITeamModel = new TeamModel();

  constructor(
    private _homeLeaderboard = new HomeLeaderboardService(),
    private _awayLeaderboard = new AwayLeaderboardService(),
  ) { }

  public async getTeams() {
    const teams = await this.teamModel.findAll();
    return teams;
  }

  public async flatLeaderboards() {
    const homeLeaderboard = await this._homeLeaderboard.getHomeLeaderboard();
    const awayLeaderboard = await this._awayLeaderboard.getAwayLeaderboard();
    const flatLeaderboards = [homeLeaderboard, awayLeaderboard].flat();
    return flatLeaderboards;
  }

  public async joinLeaderboards() {
    const flatLeaderboards = await this.flatLeaderboards();
    const concatLeaderboards = (await this.getTeams()).map((team) => team.teamName).map((team) => {
      const teamRecords = flatLeaderboards.filter((record) => record.name === team);
      return teamRecords.reduce((acc, record) => ({
        name: record.name,
        totalPoints: acc.totalPoints + record.totalPoints,
        totalGames: acc.totalGames + record.totalGames,
        totalVictories: acc.totalVictories + record.totalVictories,
        totalDraws: acc.totalDraws + record.totalDraws,
        totalLosses: acc.totalLosses + record.totalLosses,
        goalsFavor: acc.goalsFavor + record.goalsFavor,
        goalsOwn: acc.goalsOwn + record.goalsOwn,
        goalsBalance: acc.goalsBalance + record.goalsBalance,
        efficiency: (((acc.totalPoints + record.totalPoints)
        / ((acc.totalGames + record.totalGames) * 3)) * 100).toFixed(2) as unknown as string,
      }));
    });
    return concatLeaderboards;
  }

  public async sortedLeaderboard(): Promise<ILeaderboard[]> {
    const concatLeaderboards = await this.joinLeaderboards();
    const sortedLeaderboard = concatLeaderboards.sort((a, b) => b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor
    || b.goalsOwn - a.goalsOwn);
    return sortedLeaderboard as ILeaderboard[];
  }
}
