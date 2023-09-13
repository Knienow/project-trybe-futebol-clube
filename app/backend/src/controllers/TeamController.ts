import { Request, Response } from 'express';
import TeamService from '../services/TeamService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class TeamController {
  constructor(
    private teamService = new TeamService(),
  ) { }

  public async findAllTeams(_req: Request, res: Response) {
    const serviceResponse = await this.teamService.findAllTeams();
    return res.status(200).json(serviceResponse.data);
  }

  public async getTeamById(req: Request, res: Response) {
    const { id } = req.params;
    const serviceResponse = await this.teamService.getTeamById(Number(id));
    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }
    return res.status(200).json(serviceResponse.data);
  }

  // public async createTeam(req: Request, res: Response) {
  //   const serviceResponse = await this.teamService.createTeam(req.body);
  //   res.status(201).json(serviceResponse.data);
  // }

  // public async updateTeam(req: Request, res: Response): Promise<Response> {
  //   const id = Number(req.params.id);
  //   const team = req.body;
  //   const serviceResponse = await this.teamService.updateTeam(id, team);

  //   if (serviceResponse.status !== 'SUCCESSFUL') {
  //     return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  //   }

  //   return res.status(200).json(serviceResponse.data);
  // }

  // public async deleteTeam(req: Request, res: Response): Promise<Response> {
  //   const id = Number(req.params.id);
  //   const serviceResponse = await this.teamService.deleteTeam(id);

  //   if (serviceResponse.status !== 'SUCCESSFUL') {
  //     return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  //   }

  //   return res.status(200).json(serviceResponse.data);
  // }
}
