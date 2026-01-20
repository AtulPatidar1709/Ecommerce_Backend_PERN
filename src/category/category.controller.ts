import { Request, Response, NextFunction } from 'express';
import {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
} from './category.schema';
import * as categoryService from './category.service';
import { AppError } from '../utils/AppError';

export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = createCategorySchema.parse(req.body);
    const result = await categoryService.createCategory(data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isActive =
      req.query.isActive === 'true'
        ? true
        : req.query.isActive === 'false'
          ? false
          : undefined;
    const result = await categoryService.getAllCategories(isActive);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCategoryByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getCategorySchema.parse({ id: req.params.id });
    const result = await categoryService.getCategoryById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlugController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params;
    if (!slug || typeof slug !== 'string') {
      throw new AppError('Invalid slug provided', 400);
    }
    const result = await categoryService.getCategoryBySlug(slug);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getCategorySchema.parse({ id: req.params.id });
    const data = updateCategorySchema.parse(req.body);
    const result = await categoryService.updateCategory(id, data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const toggleCategoryStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getCategorySchema.parse({ id: req.params.id });
    const result = await categoryService.toggleCategoryStatus(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getCategorySchema.parse({ id: req.params.id });
    const result = await categoryService.deleteCategory(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
