import { ITeamModel } from '../Interfaces/ITeamModel';
import { IMatchModel } from '../Interfaces/IMatchModel';
import MatchModel from '../models/MatchModel';
import TeamModel from '../models/TeamModel';
import ILeaderboard from '../Interfaces/ILeaderboard';
import TeamModelSequelize from '../database/models/TeamModelSequelize';
import MatchModelSequelize from '../database/models/MatchModelSequelize';
// import IMatch from '../Interfaces/IMatch';
// import ITeam from '../Interfaces/ITeam';

export default class HomeLeaderboardService {
  constructor(
    private _teamModel: ITeamModel = new TeamModel(),
    private matchModel: IMatchModel = new MatchModel(),
    private teamModel = TeamModelSequelize,
    private model = MatchModelSequelize,
  ) {}

  public async getAllTeams() {
    const teams = await this.teamModel.findAll();
    return teams;
  }

  public async getAllFinishedMatches() {
    const matches = await this.model.findAll({ where: { inProgress: false } });
    console.log('teste finished matches', matches);
    return matches;
  }

  public async getMatchesHome() {
    const teams = await this.getAllTeams();
    const matches = await this.getAllFinishedMatches();
    const teamsHomeMatches = teams.map((team) => {
      const homeMatches = matches.filter((match) => match.homeTeamId === team.id);
      return homeMatches;
    });
    return teamsHomeMatches;
  }

  public async getTotalGamesHome() {
    const homeMatches = await this.getMatchesHome();
    const totalHomeGames = homeMatches.map((match) => match.length);
    return totalHomeGames;
  }

  public async getVictoriesHome() {
    const homeMatches = await this.getMatchesHome();
    const victories = homeMatches.map((match) => {
      const victory = match.filter((game) => game.homeTeamGoals > game.awayTeamGoals);
      return victory.length;
    });
    return victories;
  }

  public async getDrawsHome() {
    const homeMatches = await this.getMatchesHome();
    const draws = homeMatches.map((match) => {
      const draw = match.filter((game) => game.homeTeamGoals === game.awayTeamGoals);
      return draw.length;
    });
    return draws;
  }

  public async getLossesHome() {
    const homeMatches = await this.getMatchesHome();
    const losses = homeMatches.map((match) => {
      const loss = match.filter((game) => game.homeTeamGoals < game.awayTeamGoals);
      return loss.length;
    });
    return losses;
  }

  //   Para calcular o Total de Pontos, você deve levar em consideração que:
  //   O time vitorioso: marcará +3 pontos;
  //   O time perdedor: marcará 0 pontos;
  //   Em caso de empate: ambos os times marcam +1 ponto.
  public async getTotalPointsHome() {
    const victories = await this.getVictoriesHome();
    const drawsPoints = await this.getDrawsHome();
    const totalPoints = victories.map((victory, index) => (victory * 3) + drawsPoints[index]);
    console.log('teste total points', totalPoints);
    return totalPoints;
  }

  public async getGoalsFavorHome() {
    const homeMatches = await this.getMatchesHome();
    const goalsFavor = homeMatches.map((match) => {
      const goals = match.map((game) => game.homeTeamGoals);
      const sum = goals.reduce((a, b) => a + b, 0);
      return sum;
    });
    return goalsFavor;
  }

  public async getGoalsOwnHome() {
    const homeMatches = await this.getMatchesHome();
    const goalsOwn = homeMatches.map((match) => {
      const goals = match.map((game) => game.awayTeamGoals);
      const sum = goals.reduce((a, b) => a + b, 0);
      return sum;
    });
    return goalsOwn;
  }

  // Para calcular Saldo de Gols use a seguinte fórmula: GP - GC, onde:
  // GP: Gols marcados a favor;
  // GC: Gols sofridos.
  public async getGoalsBalanceHome() {
    const goalsFavor = await this.getGoalsFavorHome();
    const goalsOwn = await this.getGoalsOwnHome();
    const goalsBalance = goalsFavor.map((goal, index) => goal - goalsOwn[index]);
    return goalsBalance;
  }

  // Para o campo Aproveitamento do time (%), que é a porcentagem de jogos ganhos, use a seguinte fórmula: [P / (J * 3)] * 100, onde:
  // P: Total de Pontos;
  // J: Total de Jogos.
  // Obs.: O seu resultado deverá ser limitado a duas casas decimais.
  public async getEfficiencyHome() {
    const totalPoints = await this.getTotalPointsHome();
    const totalHomeGames = await this.getTotalGamesHome();
    const efficiency = totalPoints
      .map((point, index) => ((point / (totalHomeGames[index] * 3)) * 100));
    return efficiency;
  }

  public async getUnsortedLeaderboardHome() {
    const teams = await this.getAllTeams();

    const homeLeaderboard = await Promise.all(
      teams.map(async (team, index) => ({
        name: team.teamName,
        totalPoints: (await this.getTotalPointsHome())[index],
        totalGames: (await this.getTotalGamesHome())[index],
        totalVictories: (await this.getVictoriesHome())[index],
        totalDraws: (await this.getDrawsHome())[index],
        totalLosses: (await this.getLossesHome())[index],
        goalsFavor: (await this.getGoalsFavorHome())[index],
        goalsOwn: (await this.getGoalsOwnHome())[index],
        goalsBalance: (await this.getGoalsBalanceHome())[index],
        efficiency: (await this.getEfficiencyHome())[index].toFixed(2),
      })),
    );
    return homeLeaderboard;
  }

  // O resultado deverá ser ordenado sempre de forma decrescente, levando em consideração a quantidade de pontos que o time acumulou. Em caso de empate no Total de Pontos, você deve levar em consideração os seguintes critérios para desempate:
  // Ordem para desempate
  // 1º Total de Vitórias;
  // 2º Saldo de gols;
  // 3º Gols a favor;
  public async getHomeLeaderboard(): Promise<ILeaderboard[]> {
    const unsortedHomeLeaderboard = await this.getUnsortedLeaderboardHome();
    const homeLeaderboard = unsortedHomeLeaderboard.sort((a, b) => b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || b.goalsOwn - a.goalsOwn);
    return homeLeaderboard as unknown as ILeaderboard[];
  }
}
