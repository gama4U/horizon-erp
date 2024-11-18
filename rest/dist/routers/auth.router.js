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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_service_1 = require("../services/user.service");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_schema_1 = require("../schemas/auth.schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authRouter = express_1.default.Router();
authRouter.post('/sign-in', (0, validate_middleware_1.validate)(auth_schema_1.signInSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const secretKey = process.env.JWT_PRIVATE_KEY;
        if (!secretKey)
            throw new Error('Missing jwt private key');
        const user = yield (0, user_service_1.getUserByEmail)(email);
        if (!user)
            return res.status(400).json({
                message: 'Account does not exist'
            });
        const { password: hashPassword } = user, userData = __rest(user, ["password"]);
        const verified = yield bcrypt_1.default.compare(password, hashPassword);
        if (!verified)
            return res.status(400).json({
                message: 'Incorrect password'
            });
        jsonwebtoken_1.default.sign(userData, secretKey, { algorithm: 'HS256', expiresIn: '12h' }, function (error, token) {
            if (error)
                throw new Error('JWT sign error');
            res.status(200).json({
                token,
                user: userData
            });
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
exports.default = authRouter;
