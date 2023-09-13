import { NewEntity } from '../Interfaces';
import UserModelSequelize from '../database/models/UserModelSequelize';
import { IUser } from '../Interfaces/IUser';
import { IUserModel } from '../Interfaces/IUserModel';

export default class UserModel implements IUserModel {
  private model = UserModelSequelize;

  // async findAll(): Promise<IUser[]> {
  //   const dbData = await this.model.findAll();
  //   return dbData.map(({ id, username, role, email, password }) => (
  //     { id, username, role, email, password }
  //   ));
  // }

  // async findById(id: IUser['id']): Promise<IUser | null> {
  //   const user = await this.model.findByPk(id);
  //   if (!user) return null;
  //   const { username, role, email, password } = user;
  //   return { id, username, role, email, password };
  // }

  async findByEmail(email: IUser['email']): Promise<IUser | null> {
    const user = await this.model.findOne({ where: { email } });
    if (!user) return null;
    const { id, username, role, password } = user;
    return { id, username, role, email, password };
  }

  async create(data: NewEntity<IUser>): Promise<IUser> {
    const user = await this.model.create(data);
    const { id, username, role, email, password } = user;
    return { id, username, role, email, password };
  }
}
