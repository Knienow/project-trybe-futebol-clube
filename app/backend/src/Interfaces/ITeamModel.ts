// interface do model geral da aplicação
// contrato que a model de team precisa seguir
// método create que recebe os dados de um time e retorna o time
// criado no banco de dados - para adicionar novos times ao campeonato

import ITeam from './ITeam';
// import { NewEntity } from '.';

export interface ITeamModel {
  // create(data: Partial<ITeam>) : Promise<ITeam>,
  findAll(): Promise<ITeam[]>,
  findById(id: ITeam['id']): Promise<ITeam | null>,
  // update(id: ITeam['id'], data: Partial<NewEntity<ITeam>>) : Promise<ITeam | null>,
  // delete(id: ITeam['id']): Promise<number>,
}
