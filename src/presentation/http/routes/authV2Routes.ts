import { Router } from 'express';
import { authControllerV2 } from '../../../compositionRoot';

const router = Router();
router.post('/register', authControllerV2.register);
router.post('/login', authControllerV2.login);

export const authV2Routes = router;