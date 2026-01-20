import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { CreateBannerInput, UpdateBannerInput } from './banner.schema';

export const createBanner = async (data: CreateBannerInput) => {
  const banner = await prisma.banner.create({
    data: {
      title: data.title,
      imageUrl: data.imageUrl,
      linkUrl: data.linkUrl,
    },
  });

  return {
    success: true,
    message: 'Banner created successfully',
    data: banner,
  };
};

export const getAllBanners = async (isActive?: boolean) => {
  const where = isActive !== undefined ? { isActive } : {};

  const banners = await prisma.banner.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return {
    success: true,
    message: 'Banners fetched successfully',
    data: banners,
    count: banners.length,
  };
};

export const getActiveBanners = async () => {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return {
    success: true,
    message: 'Active banners fetched successfully',
    data: banners,
    count: banners.length,
  };
};

export const getBannerById = async (bannerId: string) => {
  const banner = await prisma.banner.findUnique({
    where: { id: bannerId },
  });

  if (!banner) {
    throw new AppError('Banner not found', 404);
  }

  return {
    success: true,
    message: 'Banner fetched successfully',
    data: banner,
  };
};

export const updateBanner = async (
  bannerId: string,
  data: UpdateBannerInput,
) => {
  const existingBanner = await prisma.banner.findUnique({
    where: { id: bannerId },
  });

  if (!existingBanner) {
    throw new AppError('Banner not found', 404);
  }

  const banner = await prisma.banner.update({
    where: { id: bannerId },
    data: {
      title: data.title,
      imageUrl: data.imageUrl,
      linkUrl: data.linkUrl,
    },
  });

  return {
    success: true,
    message: 'Banner updated successfully',
    data: banner,
  };
};

export const toggleBannerStatus = async (bannerId: string) => {
  const existingBanner = await prisma.banner.findUnique({
    where: { id: bannerId },
  });

  if (!existingBanner) {
    throw new AppError('Banner not found', 404);
  }

  const banner = await prisma.banner.update({
    where: { id: bannerId },
    data: { isActive: !existingBanner.isActive },
  });

  return {
    success: true,
    message: `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`,
    data: banner,
  };
};

export const deleteBanner = async (bannerId: string) => {
  const existingBanner = await prisma.banner.findUnique({
    where: { id: bannerId },
  });

  if (!existingBanner) {
    throw new AppError('Banner not found', 404);
  }

  await prisma.banner.delete({
    where: { id: bannerId },
  });

  return {
    success: true,
    message: 'Banner deleted successfully',
  };
};
