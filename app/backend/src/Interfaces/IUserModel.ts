// interface do model geral da aplicação

import { ICRUDModelCreator, ICRUDModelReader } from './ICRUDModel';
import { IUser } from './IUser';

export interface IUserModel extends ICRUDModelReader<IUser>,
  ICRUDModelCreator<IUser>{
  findByEmail(email: IUser['email']): Promise<IUser | null>,
}
