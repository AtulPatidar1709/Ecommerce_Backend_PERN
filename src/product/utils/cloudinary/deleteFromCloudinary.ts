import cloudinary from '../../../config/cloudinary.js';

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });
  } catch (err) {
    console.error(`Error deleting Cloudinary image (${publicId}):`, err);
  }
};
