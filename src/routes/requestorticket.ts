import { Router } from 'express';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';
import RequestorTicketController from '../controllers/RequestorTicketController';

const router = Router();


router.get('/', RequestorTicketController.getAllRequestorTicket);
router.post('/',  RequestorTicketController.createRequestorTicket);
router.put('/:id', RequestorTicketController.approveRequestorTicket);


export default router;
