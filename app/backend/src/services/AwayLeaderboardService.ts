import ILeaderboard from '../Interfaces/ILeaderboard';
import TeamModelSequelize from '../database/models/TeamModelSequelize';
import MatchModelSequelize from '../database/models/MatchModelSequelize';

export default class AwayLeaderboardService {
  constructor(
    // private _teamModel: ITeamModel = new TeamModel(),
    // private _matchModel: IMatchModel = new MatchModel(),
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

  public async findMatchesAway() {
    const teams = await this.findAllTeams();
    const matches = await this.findAllFinishedMatches();
    const teamsHomeMatches = teams.map((team) => {
      const awayMatches = matches.filter((match) => match.homeTeamId === team.id);
      return awayMatches;
    });
    return teamsHomeMatches;
  }

  public async findTotalGamesAway() {
    const awayMatches = await this.findMatchesAway();
    const totalHomeGames = awayMatches.map((match) => match.length);
    return totalHomeGames;
  }

  public async findVictoriesAway() {
    const awayMatches = await this.findMatchesAway();
    const victories = awayMatches.map((match) => {
      const victory = match.filter((game) => game.awayTeamGoals > game.homeTeamGoals);
      return victory.length;
    });
    return victories;
  }

  public async findDrawsAway() {
    const awayMatches = await this.findMatchesAway();
    const draws = awayMatches.map((match) => {
      const draw = match.filter((game) => game.awayTeamGoals === game.homeTeamGoals);
      return draw.length;
    });
    return draws;
  }

  public async findLossesAway() {
    const awayMatches = await this.findMatchesAway();
    const losses = awayMatches.map((match) => {
      const loss = match.filter((game) => game.awayTeamGoals < game.homeTeamGoals);
      return loss.length;
    });
    return losses;
  }

  public async findTotalPointsAway() {
    const victories = await this.findVictoriesAway();
    const drawsPoints = await this.findDrawsAway();
    const totalPoints = victories.map((victory, index) => (victory * 3) + drawsPoints[index]);
    return totalPoints;
  }

  public async findGoalsFavorAway() {
    const awayMatches = await this.findMatchesAway();
    const goalsFavor = awayMatches.map((match) => {
      const goals = match.map((game) => game.awayTeamGoals);
      const sum = goals.reduce((a, b) => a + b, 0);
      return sum;
    });
    return goalsFavor;
  }

  public async findGoalsOwnAway() {
    const awayMatches = await this.findMatchesAway();
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
  public async findGoalsBalanceAway() {
    const goalsFavor = await this.findGoalsFavorAway();
    const goalsOwn = await this.findGoalsOwnAway();
    const goalsBalance = goalsFavor.map((goal, index) => goal - goalsOwn[index]);
    return goalsBalance;
  }

  // Para o campo Aproveitamento do time (%), que é a porcentagem de jogos ganhos, use a seguinte fórmula: [P / (J * 3)] * 100, onde:
  // P: Total de Pontos;
  // J: Total de Jogos.
  // Obs.: O seu resultado deverá ser limitado a duas casas decimais.
  public async findEfficiencyAway() {
    const totalPoints = await this.findTotalPointsAway();
    const totalAwayGames = await this.findTotalGamesAway();
    const efficiency = totalPoints
      .map((point, index) => ((point / (totalAwayGames[index] * 3)) * 100));
    return efficiency;
  }

  public async findLeaderboardAwayUnsorted() {
    const teams = await this.findAllTeams();

    const leaderboard = await Promise.all(
      teams.map(async (team, index) => ({
        name: team.teamName,
        totalPoints: (await this.findTotalPointsAway())[index],
        totalGames: (await this.findTotalGamesAway())[index],
        totalVictories: (await this.findVictoriesAway())[index],
        totalDraws: (await this.findDrawsAway())[index],
        totalLosses: (await this.findLossesAway())[index],
        goalsFavor: (await this.findGoalsFavorAway())[index],
        goalsOwn: (await this.findGoalsOwnAway())[index],
        goalsBalance: (await this.findGoalsBalanceAway())[index],
        efficiency: (await this.findEfficiencyAway())[index].toFixed(2),
      })),
    );
    return leaderboard;
  }

  // O resultado deverá ser ordenado sempre de forma decrescente, levando em consideração a quantidade de pontos que o time acumulou. Em caso de empate no Total de Pontos, você deve levar em consideração os seguintes critérios para desempate:
  // Ordem para desempate
  // 1º Total de Vitórias;
  // 2º Saldo de gols;
  // 3º Gols a favor;
  public async findAwayLeaderboard(): Promise<ILeaderboard[]> {
    const leaderboardUnsorted = await this.findLeaderboardAwayUnsorted();
    const leaderboard = leaderboardUnsorted.sort((a, b) => b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor);
    return leaderboard as unknown as ILeaderboard[];
  }
}
