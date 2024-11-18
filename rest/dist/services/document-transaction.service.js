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
exports.createDocumentTransaction = createDocumentTransaction;
exports.deleteDocumentTransaction = deleteDocumentTransaction;
exports.transmitDocument = transmitDocument;
exports.updateDocumentTransaction = updateDocumentTransaction;
exports.fetchDocumentTransactions = fetchDocumentTransactions;
exports.findDocumentTransactionById = findDocumentTransactionById;
exports.fetchDocumentTransactionsSummary = fetchDocumentTransactionsSummary;
const client_1 = require("@prisma/client");
const db_utils_1 = __importDefault(require("../utils/db.utils"));
const generate_number_1 = require("../utils/generate-number");
const moment_1 = __importDefault(require("moment"));
function createDocumentTransaction(data, officeBranch) {
    return __awaiter(this, void 0, void 0, function* () {
        const lastDts = yield db_utils_1.default.documentTransaction.findFirst({
            where: {
                client: {
                    officeBranch: officeBranch,
                }
            },
            orderBy: { dtsNumber: 'desc' },
        });
        const nextDtsNumber = (0, generate_number_1.getNextDtsNumber)((lastDts === null || lastDts === void 0 ? void 0 : lastDts.dtsNumber) || null, officeBranch);
        return yield db_utils_1.default.documentTransaction.create({
            data: Object.assign(Object.assign({}, data), { dtsNumber: nextDtsNumber }),
        });
    });
}
function deleteDocumentTransaction(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.documentTransaction.delete({
            where: {
                id
            }
        });
    });
}
function transmitDocument(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, transmittedById }) {
        return yield db_utils_1.default.documentTransaction.update({
            where: {
                id
            },
            data: {
                transmittedById
            }
        });
    });
}
function updateDocumentTransaction(_a) {
    return __awaiter(this, void 0, void 0, function* () {
        var { id } = _a, data = __rest(_a, ["id"]);
        return yield db_utils_1.default.documentTransaction.update({
            where: {
                id
            },
            data
        });
    });
}
function fetchDocumentTransactions(_a) {
    return __awaiter(this, arguments, void 0, function* ({ skip, take, search, RECIEVE, TRANSMITTAL, RETURN, branch }) {
        let whereInput = {};
        if (search) {
            whereInput.OR = [
                {
                    client: {
                        name: { contains: search, mode: "insensitive" },
                    },
                },
                { dtsNumber: { contains: search, mode: "insensitive" } },
            ];
        }
        const types = [];
        if (RECIEVE)
            types.push(client_1.DocumentTransactionType.RECIEVE);
        if (TRANSMITTAL)
            types.push(client_1.DocumentTransactionType.TRANSMITTAL);
        if (RETURN)
            types.push(client_1.DocumentTransactionType.RETURN);
        if (types.length > 0) {
            whereInput.type = {
                in: types,
            };
        }
        const documentTransactions = db_utils_1.default.documentTransaction.findMany({
            where: Object.assign(Object.assign({}, whereInput), { client: {
                    officeBranch: branch
                } }),
            skip: skip !== null && skip !== void 0 ? skip : 0,
            take: take !== null && take !== void 0 ? take : 10,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                client: true,
                preparedBy: true,
                recievedBy: true,
                returnedBy: true,
                transmittedBy: true,
            },
        });
        const countDocumentTransactions = db_utils_1.default.documentTransaction.count({
            where: Object.assign(Object.assign({}, whereInput), { client: {
                    officeBranch: branch
                } }),
        });
        const [documentTransactionData, total] = yield db_utils_1.default.$transaction([
            documentTransactions,
            countDocumentTransactions,
        ]);
        return { documentTransactionData, total };
    });
}
function findDocumentTransactionById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.documentTransaction.findUnique({
            where: { id },
            include: {
                preparedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        signature: true
                    }
                },
                client: true,
                recievedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        signature: true
                    }
                },
                returnedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        signature: true
                    }
                },
                transmittedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        signature: true
                    }
                }
            }
        });
    });
}
function fetchDocumentTransactionsSummary() {
    return __awaiter(this, void 0, void 0, function* () {
        const oneWeekAgo = (0, moment_1.default)().subtract(7, 'days').startOf('day').toDate();
        const [total, since7days, cebuCount, calbayogCount] = yield Promise.all([
            db_utils_1.default.documentTransaction.count(),
            db_utils_1.default.documentTransaction.count({
                where: {
                    createdAt: {
                        gte: oneWeekAgo,
                    },
                },
            }),
            db_utils_1.default.documentTransaction.count({
                where: {
                    client: {
                        officeBranch: client_1.OfficeBranch.CEBU
                    }
                }
            }),
            db_utils_1.default.documentTransaction.count({
                where: {
                    client: {
                        officeBranch: client_1.OfficeBranch.CALBAYOG
                    }
                }
            }),
        ]);
        const rate = total > 0 ? (since7days / total) * 100 : 0;
        return {
            total, since7days, rate, cebuCount, calbayogCount
        };
    });
}
