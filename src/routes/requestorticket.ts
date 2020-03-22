import { Router } from 'express';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';
import RequestorTicketController from '../controllers/RequestorTicketController';

const router = Router();


router.get('/', [checkJwt], RequestorTicketController.getAllRequestorTicket);
router.post('/', [checkJwt],  RequestorTicketController.createRequestorTicket);
router.put('/:id', [checkJwt], RequestorTicketController.approveRequestorTicket);


export default router;
