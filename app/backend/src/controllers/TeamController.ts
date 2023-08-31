import { Request, Response } from 'express';
import TeamService from '../services/TeamService';

export default class TeamController {
  constructor(
    private teamService = new TeamService(),
  ) { }

  async getAllTeams(req: Request, res: Response) {
    const teams = await this.teamService.getAllTeams();
    return res.status(200).json(teams.data);
  }

  async getTeamById(req: Request, res: Response) {
    const { id } = req.params;
    const team = await this.teamService.getTeamById(Number(id));
    return res.status(200).json(team.data);
  }
}
