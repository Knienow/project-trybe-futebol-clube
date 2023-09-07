import { Identifiable } from './index';
import ILogin from './ILogin';

// export interface IUser {
//   id: number,
//   username: string,
//   role: string,
//   email: string,
//   password: string,
// }

// usuário completo
export interface IUser extends Identifiable, ILogin {
  username: string,
  role: string,
}

// usuário a ser retornado pela API
export type IUserResponse = Omit<IUser, 'password'>;
