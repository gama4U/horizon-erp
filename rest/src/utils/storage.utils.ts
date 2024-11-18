import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const splitName = file.originalname.split('.');
    const fileExtension = splitName[splitName.length-1];
    const newFileName = uniqueSuffix + '.' + fileExtension;
    cb(null, newFileName);
  }
});

export default storage;
