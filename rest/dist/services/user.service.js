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
exports.createUser = createUser;
exports.getUserByEmail = getUserByEmail;
exports.findUserById = findUserById;
exports.findUsers = findUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.updateUserAvatar = updateUserAvatar;
exports.updateUserPassword = updateUserPassword;
exports.updateUserSignature = updateUserSignature;
const db_utils_1 = __importDefault(require("../utils/db.utils"));
function createUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.user.create({ data });
    });
}
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.user.findFirst({
            where: {
                email
            }
        });
    });
}
function findUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.user.findUnique({
            where: {
                id
            },
        });
    });
}
function findUsers(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { skip, take, search, type, branch } = params;
        let searchFilter = {};
        if (search) {
            const searchParts = search.split(/\s+/);
            searchFilter = {
                AND: searchParts.map((part) => ({
                    OR: [
                        { firstName: { contains: part, mode: "insensitive" } },
                        { lastName: { contains: part, mode: "insensitive" } },
                        { email: { contains: part, mode: "insensitive" } }
                    ],
                })),
            };
        }
        const where = Object.assign(Object.assign({}, searchFilter), (type && { userType: type }));
        const findUsers = db_utils_1.default.user.findMany({
            where: Object.assign(Object.assign({}, where), { officeBranch: branch }),
            include: {
                _count: true
            },
            skip: skip || 0,
            take: take || 10,
        });
        const countUsers = db_utils_1.default.user.count({
            where: Object.assign(Object.assign({}, where), { officeBranch: branch }),
        });
        const [users, total] = yield db_utils_1.default.$transaction([findUsers, countUsers]);
        const sanitizedUsers = users.map((_a) => {
            var { password } = _a, user = __rest(_a, ["password"]);
            return user;
        });
        return { users: sanitizedUsers, total };
    });
}
function updateUser(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = params, data = __rest(params, ["id"]);
        return yield db_utils_1.default.user.update({
            where: {
                id: params.id
            },
            data: Object.assign({}, data)
        });
    });
}
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.user.delete({
            where: {
                id
            }
        });
    });
}
function updateUserAvatar(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, avatar }) {
        return yield db_utils_1.default.user.update({
            where: { id },
            data: {
                avatar
            }
        });
    });
}
function updateUserPassword(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, password }) {
        return yield db_utils_1.default.user.update({
            where: { id },
            data: {
                password
            }
        });
    });
}
function updateUserSignature(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, signature }) {
        return yield db_utils_1.default.user.update({
            where: { id },
            data: { signature }
        });
    });
}
