import { Request, Response, Router } from 'express';
import auth from './auth';
import user from './user';
import product from './product';
import donorticket from './donorticket';
import requestorticket from './requestorticket';
const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/product', product);
routes.use('/donation', donorticket);
routes.use('/requestor', requestorticket);
export default routes;
