"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mainRouter = express_1.default.Router();
mainRouter.use((req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized');
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    if (!process.env.JWT_PRIVATE_KEY) {
        throw new Error('Failed to get jwt private key');
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_PRIVATE_KEY, (error, payload) => {
        if (error) {
            return res.status(401).send('Unauthorized');
        }
        req.user = payload;
        next();
    });
});
exports.default = mainRouter;
