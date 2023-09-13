import ILeaderboard from '../Interfaces/ILeaderboard';
import TeamModelSequelize from '../database/models/TeamModelSequelize';
import MatchModelSequelize from '../database/models/MatchModelSequelize';

export default class HomeLeaderboardService {
  constructor(
    // private _teamModel: ITeamModel = new TeamModel(),
    // private matchModel: IMatchModel = new MatchModel(),
    private teamModel = TeamModelSequelize,
    private model = MatchModelSequelize,
  ) {}

  public async findAllTeams() {
    const teams = await this.teamModel.findAll();
    return teams;
  }

  public async findAllFinishedMatches() {
    const matches = await this.model.findAll({ where: { inProgress: false } });
    return matches;
  }

  public async findMatchesHome() {
    const teams = await this.findAllTeams();
    const matches = await this.findAllFinishedMatches();
    const teamsHomeMatches = teams.map((team) => {
      const homeMatches = matches.filter((match) => match.homeTeamId === team.id);
      return homeMatches;
    });
    return teamsHomeMatches;
  }

  public async findTotalGamesHome() {
    const homeMatches = await this.findMatchesHome();
    const totalHomeGames = homeMatches.map((match) => match.length);
    return totalHomeGames;
  }

  public async findVictoriesHome() {
    const homeMatches = await this.findMatchesHome();
    const victories = homeMatches.map((match) => {
      const victory = match.filter((game) => game.homeTeamGoals > game.awayTeamGoals);
      return victory.length;
    });
    return victories;
  }

  public async findDrawsHome() {
    const homeMatches = await this.findMatchesHome();
    const draws = homeMatches.map((match) => {
      const draw = match.filter((game) => game.homeTeamGoals === game.awayTeamGoals);
      return draw.length;
    });
    return draws;
  }

  public async findLossesHome() {
    const homeMatches = await this.findMatchesHome();
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
  public async findTotalPointsHome() {
    const victories = await this.findVictoriesHome();
    const drawsPoints = await this.findDrawsHome();
    const totalPoints = victories.map((victory, index) => (victory * 3) + drawsPoints[index]);
    return totalPoints;
  }

  public async findGoalsFavorHome() {
    const homeMatches = await this.findMatchesHome();
    const goalsFavor = homeMatches.map((match) => {
      const goals = match.map((game) => game.homeTeamGoals);
      const sum = goals.reduce((a, b) => a + b, 0);
      return sum;
    });
    return goalsFavor;
  }

  public async findGoalsOwnHome() {
    const homeMatches = await this.findMatchesHome();
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
  public async findGoalsBalanceHome() {
    const goalsFavor = await this.findGoalsFavorHome();
    const goalsOwn = await this.findGoalsOwnHome();
    const goalsBalance = goalsFavor.map((goal, index) => goal - goalsOwn[index]);
    return goalsBalance;
  }

  // Para o campo Aproveitamento do time (%), que é a porcentagem de jogos ganhos, use a seguinte fórmula: [P / (J * 3)] * 100, onde:
  // P: Total de Pontos;
  // J: Total de Jogos.
  // Obs.: O seu resultado deverá ser limitado a duas casas decimais.
  public async findEfficiencyHome() {
    const totalPoints = await this.findTotalPointsHome();
    const totalHomeGames = await this.findTotalGamesHome();
    const efficiency = totalPoints
      .map((point, index) => ((point / (totalHomeGames[index] * 3)) * 100));
    return efficiency;
  }

  public async findLeaderboardHomeUnsorted() {
    const teams = await this.findAllTeams();

    const leaderboard = await Promise.all(
      teams.map(async (team, index) => ({
        name: team.teamName,
        totalPoints: (await this.findTotalPointsHome())[index],
        totalGames: (await this.findTotalGamesHome())[index],
        totalVictories: (await this.findVictoriesHome())[index],
        totalDraws: (await this.findDrawsHome())[index],
        totalLosses: (await this.findLossesHome())[index],
        goalsFavor: (await this.findGoalsFavorHome())[index],
        goalsOwn: (await this.findGoalsOwnHome())[index],
        goalsBalance: (await this.findGoalsBalanceHome())[index],
        efficiency: (await this.findEfficiencyHome())[index].toFixed(2),
      })),
    );
    return leaderboard;
  }

  // O resultado deverá ser ordenado sempre de forma decrescente, levando em consideração a quantidade de pontos que o time acumulou. Em caso de empate no Total de Pontos, você deve levar em consideração os seguintes critérios para desempate:
  // Ordem para desempate
  // 1º Total de Vitórias;
  // 2º Saldo de gols;
  // 3º Gols a favor;
  public async findHomeLeaderboard(): Promise<ILeaderboard[]> {
    const unsortedleaderboard = await this.findLeaderboardHomeUnsorted();
    const leaderboard = unsortedleaderboard.sort((a, b) => b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor);
    return leaderboard as unknown as ILeaderboard[];
  }
}
