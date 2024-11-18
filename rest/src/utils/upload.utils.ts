import multer from "multer";
import storage from "./storage.utils";
import { ACCEPTED_FILE_TYPES } from "../constants";

const imageSizeLimit = 500 * 1000 * 1000; // 500 MB

export const uploadFile = multer({
  storage,
  limits: {
    fileSize: imageSizeLimit,
    files: 1
  },
  fileFilter(req, file, callback) {
    if(!ACCEPTED_FILE_TYPES.includes(file.mimetype)) {
      callback(new Error('Invalid file type'));
      return;
    }
    callback(null, true);
  }
}).single('file');
