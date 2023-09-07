import { Router } from 'express';
import UserController from '../controllers/UserController';
import Validations from '../middlewares/ValidationLogin';

const userController = new UserController();

const router = Router();

router.post('/login', Validations.validateLogin, (req, res) => userController.login(req, res));
// router.post(
//   '/register',
//   Validations.validateToken,
//   Validations.validateUser,
//   (req, res) => userController.createUser(req, res),
// );
router.get('/', (req, res) => userController.getAllUsers(req, res));

router.get('/:id', (req, res) => userController.getUserById(req, res));

export default router;

// modelo seguido: https://github.com/tryber/trybeteca-api/blob/03-aula-ao-vivo/src/routes/users.routes.ts
