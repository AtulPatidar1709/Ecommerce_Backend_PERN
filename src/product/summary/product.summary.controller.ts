import { Request, Response, NextFunction } from 'express';
import { productSummaryQuerySchema } from './product.summary.schema';
import * as productSummaryService from './product.summary.service';

export const getProductSummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = productSummaryQuerySchema.parse(req.query);

    const products = await productSummaryService.getProductSummary(query);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};
