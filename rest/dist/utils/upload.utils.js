"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const storage_utils_1 = __importDefault(require("./storage.utils"));
const constants_1 = require("../constants");
const imageSizeLimit = 500 * 1000 * 1000; // 500 MB
exports.uploadFile = (0, multer_1.default)({
    storage: storage_utils_1.default,
    limits: {
        fileSize: imageSizeLimit,
        files: 1
    },
    fileFilter(req, file, callback) {
        if (!constants_1.ACCEPTED_FILE_TYPES.includes(file.mimetype)) {
            callback(new Error('Invalid file type'));
            return;
        }
        callback(null, true);
    }
}).single('file');
