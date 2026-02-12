import { Request, Response, NextFunction } from 'express';
import * as productService from './product.service';
import {
  getAllProductsQuerySchema,
  updateProductSchema,
} from './product.schema';
import { AppError } from '../utils/AppError';
import {
  getFiles,
  parseCreateProductData,
  prepareUpdateImagesPayload,
  uploadImages,
  validateFiles,
  validatePrimaryIndex,
} from './helper/controller.helper';

export const createProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const files = getFiles(req);

    validateFiles(files, 3);

    const primaryIndex = Number(req.body.primaryIndex);

    validatePrimaryIndex(primaryIndex, files.length);

    //upload all files at cloudinary and get urls array
    const uploadedImages = await uploadImages(files);

    // structure data according to our schema
    const data = parseCreateProductData(req.body, uploadedImages, primaryIndex);

    const product = await productService.createProduct(data);

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const getAllProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedQuery = getAllProductsQuerySchema.parse(req.query);
    const products = await productService.getAllProducts(parsedQuery);
    res.status(200).json({ success: true, products: products });
  } catch (err) {
    next(err);
  }
};

export const getProductBySlugController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slug = req.params.slug as string;
    const product = await productService.getProductBySlug(slug);
    res.status(200).json({ success: true, product: product });
  } catch (err) {
    next(err);
  }
};

export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      images: imagesData,
      primaryIndex,
      ...productFields
    } = updateProductSchema.parse(req.body);

    if (!imagesData || imagesData.length === 0) {
      throw new AppError('At least one image is required', 400);
    }

    // Separate new files from existing URLs
    const files = getFiles(req);

    const images = await prepareUpdateImagesPayload(
      imagesData,
      files,
      Number(primaryIndex),
    );

    const id = req.params.id as string;

    const product = await productService.updateProduct(id, {
      ...productFields,
      images,
    });

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const deleteProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    await productService.deleteProduct(id);
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
