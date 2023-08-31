import TeamModel from '../database/models/TeamModel';
import ITeam from '../Interfaces/ITeam';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
// import { NewEntity } from '../Interfaces/index';

export default class TeamService {
  constructor(
    private teamModel: ITeam = new TeamModel(),
  ) { }

  getAllTeams = async () : Promise<ServiceResponse<ITeam[]>> => {
    const teams = await TeamModel.findAll();
    return { status: 'SUCCESSFUL', data: teams };
  };

  getTeamById = async (id: number) : Promise<ServiceResponse<ITeam | null>> => {
    const team = await TeamModel.findByPk(id);
    return { status: 'SUCCESSFUL', data: team };
  };
}
