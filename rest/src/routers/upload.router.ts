import express, { Request, Response } from 'express';
import { MulterError } from 'multer';
import { uploadFile } from '../utils/upload.utils';
import path from 'path';
import { s3DeleteFile, s3UploadFile } from '../services/s3-upload.service';
import { validate } from '../middlewares/validate.middleware';
import { deleteFileSchema } from '../schemas/upload.schema';
import { readFile, unlink } from 'fs/promises';

const uploadRouter = express.Router();

uploadRouter.post('/', async(req: Request, res: Response) => {
  try {
    uploadFile(req, res, async(error) => {
      if(error instanceof MulterError) {
        return res.status(400).json({
          message: error.message,
        });
      } else if(error) {
        return res.status(400).json({
          message: (error as Error).message,
        });
      }

      if(!req.file) {
        return res.status(400).json({
          message: 'No file exist'
        });
      }

      const filePath = path.join(__dirname, `../uploads/${req.file.filename}`);

      const buffer = await readFile(filePath);

      await unlink(filePath); // delete the file

      const uploadedFile = await s3UploadFile({file: buffer, key: req.file.filename});

      res.status(200).json({
        url: uploadedFile,
        name: req.file.filename
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

uploadRouter.delete('/', validate(deleteFileSchema), async(req: Request, res: Response) => {
  try { 
    const { url } = req.query;

    const fileName = path.basename(String(url));
    await s3DeleteFile(fileName);

    res.status(200).json({
      message: 'File deleted successfully',
    });

  } catch (error) {
    res.status(500).json(error);
  }
});

export default uploadRouter;
