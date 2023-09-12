import MatchModel from '../models/MatchModel';
// import { NewEntity } from '../Interfaces/index';
import IMatch from '../Interfaces/IMatch';
import { IMatchModel } from '../Interfaces/IMatchModel';
import { ServiceResponse /* , ServiceMessage */ } from '../Interfaces/ServiceResponse';
import TeamModel from '../models/TeamModel';

export default class MatchService {
  constructor(
    private matchModel: IMatchModel = new MatchModel(),
  ) { }

  public async getAllMatches() : Promise<ServiceResponse<IMatch[]>> {
    const matches = await this.matchModel.findAll();
    return { status: 'SUCCESSFUL', data: matches };
  }

  public async getInProgress(inProgress: boolean) : Promise<ServiceResponse<IMatch[]>> {
    const matches = await this.matchModel.filterInProgress(inProgress);
    console.log('teste service', inProgress);
    return { status: 'SUCCESSFUL', data: matches };
  }

  public async finishMatch(id: number) : Promise<ServiceResponse<{ message: 'Finished' }>> {
    await this.matchModel.finishMatch(id);
    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }

  public async updateMatch(
    id: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ) : Promise<ServiceResponse<{ message: 'result updated' }>> {
    await this.matchModel.updateMatch(id, homeTeamGoals, awayTeamGoals);
    return { status: 'SUCCESSFUL', data: { message: 'result updated' } };
  }

  public async createMatch(
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<ServiceResponse<IMatch>> {
    const findHomeTeamById = await new TeamModel().findById(homeTeamId);
    const findAwayTeamById = await new TeamModel().findById(awayTeamId);
    if (!findHomeTeamById || !findAwayTeamById) {
      return { status: 'NOT_FOUND', data: { message: 'There is no team with such id!' } };
    }
    const newMatch = await this.matchModel.createMatch(
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals,
    );
    return { status: 'CREATED', data: newMatch };
  }
}
