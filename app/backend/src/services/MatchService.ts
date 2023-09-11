// import MatchModel from '../models/MatchModel';
// // import { NewEntity } from '../Interfaces/index';
// import IMatch from '../Interfaces/IMatch';
// import { IMatchModel } from '../Interfaces/IMatchModel';
// import { ServiceResponse /* , ServiceMessage */ } from '../Interfaces/ServiceResponse';

// export default class MatchService {
//   constructor(
//     private matchModel: IMatchModel = new MatchModel(),
//   ) { }

//   public async getAllMatches() : Promise<ServiceResponse<IMatch[]>> {
//     const matches = await this.matchModel.findAll();
//     return { status: 'SUCCESSFUL', data: matches };
//   }

//   public async getMatchById(id: number) : Promise<ServiceResponse<IMatch>> {
//     const match = await this.matchModel.findById(id);
//     if (!match) return { status: 'NOT_FOUND', data: { message: `Match ${id} not found` } };
//     return { status: 'SUCCESSFUL', data: match };
//   }
// }
