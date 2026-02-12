import { Request } from 'express';
import { AppError } from '../../utils/AppError';
import { createProductSchema } from '../product.schema';
import { uploadImageBuffer } from '../utils/cloudinary/uploadToCloudinary';

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
): Promise<{ publicId: string }[]> => {
  return Promise.all(
    files.map((file) => uploadImageBuffer(file.buffer, 'products')),
  );
};

const parseCreateProductData = (
  body: Record<string, unknown>,
  images: {
    publicId: string;
  }[],
  primaryIndex: number,
) => {
  return createProductSchema.parse({
    ...body,
    price: Number((body as Record<string, unknown>).price),
    stock: Number((body as Record<string, unknown>).stock),
    discountPrice: Number((body as Record<string, unknown>).discountPrice),
    images: images.map((url) => ({ imageUrl: url })),
    primaryIndex,
  });
};

type ImageData = { file?: File; publicId: string; id?: string };

const prepareUpdateImagesPayload = async (
  imagesData: ImageData[],
  files: Express.Multer.File[],
  primaryIndex: number,
) => {
  let fileIndex = 0;

  return Promise.all(
    imagesData.map(async (img, idx) => {
      // New uploaded file
      if (img.file && files[fileIndex]) {
        const { publicId } = await uploadImageBuffer(
          files[fileIndex].buffer,
          'products',
        );
        fileIndex++;

        return {
          publicId,
          isPrimary: idx === primaryIndex,
        };
      }

      // Existing image
      if (img.publicId && img.id) {
        return {
          id: img.id,
          publicId: img.publicId,
          isPrimary: idx === primaryIndex,
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
  prepareUpdateImagesPayload,
};
