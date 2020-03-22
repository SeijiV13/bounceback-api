import { Router } from 'express';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';
import ProductController from '../controllers/ProductController';

const router = Router();


router.get('/', [checkJwt], ProductController.getAllProducts);
router.post('/', [checkJwt], ProductController.createProduct);
router.delete('/:id', [checkJwt], ProductController.deleteProduct);


export default router;
