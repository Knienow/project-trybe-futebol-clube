import ILeaderboard from '../Interfaces/ILeaderboard';
// import TeamModel from '../models/TeamModel';
// import { ITeamModel } from '../Interfaces/ITeamModel';
import HomeLeaderboardService from './HomeLeaderboardService';
import AwayLeaderboardService from './AwayLeaderboardService';
import TeamModelSequelize from '../database/models/TeamModelSequelize';

export default class LeaderboardService {
  // private teamModel: ITeamModel = new TeamModel();
  private teamModel = TeamModelSequelize;

  constructor(
    private homeLeaderboard = new HomeLeaderboardService(),
    private awayLeaderboard = new AwayLeaderboardService(),
  ) { }

  public async findTeams() {
    const teams = await this.teamModel.findAll();
    return teams;
  }

  public async flatLeaderboards() {
    const homeLeaderboard = await this.homeLeaderboard.findHomeLeaderboard();
    const awayLeaderboard = await this.awayLeaderboard.findAwayLeaderboard();
    const flatLeaderboards = [homeLeaderboard, awayLeaderboard].flat();
    return flatLeaderboards;
  }

  public async leaderboards() {
    const flatLeaderboards = await this.flatLeaderboards();
    const concatLeaderboards = (await this.findTeams()).map((team) => team.teamName).map((team) => {
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

  public async leaderboard(): Promise<ILeaderboard[]> {
    const concatLeaderboards = await this.leaderboards();
    const leaderboard = concatLeaderboards.sort((a, b) => b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor
    || b.goalsOwn - a.goalsOwn);
    return leaderboard as ILeaderboard[];
  }
}
