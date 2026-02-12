import { getImageUrl } from './getImageUrl';

export const mapImage = (publicId: string) => ({
  publicId,
  imageUrl: getImageUrl(publicId),
});
