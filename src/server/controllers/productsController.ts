import type { Request, Response } from 'express';
import { getProductById, products } from '../../data/products';

export function listProducts(_req: Request, res: Response) {
  res.json({
    items: products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.images[0],
    })),
  });
}

export function getProduct(req: Request, res: Response) {
  const product = getProductById(String(req.params.id ?? ''));
  if (!product) {
    res.status(404).json({ error: 'not_found', message: 'Product not found' });
    return;
  }
  res.json({ product });
}
