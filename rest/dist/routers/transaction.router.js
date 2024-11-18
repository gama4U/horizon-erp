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
const express_1 = __importDefault(require("express"));
const transaction_service_1 = require("../services/transaction.service");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const transaction_schema_1 = require("../schemas/transaction.schema");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const client_1 = require("@prisma/client");
const transactionRouter = express_1.default.Router();
transactionRouter.get('/', (0, validate_middleware_1.validate)(transaction_schema_1.getTransactionsSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { skip, take, search, travel, accommodation, tour, transport, branch } = req.query;
        const filters = {
            skip: skip ? Number(skip) : undefined,
            take: take ? Number(take) : undefined,
            search: search ? String(search) : undefined,
            branch: branch ? String(branch) : undefined,
            travel: travel === 'true' ? true : undefined,
            accommodation: accommodation === 'true' ? true : undefined,
            tour: tour === 'true' ? true : undefined,
            transport: transport === 'true' ? true : undefined,
        };
        const transactions = yield (0, transaction_service_1.fetchTransactions)(filters);
        if (!transactions) {
            throw new Error('Failed to get transactions');
        }
        return res.status(200).json(transactions);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
transactionRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const created = yield (0, transaction_service_1.createTransaction)(req.body);
        if (!created) {
            throw new Error('Failed to create transaction');
        }
        return res.status(200).json(created);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
transactionRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const fetched = yield (0, transaction_service_1.fetchTransaction)({ id });
        if (!fetched)
            throw new Error('Failed to fetch transaction');
        return res.status(200).json(fetched);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
transactionRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const update = yield (0, transaction_service_1.updateTransaction)(Object.assign({ id }, req.body));
        if (!update)
            throw new Error('Failed to update transaction');
        return res.status(200).json(update);
    }
    catch (error) {
        if (error.message.includes('already attached')) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}));
transactionRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield (0, transaction_service_1.deleteTransaction)(id);
        if (!deleted)
            throw new Error('Failed to delete transaction');
        return res.status(200).json(deleted);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
transactionRouter.post('/summary', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to } = req.body;
    if (!from || !to) {
        return res.status(400).json({ message: 'Start date and end date are required.' });
    }
    try {
        const start = new Date(from);
        const end = new Date(to);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: 'Invalid date format.' });
        }
        const data = yield (0, transaction_service_1.fetchTransactionSummary)(start, end);
        const rate = data.total > 0 ? (data.since7days / data.total) * 100 : 0;
        return res.status(200).json({
            since7days: data.since7days,
            rate: parseFloat(rate.toFixed(2)),
            total: data.total,
            enrichedTransactions: data.enrichedTransactions,
            calbayogCount: data.calbayogCount,
            cebuCount: data.cebuCount,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
transactionRouter.post('/recent-activities', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recentActivities = yield (0, transaction_service_1.fetchRecentEntries)();
        if (!recentActivities) {
            throw new Error('Failed to fetch recent activities');
        }
        return res.status(200).json(recentActivities);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
transactionRouter.patch('/:id/approver', (0, authorize_middleware_1.authorize)([client_1.UserType.ADMIN]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const approverId = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const { id } = req.params;
        const updated = yield (0, transaction_service_1.updateTransactionApprover)({ id, approverId });
        if (!updated) {
            throw new Error("Failed to update transaction approver");
        }
        return res.status(200).json({
            message: 'Approved successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}));
exports.default = transactionRouter;
