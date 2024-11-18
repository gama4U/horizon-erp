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
exports.createSalesAgreement = createSalesAgreement;
exports.updateSalesAgreement = updateSalesAgreement;
exports.findSalesAgreements = findSalesAgreements;
exports.findSalesAgreementById = findSalesAgreementById;
exports.deleteSalesAgreementById = deleteSalesAgreementById;
exports.fetchSalesAgreementSummary = fetchSalesAgreementSummary;
exports.updateSalesAgreementApprover = updateSalesAgreementApprover;
const client_1 = require("@prisma/client");
const db_utils_1 = __importDefault(require("../utils/db.utils"));
const moment_1 = __importDefault(require("moment"));
const generate_number_1 = require("../utils/generate-number");
function createSalesAgreement(_a) {
    return __awaiter(this, void 0, void 0, function* () {
        var { officeBranch } = _a, data = __rest(_a, ["officeBranch"]);
        const lastSalesAgreement = yield db_utils_1.default.salesAgreement.findFirst({
            where: {
                client: {
                    officeBranch,
                },
                serialNumber: {
                    contains: officeBranch === 'CEBU' ? 'CEB' : 'CAL',
                },
            },
            orderBy: {
                serialNumber: 'desc',
            },
        });
        const serialNumber = (0, generate_number_1.getNextSerialNumber)((lastSalesAgreement === null || lastSalesAgreement === void 0 ? void 0 : lastSalesAgreement.serialNumber) || null, officeBranch);
        return db_utils_1.default.salesAgreement.create({
            data: Object.assign(Object.assign({}, data), { serialNumber, sequenceNumber: parseInt(serialNumber.slice(2, 7)) }),
        });
    });
}
function updateSalesAgreement(_a) {
    return __awaiter(this, void 0, void 0, function* () {
        var { id } = _a, data = __rest(_a, ["id"]);
        return db_utils_1.default.salesAgreement.update({
            where: {
                id
            },
            data
        });
    });
}
function findSalesAgreements(_a) {
    return __awaiter(this, arguments, void 0, function* ({ skip, take, search, branch, typeOfClient }) {
        let searchFilter = {};
        if (search) {
            searchFilter = {
                OR: [
                    { client: { name: { contains: search, mode: "insensitive" } } },
                    { client: { email: { contains: search, mode: "insensitive" } } },
                    { serialNumber: { contains: search, mode: "insensitive" } },
                ],
            };
        }
        const where = Object.assign(Object.assign({}, searchFilter), { client: {
                officeBranch: branch,
                clientType: typeOfClient,
            } });
        const findSalesAgreements = db_utils_1.default.salesAgreement.findMany({
            where,
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                        userType: true,
                        signature: true,
                    },
                },
                approver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                        userType: true,
                        signature: true,
                    },
                },
                client: true,
                _count: {
                    select: {
                        salesAgreementItems: true,
                    },
                },
            },
            skip: skip !== null && skip !== void 0 ? skip : 0,
            take: take !== null && take !== void 0 ? take : 10,
            orderBy: {
                createdAt: 'desc',
            },
        });
        const countSalesAgreements = db_utils_1.default.salesAgreement.count({
            where,
        });
        const [salesAgreements, total] = yield db_utils_1.default.$transaction([
            findSalesAgreements,
            countSalesAgreements,
        ]);
        return { salesAgreements, total };
    });
}
function findSalesAgreementById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.salesAgreement.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        id: true,
                        avatar: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        userType: true,
                        signature: true
                    }
                },
                approver: {
                    select: {
                        id: true,
                        avatar: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        userType: true,
                        signature: true
                    }
                },
                client: true,
                purchaseRequestOrders: true,
                transaction: true,
                salesAgreementItems: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                _count: {
                    select: {
                        salesAgreementItems: true
                    }
                }
            }
        });
    });
}
function deleteSalesAgreementById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.salesAgreement.delete({
            where: {
                id
            }
        });
    });
}
function fetchSalesAgreementSummary() {
    return __awaiter(this, void 0, void 0, function* () {
        const oneWeekAgo = (0, moment_1.default)().subtract(7, 'days').startOf('day').toDate();
        const [total, since7days, cebuCount, calbayogCount] = yield Promise.all([
            db_utils_1.default.salesAgreement.count(),
            db_utils_1.default.salesAgreement.count({
                where: {
                    createdAt: {
                        gte: oneWeekAgo,
                    },
                },
            }),
            db_utils_1.default.salesAgreement.count({
                where: {
                    client: {
                        officeBranch: client_1.OfficeBranch.CEBU
                    }
                }
            }),
            db_utils_1.default.salesAgreement.count({
                where: {
                    client: {
                        officeBranch: client_1.OfficeBranch.CALBAYOG
                    }
                }
            })
        ]);
        const rate = total > 0 ? (since7days / total) * 100 : 0;
        return {
            total, since7days, rate, cebuCount, calbayogCount
        };
    });
}
function updateSalesAgreementApprover(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, approverId }) {
        return yield db_utils_1.default.salesAgreement.update({
            where: { id },
            data: { approverId }
        });
    });
}
