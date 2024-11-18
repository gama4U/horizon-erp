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
const user_schema_1 = require("../schemas/user.schema");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const user_service_1 = require("../services/user.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRouter = express_1.default.Router();
const saltRounds = 15;
userRouter.post('/', (0, validate_middleware_1.validate)(user_schema_1.createUserSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { password } = _a, data = __rest(_a, ["password"]);
        const foundUser = yield (0, user_service_1.getUserByEmail)(data.email);
        if (foundUser)
            return res.status(400).json({
                message: 'Account already exists'
            });
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const created = yield (0, user_service_1.createUser)(Object.assign(Object.assign({}, data), { password: hashedPassword }));
        if (!created)
            throw new Error('Failed to create user');
        res.status(200).json({
            message: 'User created successfully'
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
userRouter.get('/', (0, validate_middleware_1.validate)(user_schema_1.getUsersSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            skip: Number(req.query.skip),
            take: Number(req.query.take),
            search: req.query.search,
            branch: req.query.branch,
            type: req.query.type
        };
        const users = yield (0, user_service_1.findUsers)(query);
        if (!users)
            throw new Error('Failed to get users');
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
userRouter.put('/:id', (0, validate_middleware_1.validate)(user_schema_1.updateUserSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const _a = req.body, { password } = _a, data = __rest(_a, ["password"]);
        const hashedPassword = password && ({
            password: yield bcrypt_1.default.hash(password, saltRounds)
        });
        const updated = yield (0, user_service_1.updateUser)(Object.assign(Object.assign({ id }, data), hashedPassword));
        if (!updated)
            throw new Error('Failed to update user');
        res.status(200).json({
            message: 'User updated successfully'
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
userRouter.delete('/:id', (0, validate_middleware_1.validate)(user_schema_1.deleteUserSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield (0, user_service_1.deleteUser)(id);
        if (!deleted)
            throw new Error('Failed to delete user');
        res.status(200).json({
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
userRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield (0, user_service_1.findUserById)(id);
        if (!user) {
            throw new Error('Failed to get user');
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
exports.default = userRouter;
