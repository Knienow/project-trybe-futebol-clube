// import { ITeamModel } from '../Interfaces/ITeamModel';
// import { IMatchModel } from '../Interfaces/IMatchModel';
// import MatchModel from '../models/MatchModel';
// import TeamModel from '../models/TeamModel';
import ILeaderboard from '../Interfaces/ILeaderboard';
import TeamModelSequelize from '../database/models/TeamModelSequelize';
import MatchModelSequelize from '../database/models/MatchModelSequelize';
// import IMatch from '../Interfaces/IMatch';
// import ITeam from '../Interfaces/ITeam';

export default class AwayLeaderboardService {
  constructor(
    // private _teamModel: ITeamModel = new TeamModel(),
    // private _matchModel: IMatchModel = new MatchModel(),
    private teamModel = TeamModelSequelize,
    private model = MatchModelSequelize,
  ) {}

  public async getAllTeams() {
    const teams = await this.teamModel.findAll();
    return teams;
  }

  public async getAllFinishedMatches() {
    const matches = await this.model.findAll({ where: { inProgress: false } });
    return matches;
  }

  public async getMatchesAway() {
    const teams = await this.getAllTeams();
    const matches = await this.getAllFinishedMatches();
    const teamsHomeMatches = teams.map((team) => {
      const awayMatches = matches.filter((match) => match.homeTeamId === team.id);
      return awayMatches;
    });
    return teamsHomeMatches;
  }

  public async getTotalGamesAway() {
    const awayMatches = await this.getMatchesAway();
    const totalHomeGames = awayMatches.map((match) => match.length);
    return totalHomeGames;
  }

  public async getVictoriesAway() {
    const awayMatches = await this.getMatchesAway();
    const victories = awayMatches.map((match) => {
      const victory = match.filter((game) => game.awayTeamGoals > game.homeTeamGoals);
      return victory.length;
    });
    return victories;
  }

  public async getDrawsAway() {
    const awayMatches = await this.getMatchesAway();
    const draws = awayMatches.map((match) => {
      const draw = match.filter((game) => game.awayTeamGoals === game.homeTeamGoals);
      return draw.length;
    });
    return draws;
  }

  public async getLossesAway() {
    const awayMatches = await this.getMatchesAway();
    const losses = awayMatches.map((match) => {
      const loss = match.filter((game) => game.awayTeamGoals < game.homeTeamGoals);
      return loss.length;
    });
    return losses;
  }

  public async getTotalPointsAway() {
    const victories = await this.getVictoriesAway();
    const drawsPoints = await this.getDrawsAway();
    const totalPoints = victories.map((victory, index) => (victory * 3) + drawsPoints[index]);
    return totalPoints;
  }

  public async getGoalsFavorAway() {
    const awayMatches = await this.getMatchesAway();
    const goalsFavor = awayMatches.map((match) => {
      const goals = match.map((game) => game.awayTeamGoals);
      const sum = goals.reduce((a, b) => a + b, 0);
      return sum;
    });
    return goalsFavor;
  }

  public async getGoalsOwnAway() {
    const awayMatches = await this.getMatchesAway();
    const goalsOwn = awayMatches.map((match) => {
      const goals = match.map((game) => game.homeTeamGoals);
      const sum = goals.reduce((a, b) => a + b, 0);
      return sum;
    });
    return goalsOwn;
  }

  // Para calcular Saldo de Gols use a seguinte fórmula: GP - GC, onde:
  // GP: Gols marcados a favor;
  // GC: Gols sofridos.
  public async getGoalsBalanceAway() {
    const goalsFavor = await this.getGoalsFavorAway();
    const goalsOwn = await this.getGoalsOwnAway();
    const goalsBalance = goalsFavor.map((goal, index) => goal - goalsOwn[index]);
    return goalsBalance;
  }

  // Para o campo Aproveitamento do time (%), que é a porcentagem de jogos ganhos, use a seguinte fórmula: [P / (J * 3)] * 100, onde:
  // P: Total de Pontos;
  // J: Total de Jogos.
  // Obs.: O seu resultado deverá ser limitado a duas casas decimais.
  public async getEfficiencyAway() {
    const totalPoints = await this.getTotalPointsAway();
    const totalAwayGames = await this.getTotalGamesAway();
    const efficiency = totalPoints
      .map((point, index) => ((point / (totalAwayGames[index] * 3)) * 100));
    return efficiency;
  }

  public async getUnsortedLeaderboardAway() {
    const teams = await this.getAllTeams();

    const awayLeaderboard = await Promise.all(
      teams.map(async (team, index) => ({
        name: team.teamName,
        totalPoints: (await this.getTotalPointsAway())[index],
        totalGames: (await this.getTotalGamesAway())[index],
        totalVictories: (await this.getVictoriesAway())[index],
        totalDraws: (await this.getDrawsAway())[index],
        totalLosses: (await this.getLossesAway())[index],
        goalsFavor: (await this.getGoalsFavorAway())[index],
        goalsOwn: (await this.getGoalsOwnAway())[index],
        goalsBalance: (await this.getGoalsBalanceAway())[index],
        efficiency: (await this.getEfficiencyAway())[index].toFixed(2),
      })),
    );
    return awayLeaderboard;
  }

  // O resultado deverá ser ordenado sempre de forma decrescente, levando em consideração a quantidade de pontos que o time acumulou. Em caso de empate no Total de Pontos, você deve levar em consideração os seguintes critérios para desempate:
  // Ordem para desempate
  // 1º Total de Vitórias;
  // 2º Saldo de gols;
  // 3º Gols a favor;
  public async getAwayLeaderboard(): Promise<ILeaderboard[]> {
    const unsortedAwayLeaderboard = await this.getUnsortedLeaderboardAway();
    const awayLeaderboard = unsortedAwayLeaderboard.sort((a, b) => b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || b.goalsOwn - a.goalsOwn);
    return awayLeaderboard as unknown as ILeaderboard[];
  }
}
