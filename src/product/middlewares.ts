import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  console.log('Uploading file:', file.originalname, 'mimetype:', file.mimetype);
  if (!file.mimetype.startsWith('image/')) {
    console.log('Images only! Rejected file:', file.originalname);
    cb(new Error('Only image files are allowed'));
  } else {
    console.log('Image is uploading...');
    cb(null, true);
  }
  console.log('Uploading file: finished');
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
