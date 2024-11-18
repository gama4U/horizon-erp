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
const user_service_1 = require("../services/user.service");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const profile_schema_1 = require("../schemas/profile.schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const profileRouter = express_1.default.Router();
profileRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const profile = yield (0, user_service_1.findUserById)(userId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        const { password } = profile, sanitizedProfile = __rest(profile, ["password"]);
        return res.status(200).json(sanitizedProfile);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
profileRouter.patch('/avatar', (0, validate_middleware_1.validate)(profile_schema_1.updateAvatarSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const { avatar } = req.body;
        const updated = yield (0, user_service_1.updateUserAvatar)({ id: userId, avatar });
        if (!updated) {
            throw new Error('Failed to update user avatar');
        }
        return res.status(200).json({
            message: 'Avatar updated successfully'
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}));
profileRouter.put('/', (0, validate_middleware_1.validate)(profile_schema_1.updateProfileSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const updated = yield (0, user_service_1.updateUser)(Object.assign({ id: userId }, req.body));
        if (!updated) {
            throw new Error('Failed to update user profile');
        }
        return res.status(200).json({
            message: 'User profile updated successfully'
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}));
profileRouter.put('/password', (0, validate_middleware_1.validate)(profile_schema_1.updateUserPasswordSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const { currentPassword, password } = req.body;
        const saltRounds = 15;
        const foundUser = yield (0, user_service_1.findUserById)(userId);
        if (!foundUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const correctPassword = yield bcrypt_1.default.compare(currentPassword, foundUser.password);
        if (!correctPassword) {
            return res.status(400).json({
                message: 'Current password is incorrect'
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const updated = yield (0, user_service_1.updateUserPassword)({
            id: userId,
            password: hashedPassword
        });
        if (!updated) {
            throw new Error('Failed to update user password');
        }
        return res.status(200).json({
            message: 'Password updated successfully'
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}));
profileRouter.patch('/signature', (0, validate_middleware_1.validate)(profile_schema_1.updateSignatureSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const { signature } = req.body;
        const updated = yield (0, user_service_1.updateUserSignature)({ id: userId, signature });
        if (!updated) {
            throw new Error('Failed to update user signature');
        }
        return res.status(200).json({
            message: 'Signature updated successfully'
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = profileRouter;
