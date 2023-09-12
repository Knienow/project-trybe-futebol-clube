import { Request, Response } from 'express';
import MatchService from '../services/MatchService';
// import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class MatchController {
  constructor(
    private matchService = new MatchService(),
  ) { }

  public async getAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    console.log('teste inProgress', inProgress);
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
}
