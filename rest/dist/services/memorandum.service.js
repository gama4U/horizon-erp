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
exports.createMemorandum = createMemorandum;
exports.deleteMemorandum = deleteMemorandum;
exports.updateMemorandum = updateMemorandum;
exports.fetchMemorandums = fetchMemorandums;
exports.findMemorandumById = findMemorandumById;
exports.fetchMemorandumSummary = fetchMemorandumSummary;
exports.updateMemorandumApprover = updateMemorandumApprover;
const client_1 = require("@prisma/client");
const db_utils_1 = __importDefault(require("../utils/db.utils"));
const generate_number_1 = require("../utils/generate-number");
const moment_1 = __importDefault(require("moment"));
function createMemorandum(_a) {
    return __awaiter(this, void 0, void 0, function* () {
        var { branch } = _a, data = __rest(_a, ["branch"]);
        const lastMemo = yield db_utils_1.default.memorandum.findFirst({
            where: {
                branch: branch,
            },
            orderBy: { memorandumNumber: 'desc' },
        });
        const nextMemoNumber = (0, generate_number_1.getNextMemorandumNumber)((lastMemo === null || lastMemo === void 0 ? void 0 : lastMemo.memorandumNumber) || null, String(branch));
        return yield db_utils_1.default.memorandum.create({
            data: Object.assign(Object.assign({}, data), { branch: branch, memorandumNumber: nextMemoNumber }),
        });
    });
}
function deleteMemorandum(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.memorandum.delete({
            where: {
                id
            }
        });
    });
}
function updateMemorandum(_a) {
    return __awaiter(this, void 0, void 0, function* () {
        var { id } = _a, data = __rest(_a, ["id"]);
        return yield db_utils_1.default.memorandum.update({
            where: {
                id
            },
            data
        });
    });
}
function fetchMemorandums(_a) {
    return __awaiter(this, arguments, void 0, function* ({ skip, take, search, branch }) {
        let whereInput = {};
        if (search) {
            whereInput = {
                OR: [
                    { subject: { contains: search, mode: "insensitive" } },
                    { to: { contains: search, mode: "insensitive" } },
                    { memorandumNumber: { contains: search, mode: "insensitive" } },
                ],
            };
        }
        const memorandums = db_utils_1.default.memorandum.findMany({
            where: Object.assign(Object.assign({}, whereInput), { branch: branch }),
            skip: skip !== null && skip !== void 0 ? skip : 0,
            take: take !== null && take !== void 0 ? take : 10,
            orderBy: {
                createdAt: 'desc'
            }
        });
        const countMemorandums = db_utils_1.default.memorandum.count({
            where: Object.assign(Object.assign({}, whereInput), { branch: branch }),
        });
        const [memorandumData, total] = yield db_utils_1.default.$transaction([
            memorandums,
            countMemorandums
        ]);
        return { memorandumData, total };
    });
}
function findMemorandumById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.memorandum.findUnique({
            where: { id },
            include: {
                creator: true,
                approver: true
            }
        });
    });
}
function fetchMemorandumSummary() {
    return __awaiter(this, void 0, void 0, function* () {
        const oneWeekAgo = (0, moment_1.default)().subtract(7, 'days').startOf('day').toDate();
        const [total, since7days, cebuCount, calbayogCount] = yield Promise.all([
            db_utils_1.default.memorandum.count(),
            db_utils_1.default.memorandum.count({
                where: {
                    createdAt: {
                        gte: oneWeekAgo,
                    },
                },
            }),
            db_utils_1.default.memorandum.count({
                where: {
                    branch: client_1.OfficeBranch.CEBU
                }
            }),
            db_utils_1.default.memorandum.count({
                where: {
                    branch: client_1.OfficeBranch.CALBAYOG
                }
            }),
        ]);
        const rate = total > 0 ? (since7days / total) * 100 : 0;
        return {
            total, since7days, rate
        };
    });
}
function updateMemorandumApprover(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, approverId }) {
        return yield db_utils_1.default.memorandum.update({
            where: { id },
            data: { approverId }
        });
    });
}
