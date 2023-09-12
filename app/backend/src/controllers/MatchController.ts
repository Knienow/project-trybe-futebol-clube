import { Request, Response } from 'express';
import MatchService from '../services/MatchService';
import TeamModel from '../models/TeamModel';
// import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class MatchController {
  constructor(
    private matchService = new MatchService(),
  ) { }

  public async getAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    console.log('teste inProgress controller Match', inProgress);
    console.log('teste true', inProgress === 'true');
    if (!inProgress) {
      console.log('teste bug');
      const serviceResponse = await this.matchService.getAllMatches();
      return res.status(200).json(serviceResponse.data);
    }
    if (inProgress) {
      const serviceResponse = await this.matchService.getInProgress((inProgress === 'true'));
      return res.status(200).json(serviceResponse.data);
    }
  }

  public async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    const serviceResponse = await this.matchService.finishMatch(Number(id));
    return res.status(200).json(serviceResponse.data);
  }

  public async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;

    await this.matchService.updateMatch(
      Number(id),
      homeTeamGoals,
      awayTeamGoals,
    );

    res.status(200).json({ message: 'result updated' });
  }

  public async createMatch(req: Request, res: Response) {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;
    const serviceResponse = await this.matchService.createMatch(
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals,
    );

    if (homeTeamId === awayTeamId) {
      return res.status(422).json(
        { message: 'It is not possible to create a match with two equal teams' },
      );
    }

    const findHomeTeamById = await new TeamModel().findById(homeTeamId);
    const findAwayTeamById = await new TeamModel().findById(awayTeamId);

    if (!findHomeTeamById || !findAwayTeamById) {
      return res.status(404).json({ message: 'There is no team with such id!' });
    }
    return res.status(201).json(serviceResponse.data);
  }
}
