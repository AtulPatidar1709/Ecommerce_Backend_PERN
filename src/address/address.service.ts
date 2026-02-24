import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { CreateAddressInput, UpdateAddressInput } from "./address.schema.js";

export const createAddress = async (
  userId: string,
  data: CreateAddressInput,
) => {
  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const address = await prisma.address.create({
    data: {
      userId,
      name: data.name,
      phone: data.phone,
      street: data.street,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: data.country || 'India',
    },
  });

  return {
    success: true,
    message: 'Address created successfully',
    data: address,
  };
};

export const getAllAddresses = async (userId: string) => {
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { id: 'asc' },
  });

  return {
    success: true,
    message: 'Addresses fetched successfully',
    addresses: addresses,
    count: addresses.length,
  };
};

export const getAddressById = async (userId: string, addressId: string) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  return {
    success: true,
    message: 'Address fetched successfully',
    address: address,
  };
};

export const updateAddress = async (
  userId: string,
  addressId: string,
  data: UpdateAddressInput,
) => {
  // Verify address exists and belongs to user
  const existingAddress = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!existingAddress) {
    throw new AppError('Address not found', 404);
  }

  const updatedAddress = await prisma.address.update({
    where: { id: addressId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.phone && { phone: data.phone }),
      ...(data.street && { street: data.street }),
      ...(data.city && { city: data.city }),
      ...(data.state && { state: data.state }),
      ...(data.pincode && { pincode: data.pincode }),
      ...(data.country && { country: data.country }),
    },
  });

  return {
    success: true,
    message: 'Address updated successfully',
    data: updatedAddress,
  };
};

export const deleteAddress = async (userId: string, addressId: string) => {
  // Verify address exists and belongs to user
  const existingAddress = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!existingAddress) {
    throw new AppError('Address not found', 404);
  }

  // Check if address is being used in any active orders
  const activeOrders = await prisma.order.findFirst({
    where: {
      addressId,
      status: {
        not: 'CANCELLED',
      },
    },
  });

  if (activeOrders) {
    throw new AppError(
      'Cannot delete address that is being used in active orders',
      400,
    );
  }

  await prisma.address.delete({
    where: { id: addressId },
  });

  return {
    success: true,
    message: 'Address deleted successfully',
  };
};
