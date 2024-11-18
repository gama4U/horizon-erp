"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileSchema = void 0;
const zod_1 = require("zod");
exports.deleteFileSchema = zod_1.z.object({
    query: zod_1.z.object({
        url: zod_1.z.string().min(1, {
            message: 'Url is required'
        })
    })
});
