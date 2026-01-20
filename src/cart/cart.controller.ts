import { Request, Response, NextFunction } from 'express';
import {
  addToCartSchema,
  updateCartItemSchema,
  removeFromCartSchema,
} from './cart.schema';
import * as cartService from './cart.service';
import { getUserIdFromRequest } from './cart.helpers';

export const addToCartController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserIdFromRequest(req);
    const data = addToCartSchema.parse(req.body);
    const result = await cartService.addToCart(userId, data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCartItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserIdFromRequest(req);
    const result = await cartService.getCartItems(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateCartItemController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { productId } = removeFromCartSchema.parse({
      productId: req.params.productId,
    });
    const data = updateCartItemSchema.parse(req.body);
    const result = await cartService.updateCartItem(userId, productId, data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const removeFromCartController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { productId } = removeFromCartSchema.parse({
      productId: req.params.productId,
    });
    const result = await cartService.removeFromCart(userId, productId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const clearCartController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserIdFromRequest(req);
    const result = await cartService.clearCart(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
