import { Request, Response, NextFunction } from 'express';
import {
  addToCartSchema,
  updateCartItemSchema,
  removeFromCartSchema,
} from './cart.schema';
import * as cartService from './cart.service';
import { getUserId } from '../auth/helper/helper';

export const addToCartController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
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
    const userId = getUserId(req);
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
    const userId = getUserId(req);
    const data = {
      quantity: parseInt(req.body.quantity),
      productId: req.params.productId,
    };
    const parsedData = updateCartItemSchema.parse(data);
    const result = await cartService.updateCartItem(
      userId,
      parsedData.productId,
      parsedData.quantity,
    );
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
    const userId = getUserId(req);
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
    const userId = getUserId(req);
    const result = await cartService.clearCart(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
