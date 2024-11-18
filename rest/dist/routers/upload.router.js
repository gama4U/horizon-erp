"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("multer");
const upload_utils_1 = require("../utils/upload.utils");
const path_1 = __importDefault(require("path"));
const s3_upload_service_1 = require("../services/s3-upload.service");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const upload_schema_1 = require("../schemas/upload.schema");
const promises_1 = require("fs/promises");
const uploadRouter = express_1.default.Router();
uploadRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, upload_utils_1.uploadFile)(req, res, (error) => __awaiter(void 0, void 0, void 0, function* () {
            if (error instanceof multer_1.MulterError) {
                return res.status(400).json({
                    message: error.message,
                });
            }
            else if (error) {
                return res.status(400).json({
                    message: error.message,
                });
            }
            if (!req.file) {
                return res.status(400).json({
                    message: 'No file exist'
                });
            }
            const filePath = path_1.default.join(__dirname, `../uploads/${req.file.filename}`);
            const buffer = yield (0, promises_1.readFile)(filePath);
            yield (0, promises_1.unlink)(filePath); // delete the file
            const uploadedFile = yield (0, s3_upload_service_1.s3UploadFile)({ file: buffer, key: req.file.filename });
            res.status(200).json({
                url: uploadedFile,
                name: req.file.filename
            });
        }));
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
uploadRouter.delete('/', (0, validate_middleware_1.validate)(upload_schema_1.deleteFileSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url } = req.query;
        const fileName = path_1.default.basename(String(url));
        yield (0, s3_upload_service_1.s3DeleteFile)(fileName);
        res.status(200).json({
            message: 'File deleted successfully',
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
exports.default = uploadRouter;
