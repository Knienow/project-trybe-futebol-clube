import MatchModel from '../models/MatchModel';
// import { NewEntity } from '../Interfaces/index';
import IMatch from '../Interfaces/IMatch';
import { IMatchModel } from '../Interfaces/IMatchModel';
import { ServiceResponse /* , ServiceMessage */ } from '../Interfaces/ServiceResponse';

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
}
