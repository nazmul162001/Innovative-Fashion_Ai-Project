import { Router } from 'express';
import { listProducts, getProduct } from '../controllers/productsController';

export const productsRouter = Router();

/** Placeholder — later load from DB / CMS. */
productsRouter.get('/', listProducts);
productsRouter.get('/:id', getProduct);
