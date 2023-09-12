import MatchModelSequelize from '../database/models/MatchModelSequelize';
import IMatch from '../Interfaces/IMatch';
import { IMatchModel } from '../Interfaces/IMatchModel';
import TeamModelSequelize from '../database/models/TeamModelSequelize';

export default class MatchModel implements IMatchModel {
  private model = MatchModelSequelize;

  async findAll(): Promise<IMatch[]> {
    const dbData = await this.model.findAll({
      include: [
        { model: TeamModelSequelize, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamModelSequelize, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return dbData;
    // return dbData.map((
    //   { id, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress },
    // ) => (
    //   { id, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress }
    // ));
  }

  async filterInProgress(inProgress: boolean): Promise<IMatch[]> {
    const dbData = await this.model.findAll({
      where: { inProgress },
      include: [
        { model: TeamModelSequelize, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamModelSequelize, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return dbData;
    // return dbData.map((
    //   { id, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress },
    // ) => (
    //   { id, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress }
    // ));
  }

  async finishMatch(id: number) {
    await this.model.update({ inProgress: false }, { where: { id } });
  }

  async updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number) {
    await this.model.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });
  }

  async createMatch(
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<IMatch> {
    const result = await this.model.create({
      homeTeamId,
      homeTeamGoals,
      awayTeamId,
      awayTeamGoals,
      inProgress: true,
    });

    return result;
  }
}
