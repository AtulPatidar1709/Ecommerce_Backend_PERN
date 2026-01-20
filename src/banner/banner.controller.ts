import { Request, Response, NextFunction } from 'express';
import {
  createBannerSchema,
  updateBannerSchema,
  getBannerSchema,
} from './banner.schema';
import * as bannerService from './banner.service';
import { AppError } from '../utils/AppError';

export const createBannerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = createBannerSchema.parse(req.body);
    const result = await bannerService.createBanner(data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllBannersController = async (
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
    const result = await bannerService.getAllBanners(isActive);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getActiveBannersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await bannerService.getActiveBanners();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBannerByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getBannerSchema.parse({ id: req.params.id });
    const result = await bannerService.getBannerById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateBannerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getBannerSchema.parse({ id: req.params.id });
    const data = updateBannerSchema.parse(req.body);
    const result = await bannerService.updateBanner(id, data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const toggleBannerStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getBannerSchema.parse({ id: req.params.id });
    const result = await bannerService.toggleBannerStatus(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteBannerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getBannerSchema.parse({ id: req.params.id });
    const result = await bannerService.deleteBanner(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
