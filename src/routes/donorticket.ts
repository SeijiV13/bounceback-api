import { Router } from 'express';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';
import DonorTicketController from '../controllers/DonorTicketController';

const router = Router();


router.get('/', [checkJwt], DonorTicketController.getAllDonorTicket);
router.post('/', [checkJwt], DonorTicketController.createDonorTicket);
router.put('/:id', [checkJwt], DonorTicketController.approveDonorTicket);


export default router;
