import { Request, Response, NextFunction } from 'express';
import {
  createBannerSchema,
  updateBannerSchema,
  getBannerSchema,
} from './banner.schema';
import * as bannerService from './banner.service';
import {
  getFiles,
  uploadImages,
  validateFiles,
} from '../product/helper/controller.helper';

export const createBannerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const files = getFiles(req);

    console.log('files length ', files.length);

    validateFiles(files, 1);

    const imgUrls = await uploadImages(files);

    console.log('ImageUrls ', imgUrls);

    let data = req.body;

    const dataWithImageUrl = { ...data, imageUrl: imgUrls[0] };

    data = createBannerSchema.parse(dataWithImageUrl);

    console.log('dataWithImageUrl is ', dataWithImageUrl);

    const result = await bannerService.createBanner(dataWithImageUrl);
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
