import TeamModel from '../models/TeamModel';
import { NewEntity } from '../Interfaces/index';
import ITeam from '../Interfaces/ITeam';
import { ITeamModel } from '../Interfaces/ITeamModel';
import { ServiceResponse, ServiceMessage } from '../Interfaces/ServiceResponse';

// atributo teamModel declarado no constructor: definindo que caso não seja
// passado nenhum modelo durante a criação de uma instância, por padrão será
// utilizado o TeamModel. Caso seja necessário utilizar um modelo diferente,
// este deve ser enviado como parâmetro ao instanciar um objeto da classe
// TeamService, desde que esse novo model seja de uma classe que implementa
// a interface ITeamModel.
export default class TeamService {
  constructor(
    private teamModel: ITeamModel = new TeamModel(),
  ) { }

  public async createTeam(team: NewEntity<ITeam>): Promise<ServiceResponse<ITeam>> {
    const newBook = await this.teamModel.create(team);
    return { status: 'SUCCESSFUL', data: newBook };
  }

  public async getAllTeams() : Promise<ServiceResponse<ITeam[]>> {
    const teams = await this.teamModel.findAll();
    return { status: 'SUCCESSFUL', data: teams };
  }

  public async getTeamById(id: number) : Promise<ServiceResponse<ITeam>> {
    const team = await this.teamModel.findById(id);
    if (!team) return { status: 'NOT_FOUND', data: { message: `Team ${id} not found` } };
    return { status: 'SUCCESSFUL', data: team };
  }

  public async updateTeam(id: number, team: ITeam): Promise<ServiceResponse<ServiceMessage>> {
    const teamFound = await this.teamModel.findById(id);
    if (!teamFound) return { status: 'NOT_FOUND', data: { message: `Team ${id} not found` } };

    const updatedTeam = await this.teamModel.update(id, team);
    if (!updatedTeam) {
      return { status: 'CONFLICT',
        data: { message: `There are no updates to perform in Team ${id}` } };
    }
    return { status: 'SUCCESSFUL', data: { message: 'Team updated' } };
  }

  public async deleteTeam(id: number): Promise<ServiceResponse<ServiceMessage>> {
    const teamFound = await this.teamModel.findById(id);
    if (!teamFound) return { status: 'NOT_FOUND', data: { message: `Team ${id} not found` } };

    await this.teamModel.delete(id);
    return { status: 'SUCCESSFUL', data: { message: 'Team deleted' } };
  }
}
