import cloudinary from '../../../config/cloudinary';

export interface ImageVariants {
  original: string;
  large: string;
  medium: string;
  thumbnail: string;
}

export const buildImageVariants = (publicId: string): ImageVariants => ({
  original: cloudinary.url(publicId, {
    quality: 'auto',
    fetch_format: 'auto',
  }),
  large: cloudinary.url(publicId, {
    width: 1200,
    crop: 'limit',
    quality: 'auto',
    fetch_format: 'auto',
  }),
  medium: cloudinary.url(publicId, {
    width: 600,
    crop: 'limit',
    quality: 'auto',
    fetch_format: 'auto',
  }),
  thumbnail: cloudinary.url(publicId, {
    width: 150,
    height: 150,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  }),
});
