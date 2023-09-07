import { Request, Router, Response } from 'express';
import TeamController from '../controllers/TeamController';
import Validations from '../middlewares/ValidationTeams';

const teamController = new TeamController();

const router = Router();

router.get(
  '/',
  Validations.validateTeam,
  (req: Request, res: Response) => teamController.createTeam(req, res),
);
router.get('/', (req: Request, res: Response) => teamController.getAllTeams(req, res));
router.get('/:id', (req: Request, res: Response) => teamController.getTeamById(req, res));
router.put(
  '/:id',
  Validations.validateTeam, // aproveitamos a validação já criada para o cadastro
  (req: Request, res: Response) =>
    teamController.updateTeam(req, res),
);
router.delete(
  '/:id',
  (req: Request, res: Response) => teamController.deleteTeam(req, res),
);

export default router;
