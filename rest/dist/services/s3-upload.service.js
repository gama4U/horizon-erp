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
exports.s3UploadFile = s3UploadFile;
exports.s3DeleteFile = s3DeleteFile;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_client_utils_1 = __importDefault(require("../utils/s3-client.utils"));
const BUCKET_NAME = 'horizon-express';
function s3UploadFile(_a) {
    return __awaiter(this, arguments, void 0, function* ({ file, key }) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file,
            ACL: 'public-read',
        });
        yield s3_client_utils_1.default.send(command);
        return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    });
}
function s3DeleteFile(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
        });
        return yield s3_client_utils_1.default.send(command);
    });
}
