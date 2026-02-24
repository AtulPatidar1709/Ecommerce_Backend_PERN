import cloudinary from '../../../config/cloudinary.js';

export const uploadImageBuffer = (
  buffer: Buffer,
  folder: string,
): Promise<{ publicId: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          use_filename: false,
          unique_filename: true,
        },
        (error, result) => {
          if (error || !result) return reject(error);

          resolve({
            publicId: result.public_id,
          });
        },
      )
      .end(buffer);
  });
};
