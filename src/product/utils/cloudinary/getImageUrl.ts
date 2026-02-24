import cloudinary from '../../../config/cloudinary.js';

export const getImageUrl = (
  publicId: string,
  options?: {
    width?: number;
    quality?: string;
    format?: string;
  },
) => {
  return cloudinary.url(publicId, {
    secure: true,
    width: options?.width ?? 600,
    quality: options?.quality ?? 'auto',
    fetch_format: options?.format ?? 'auto',
  });
};
