import cloudinary from '../../config/cloudinary';

/**
 * Deletes an image from Cloudinary given its full URL.
 * @param url Full Cloudinary URL of the image
 */
export const deleteFromCloudinary = async (url: string): Promise<void> => {
  if (!url) return;

  try {
    // Extract public_id from URL
    // Example URL: https://res.cloudinary.com/<cloud>/image/upload/v1234567/folder/image.jpg
    const parts = url.split('/');
    const lastPart = parts.slice(7).join('/'); // get path after /upload/
    const publicId = lastPart.replace(/\.[^/.]+$/, ''); // remove file extension

    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (err) {
    console.error('Error deleting image from Cloudinary:', err);
  }
};
