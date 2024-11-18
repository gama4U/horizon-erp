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
exports.findPackageById = void 0;
exports.createPackage = createPackage;
exports.updatePackage = updatePackage;
exports.deletePackage = deletePackage;
exports.findPackages = findPackages;
exports.updatePackageApprover = updatePackageApprover;
const db_utils_1 = __importDefault(require("../utils/db.utils"));
const generate_number_1 = require("../utils/generate-number");
function createPackage(_a) {
    return __awaiter(this, void 0, void 0, function* () {
        var { officeBranch } = _a, data = __rest(_a, ["officeBranch"]);
        const latestPackage = yield db_utils_1.default.package.findFirst({
            where: {
                officeBranch
            },
            orderBy: {
                sequenceNumber: 'desc'
            }
        });
        const packageNumber = (0, generate_number_1.getNextPackageNumber)((latestPackage === null || latestPackage === void 0 ? void 0 : latestPackage.packageNumber) || null, officeBranch);
        return yield db_utils_1.default.package.create({
            data: Object.assign({ packageNumber, officeBranch }, data)
        });
    });
}
function updatePackage(_a) {
    return __awaiter(this, void 0, void 0, function* () {
        var { id } = _a, data = __rest(_a, ["id"]);
        return yield db_utils_1.default.package.update({
            where: { id },
            data
        });
    });
}
function deletePackage(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.package.delete({
            where: { id },
        });
    });
}
function findPackages(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { skip, take, search, branch } = params;
        let searchFilter = {};
        if (search) {
            searchFilter = {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { packageNumber: { contains: search, mode: "insensitive" } }
                ],
            };
        }
        const findPackages = db_utils_1.default.package.findMany({
            where: Object.assign(Object.assign({}, searchFilter), { officeBranch: branch }),
            include: {
                creator: true,
                approver: true,
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: skip || 0,
            take: take || 10,
        });
        const countPackages = db_utils_1.default.package.count({
            where: Object.assign(Object.assign({}, searchFilter), { officeBranch: branch }),
        });
        const [packages, total] = yield db_utils_1.default.$transaction([findPackages, countPackages]);
        return { packages, total };
    });
}
const findPackageById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_utils_1.default.package.findUnique({
        where: { id },
        include: {
            accommodations: true,
            airfares: true,
            creator: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                    userType: true,
                    signature: true
                }
            },
            approver: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                    userType: true,
                    signature: true
                }
            },
        }
    });
});
exports.findPackageById = findPackageById;
function updatePackageApprover(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, approverId }) {
        return yield db_utils_1.default.package.update({
            where: { id },
            data: { approverId }
        });
    });
}
