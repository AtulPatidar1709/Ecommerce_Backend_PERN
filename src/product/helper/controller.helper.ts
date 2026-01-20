import { Request } from 'express';
import { AppError } from '../../utils/AppError';
import { createProductSchema } from '../product.schema';
import { uploadBufferToCloudinary } from '../utils/uploadToCloudinary';

const getFiles = (req: Request): Express.Multer.File[] => {
  return (req.files as Express.Multer.File[]) || [];
};

const validateFiles = (files: Express.Multer.File[], minRequired: number) => {
  if (!files || files.length < minRequired) {
    throw new AppError(
      `At least ${minRequired} image${minRequired > 1 ? 's' : ''} required`,
      400,
    );
  }
};

const validatePrimaryIndex = (primaryIndex: number, fileCount: number) => {
  if (
    Number.isNaN(primaryIndex) ||
    primaryIndex < 0 ||
    primaryIndex >= fileCount
  ) {
    throw new AppError('Primary image index is invalid', 400);
  }
};

const uploadImages = async (
  files: Express.Multer.File[],
): Promise<string[]> => {
  return Promise.all(
    files.map((file) => uploadBufferToCloudinary(file.buffer, 'products')),
  );
};

const parseCreateProductData = (
  body: Record<string, unknown>,
  imageUrls: string[],
  primaryIndex: number,
) => {
  return createProductSchema.parse({
    ...body,
    price: Number((body as Record<string, unknown>).price),
    stock: Number((body as Record<string, unknown>).stock),
    images: imageUrls.map((url) => ({ imageUrl: url })),
    primaryIndex,
  });
};

type ImageData = { file?: File; imageUrl?: string; id?: string };

const processUpdateImages = async (
  imagesData: ImageData[],
  files: Express.Multer.File[],
  primaryIndex: number,
) => {
  let fileIndex = 0;

  return Promise.all(
    imagesData.map(async (img, idx) => {
      if (img.file && files[fileIndex]) {
        const url = await uploadBufferToCloudinary(
          files[fileIndex].buffer,
          'products',
        );
        fileIndex++;

        return {
          imageUrl: url,
          isPrimary: idx === Number(primaryIndex),
        };
      }

      if (img.imageUrl) {
        return {
          id: img.id,
          imageUrl: img.imageUrl,
          isPrimary: idx === Number(primaryIndex),
        };
      }

      throw new AppError('Invalid image data provided', 400);
    }),
  );
};

export {
  getFiles,
  validateFiles,
  validatePrimaryIndex,
  uploadImages,
  parseCreateProductData,
  processUpdateImages,
};
