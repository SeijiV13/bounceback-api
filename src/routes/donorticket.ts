import { Router } from 'express';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';
import DonorTicketController from '../controllers/DonorTicketController';

const router = Router();


router.get('/', DonorTicketController.getAllDonorTicket);
router.post('/', DonorTicketController.createDonorTicket);
router.put('/:id', DonorTicketController.approveDonorTicket);


export default router;
