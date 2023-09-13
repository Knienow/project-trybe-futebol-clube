import * as bcrypt from 'bcryptjs';
import UserModel from '../models/UserModel';
import ILogin from '../Interfaces/ILogin';
// import { IUser, IUserResponse } from '../Interfaces/IUser';
import { IUser } from '../Interfaces/IUser';
import { IUserModel } from '../Interfaces/IUserModel';
import { IToken } from '../Interfaces/IToken';
import JWT from '../utils/JWT';
// import { NewEntity } from '../Interfaces';
import { ServiceResponse, ServiceMessage } from '../Interfaces/ServiceResponse';
// import UserModelSequelize from '../database/models/UserModelSequelize';

export default class UserService {
  constructor(
    private userModel: IUserModel = new UserModel(),
    private jwtService = JWT,
    // private sequelizeModel = UserModelSequelize,
  ) { }

  // public async findAll(): Promise<ServiceResponse<IUserResponse[]>> {
  //   const allUsers = await this.userModel.findAll();
  //   const usersReturn = allUsers.map(
  //     ({ id, username, role, email }) => ({ id, username, role, email }),
  //   );
  //   return { status: 'SUCCESSFUL', data: usersReturn };
  // }

  // public async getUserById(id: number): Promise<ServiceResponse<IUser>> {
  //   const user = await this.userModel.findById(id);
  //   if (!user) return { status: 'NOT_FOUND', data: { message: 'User not found' } };
  //   // const { username, role, email } = user as IUser;

  //   return { status: 'SUCCESSFUL', data: user };
  // }

  public async login(data: ILogin): Promise<ServiceResponse<ServiceMessage | IToken>> {
    const user = await this.userModel.findByEmail(data.email);
    if (user) {
      if (!bcrypt.compareSync(data.password, user.password)) {
        return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
      }
      const { email } = user as IUser;
      const token = this.jwtService.sign({ email });
      return { status: 'SUCCESSFUL', data: { token } };
    }
    return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
  }

  public async tokenValidate(email: string): Promise<string | undefined> {
    const user = await this.userModel.findByEmail(email);
    return user?.role;
  }

  // public async createUser(user: NewEntity<IUser>):
  // Promise<ServiceResponse<IUserResponse | ServiceMessage>> {
  //   const userFound = await this.userModel.findByEmail(user.email);
  //   if (userFound) return { status: 'CONFLICT', data: { message: 'User already exists' } };

  //   const userPassword = bcrypt.hashSync(user.password, 10);
  //   const newUser = await this.userModel.create({ ...user, password: userPassword });
  //   const { id, username, role, email } = newUser as IUser;

  //   return { status: 'SUCCESSFUL', data: { id, username, role, email } };
  // }
}
