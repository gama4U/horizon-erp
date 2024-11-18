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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findClientById = void 0;
exports.createClient = createClient;
exports.updateClient = updateClient;
exports.deleteClient = deleteClient;
exports.fetchClients = fetchClients;
exports.updateClientApprover = updateClientApprover;
exports.fetchClientSummary = fetchClientSummary;
const client_1 = require("@prisma/client");
const db_utils_1 = __importDefault(require("../utils/db.utils"));
const moment_1 = __importDefault(require("moment"));
function createClient(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.client.create({
            data
        });
    });
}
function updateClient(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.client.update({
            where: {
                id: id
            },
            data
        });
    });
}
function deleteClient(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.client.delete({
            where: {
                id: id
            }
        });
    });
}
function fetchClients(_a) {
    return __awaiter(this, arguments, void 0, function* ({ skip, take, search, branch, typeOfClient, isApproved }) {
        let whereInput = {};
        if (search) {
            const searchParts = search.split(/\s+/);
            whereInput = {
                AND: searchParts.map((part) => ({
                    OR: [
                        { name: { contains: part, mode: "insensitive" } },
                    ],
                })),
            };
        }
        if (isApproved === true) {
            whereInput.approverId = { not: null };
        }
        const client = db_utils_1.default.client.findMany({
            where: Object.assign(Object.assign({}, whereInput), { clientType: typeOfClient, officeBranch: branch }),
            include: {
                transactions: true,
                creator: true,
                approver: true,
                _count: {
                    select: {
                        transactions: true,
                    },
                },
            },
            skip: skip !== null && skip !== void 0 ? skip : 0,
            take: take !== null && take !== void 0 ? take : 10,
            orderBy: {
                createdAt: 'desc',
            },
        });
        const countClients = db_utils_1.default.client.count({
            where: Object.assign(Object.assign({}, whereInput), { clientType: typeOfClient, officeBranch: branch }),
        });
        const [clientsData, total] = yield db_utils_1.default.$transaction([client, countClients]);
        return { clientsData, total };
    });
}
const findClientById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_utils_1.default.client.findUnique({
        where: { id }
    });
});
exports.findClientById = findClientById;
function updateClientApprover(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, approverId }) {
        return yield db_utils_1.default.client.update({
            where: { id },
            data: { approverId }
        });
    });
}
function fetchClientSummary(startMonth, endMonth) {
    return __awaiter(this, void 0, void 0, function* () {
        const summary = [];
        const currentYear = (0, moment_1.default)().year();
        const isSameYear = endMonth >= startMonth;
        const startYear = isSameYear ? currentYear : currentYear - 1;
        const endYear = isSameYear ? currentYear : currentYear;
        const calbayogCount = yield db_utils_1.default.client.count({
            where: {
                officeBranch: client_1.OfficeBranch.CALBAYOG
            }
        });
        const cebuCount = yield db_utils_1.default.client.count({
            where: {
                officeBranch: client_1.OfficeBranch.CEBU
            }
        });
        for (let month = startMonth; month <= endMonth; month++) {
            const monthStart = (0, moment_1.default)().year(month === 1 && startYear > currentYear ? startYear : currentYear).month(month - 1).startOf('month').toDate();
            const monthEnd = (0, moment_1.default)().year(month === 12 && endYear > currentYear ? endYear : currentYear).month(month - 1).endOf('month').toDate();
            const count = yield db_utils_1.default.client.count({
                where: {
                    createdAt: {
                        gte: monthStart,
                        lte: monthEnd,
                    },
                },
            });
            summary.push({
                month: (0, moment_1.default)(monthStart).format("MMMM"),
                desktop: count,
                cebuCount,
                calbayogCount
            });
        }
        return summary;
    });
}
