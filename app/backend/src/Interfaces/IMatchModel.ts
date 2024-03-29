// contrato que a model de Match precisa seguir

import IMatch from './IMatch';
// import { NewEntity } from '.';

export interface IMatchModel {
  // o método create recebe os dados e
  createMatch(homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number): Promise<IMatch>,
  findAll(data: Partial<object | void>): Promise<IMatch[]>,
  filterInProgress(inProgress: boolean): Promise<IMatch[]>,
  finishMatch(id: number): Promise<void>,
  updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number) : Promise<void>,
}
