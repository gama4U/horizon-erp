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
exports.createTransaction = createTransaction;
exports.updateTransaction = updateTransaction;
exports.deleteTransaction = deleteTransaction;
exports.fetchTransaction = fetchTransaction;
exports.fetchTransactions = fetchTransactions;
exports.fetchTransactionSummary = fetchTransactionSummary;
exports.fetchRecentEntries = fetchRecentEntries;
exports.updateTransactionApprover = updateTransactionApprover;
const client_1 = require("@prisma/client");
const db_utils_1 = __importDefault(require("../utils/db.utils"));
const moment_1 = __importDefault(require("moment"));
const generate_number_1 = require("../utils/generate-number");
function createTransaction(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, creatorId, branch }) {
        const lastTransaction = yield db_utils_1.default.transaction.findFirst({
            where: {
                client: {
                    officeBranch: branch,
                },
                transactionNumber: {
                    contains: branch === client_1.OfficeBranch.CEBU ? 'CEB' : 'CLB'
                }
            },
            orderBy: {
                transactionNumber: 'desc',
            },
        });
        const nextTransactionNumber = (0, generate_number_1.getNextTransactionNumber)((lastTransaction === null || lastTransaction === void 0 ? void 0 : lastTransaction.transactionNumber) || null, branch);
        return yield db_utils_1.default.transaction.create({
            data: {
                transactionNumber: nextTransactionNumber,
                clientId: id,
                creatorId,
            },
        });
    });
}
function updateTransaction(_a) {
    return __awaiter(this, void 0, void 0, function* () {
        var { id } = _a, data = __rest(_a, ["id"]);
        if (data.salesAgreementId) {
            const salesAgreementReferencedAlready = yield db_utils_1.default.transaction.findFirst({
                where: {
                    salesAgreementId: data.salesAgreementId,
                    id: { not: id },
                },
            });
            if (salesAgreementReferencedAlready) {
                throw new Error('Sales Agreement is already attached to another transaction.');
            }
        }
        if (data.purchaseOrderId) {
            const purchaseOrderReferencedAlready = yield db_utils_1.default.transaction.findFirst({
                where: {
                    purchaseOrderId: data.purchaseOrderId,
                    id: { not: id },
                },
            });
            if (purchaseOrderReferencedAlready) {
                throw new Error('Purchase Order is already attached in another transaction.');
            }
        }
        return yield db_utils_1.default.transaction.update({
            where: { id },
            data: Object.assign(Object.assign({}, (data.salesAgreementId && { salesAgreementId: data.salesAgreementId })), (data.purchaseOrderId && { purchaseOrderId: data.purchaseOrderId })),
        });
    });
}
function deleteTransaction(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.transaction.delete({
            where: { id },
        });
    });
}
function fetchTransaction(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id }) {
        return yield db_utils_1.default.transaction.findUnique({
            where: {
                id
            },
            include: {
                client: true,
                tourVoucher: {
                    include: {
                        itineraries: true
                    }
                },
                approver: true,
                preparedBy: true,
                travelVoucher: {
                    include: {
                        airline: true,
                        shipping: true
                    }
                },
                accommodationVoucher: true,
                transportVoucher: {
                    include: {
                        itineraries: true
                    }
                },
                salesAgreement: {
                    include: {
                        creator: true,
                        salesAgreementItems: true
                    }
                },
                purchaseOrder: {
                    include: {
                        creator: true,
                        purchaseOrderItems: {}
                    }
                }
            }
        });
    });
}
function fetchTransactions(_a) {
    return __awaiter(this, arguments, void 0, function* ({ skip, take, search, travel, accommodation, tour, transport, branch }) {
        let whereInput = {};
        if (search) {
            whereInput = {
                OR: [
                    { client: { name: { contains: search, mode: 'insensitive' } } },
                    { transactionNumber: { contains: search, mode: "insensitive" } },
                ],
            };
        }
        const voucherFilters = [];
        if (travel) {
            voucherFilters.push({ travelVoucher: { some: {} } });
        }
        if (accommodation) {
            voucherFilters.push({ accommodationVoucher: { some: {} } });
        }
        if (tour) {
            voucherFilters.push({ tourVoucher: { some: {} } });
        }
        if (transport) {
            voucherFilters.push({ transportVoucher: { some: {} } });
        }
        if (voucherFilters.length > 0) {
            whereInput = Object.assign(Object.assign({}, whereInput), { OR: voucherFilters });
        }
        const findTransaction = db_utils_1.default.transaction.findMany({
            where: Object.assign(Object.assign({}, whereInput), { client: {
                    officeBranch: branch
                } }),
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        officeBranch: true,
                    },
                },
                preparedBy: true,
                approver: true,
                salesAgreement: true,
                purchaseOrder: true,
                tourVoucher: true,
                travelVoucher: true,
                accommodationVoucher: true,
                transportVoucher: true,
            },
            skip: skip !== null && skip !== void 0 ? skip : 0,
            take: take !== null && take !== void 0 ? take : 10,
            orderBy: {
                createdAt: 'desc',
            },
        });
        const countTransactions = db_utils_1.default.transaction.count({
            where: Object.assign(Object.assign({}, whereInput), { client: {
                    officeBranch: branch
                } }),
        });
        const [transactions, total] = yield db_utils_1.default.$transaction([findTransaction, countTransactions]);
        const enrichedTransactions = transactions.map((transaction) => {
            const travelVoucherCount = transaction.travelVoucher.length;
            const accommodationVoucherCount = transaction.accommodationVoucher.length;
            const tourVoucherCount = transaction.tourVoucher.length;
            const transportVoucherCount = transaction.transportVoucher.length;
            return Object.assign(Object.assign({}, transaction), { voucherCounts: {
                    travel: travelVoucherCount,
                    accommodation: accommodationVoucherCount,
                    tour: tourVoucherCount,
                    transport: transportVoucherCount,
                } });
        });
        return { transactions: enrichedTransactions, total };
    });
}
function fetchTransactionSummary(startDate, endDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const oneWeekAgo = (0, moment_1.default)().subtract(7, 'days').startOf('day').toDate();
        const [total, cebuCount, calbayogCount, since7days, transactions] = yield Promise.all([
            db_utils_1.default.transaction.count(),
            db_utils_1.default.transaction.count({
                where: {
                    client: {
                        officeBranch: client_1.OfficeBranch.CEBU,
                    },
                },
            }),
            db_utils_1.default.transaction.count({
                where: {
                    client: {
                        officeBranch: client_1.OfficeBranch.CALBAYOG,
                    },
                },
            }),
            db_utils_1.default.transaction.count({
                where: {
                    createdAt: {
                        gte: oneWeekAgo,
                    },
                },
            }),
            db_utils_1.default.transaction.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                include: {
                    travelVoucher: true,
                    accommodationVoucher: true,
                    tourVoucher: true,
                    transportVoucher: true,
                },
            }),
        ]);
        const enrichedTransactions = transactions.map((transaction) => {
            const travelVoucherCount = transaction.travelVoucher.length;
            const accommodationVoucherCount = transaction.accommodationVoucher.length;
            const tourVoucherCount = transaction.tourVoucher.length;
            const transportVoucherCount = transaction.transportVoucher.length;
            return Object.assign(Object.assign({}, transaction), { voucherCounts: {
                    travel: travelVoucherCount,
                    accommodation: accommodationVoucherCount,
                    tour: tourVoucherCount,
                    transport: transportVoucherCount,
                } });
        });
        const totalVoucherCounts = {
            travel: 0,
            accommodation: 0,
            tour: 0,
            transport: 0,
        };
        enrichedTransactions.forEach((transaction) => {
            totalVoucherCounts.travel += transaction.travelVoucher.length;
            totalVoucherCounts.accommodation += transaction.accommodationVoucher.length;
            totalVoucherCounts.tour += transaction.tourVoucher.length;
            totalVoucherCounts.transport += transaction.transportVoucher.length;
        });
        return { since7days, total, enrichedTransactions, totalVoucherCounts, cebuCount, calbayogCount };
    });
}
function fetchRecentEntries() {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch the most recent created entries
        const transactionsPromise = db_utils_1.default.transaction.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                preparedBy: true,
            },
            take: 5,
        });
        const salesAgreementsPromise = db_utils_1.default.salesAgreement.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                creator: true,
            },
            take: 5,
        });
        const purchaseOrdersPromise = db_utils_1.default.purchaseRequestOrder.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                creator: true,
            },
            take: 5,
        });
        const memorandumsPromise = db_utils_1.default.memorandum.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        // Fetch updated entries
        const updatedTransactionsPromise = db_utils_1.default.transaction.findMany({
            where: { updatedAt: { not: null } },
            orderBy: { updatedAt: 'desc' },
            include: {
                preparedBy: true,
            },
            take: 5,
        });
        const updatedSalesAgreementsPromise = db_utils_1.default.salesAgreement.findMany({
            where: { updatedAt: { not: null } },
            orderBy: { updatedAt: 'desc' },
            include: {
                creator: true,
            },
            take: 5,
        });
        const updatedPurchaseOrdersPromise = db_utils_1.default.purchaseRequestOrder.findMany({
            where: { updatedAt: { not: null } },
            orderBy: { updatedAt: 'desc' },
            include: {
                creator: true,
            },
            take: 5,
        });
        const updatedMemorandumsPromise = db_utils_1.default.memorandum.findMany({
            where: { updatedAt: { not: null } },
            orderBy: { updatedAt: 'desc' },
            take: 5,
        });
        const [transactions, salesAgreements, purchaseOrders, memorandums, updatedTransactions, updatedSalesAgreements, updatedPurchaseOrders, updatedMemorandums,] = yield Promise.all([
            transactionsPromise,
            salesAgreementsPromise,
            purchaseOrdersPromise,
            memorandumsPromise,
            updatedTransactionsPromise,
            updatedSalesAgreementsPromise,
            updatedPurchaseOrdersPromise,
            updatedMemorandumsPromise,
        ]);
        const allEntries = [
            ...transactions.map(item => (Object.assign(Object.assign({}, item), { type: 'Transaction', status: 'Created' }))),
            ...salesAgreements.map(item => (Object.assign(Object.assign({}, item), { type: 'Sales Agreement', status: 'Created' }))),
            ...purchaseOrders.map(item => (Object.assign(Object.assign({}, item), { type: 'Purchase Request Order', status: 'Created' }))),
            ...memorandums.map(item => (Object.assign(Object.assign({}, item), { type: 'Memorandum', status: 'Created' }))),
            ...updatedTransactions.map(item => (Object.assign(Object.assign({}, item), { type: 'Transaction', status: 'Updated' }))),
            ...updatedSalesAgreements.map(item => (Object.assign(Object.assign({}, item), { type: 'Sales Agreement', status: 'Updated' }))),
            ...updatedPurchaseOrders.map(item => (Object.assign(Object.assign({}, item), { type: 'Purchase Request Order', status: 'Updated' }))),
            ...updatedMemorandums.map(item => (Object.assign(Object.assign({}, item), { type: 'Memorandum', status: 'Updated' }))),
        ];
        allEntries.sort((a, b) => {
            const aDate = a.updatedAt || a.createdAt || new Date(0);
            const bDate = b.updatedAt || b.createdAt || new Date(0);
            return bDate.getTime() - aDate.getTime();
        });
        return allEntries.slice(0, 10);
    });
}
function updateTransactionApprover(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, approverId }) {
        return yield db_utils_1.default.transaction.update({
            where: { id },
            data: { approverId }
        });
    });
}
