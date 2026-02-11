import { Request, Response, NextFunction } from 'express';
import {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
  getCouponSchema,
} from './coupon.schema';
import * as couponService from './coupon.service';
import { getUserId } from '../auth/helper/helper';

export const createCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = createCouponSchema.parse(req.body);
    const result = await couponService.createCoupon(data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllCouponsController = async (
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
    const result = await couponService.getAllCoupons(isActive);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCouponByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getCouponSchema.parse({ id: req.params.id });
    const result = await couponService.getCouponById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const validateCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    const data = validateCouponSchema.parse(req.body);
    const result = await couponService.validateCoupon(userId, data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getCouponSchema.parse({ id: req.params.id });
    const data = updateCouponSchema.parse(req.body);
    const result = await couponService.updateCoupon(id, data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const toggleCouponStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getCouponSchema.parse({ id: req.params.id });
    const result = await couponService.toggleCouponStatus(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getCouponSchema.parse({ id: req.params.id });
    const result = await couponService.deleteCoupon(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
