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
const validate_middleware_1 = require("../middlewares/validate.middleware");
const document_transaction_schema_1 = require("../schemas/document-transaction.schema");
const document_transaction_service_1 = require("../services/document-transaction.service");
const client_service_1 = require("../services/client.service");
const documentTransactionRouter = express_1.default.Router();
documentTransactionRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundClient = yield (0, client_service_1.findClientById)(req.body.clientId);
        const created = yield (0, document_transaction_service_1.createDocumentTransaction)(req.body, String(foundClient === null || foundClient === void 0 ? void 0 : foundClient.officeBranch));
        if (!created) {
            throw new Error('Failed to create  document transaction');
        }
        return res.status(200).json(created);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
documentTransactionRouter.get('/', (0, validate_middleware_1.validate)(document_transaction_schema_1.getDocumentTransactionSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { skip, take, search, RECIEVE, TRANSMITTAL, RETURN, branch } = req.query;
        const filters = {
            skip: skip ? Number(skip) : undefined,
            take: take ? Number(take) : undefined,
            search: search ? String(search) : undefined,
            branch: branch ? String(branch) : undefined,
            RECIEVE: RECIEVE === 'true',
            TRANSMITTAL: TRANSMITTAL === 'true',
            RETURN: RETURN === 'true',
        };
        const documentTransactions = yield (0, document_transaction_service_1.fetchDocumentTransactions)(filters);
        if (!documentTransactions) {
            throw new Error('Failed to get document transactions');
        }
        return res.status(200).json(documentTransactions);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}));
documentTransactionRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const documentTransaction = yield (0, document_transaction_service_1.findDocumentTransactionById)(id);
        if (!documentTransaction) {
            return res.status(404).json({ message: 'Document transaction not found' });
        }
        return res.status(200).json(documentTransaction);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
documentTransactionRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updated = yield (0, document_transaction_service_1.updateDocumentTransaction)(Object.assign({ id }, req.body));
        if (!updated) {
            throw new Error('Failed to update document transaction');
        }
        res.status(200).json({ message: "Successfully updated document transaction" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
documentTransactionRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield (0, document_transaction_service_1.deleteDocumentTransaction)(id);
        if (!deleted) {
            throw new Error('Failed to delete document transaction');
        }
        res.status(200).json({ message: "Successfully deleted document transaction" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
documentTransactionRouter.patch('/:id/transmit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const transmittedById = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const { id } = req.params;
        const updated = yield (0, document_transaction_service_1.transmitDocument)({ id, transmittedById });
        if (!updated) {
            throw new Error("Failed to transmit document transaction");
        }
        return res.status(200).json({
            message: 'Transmitted successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}));
documentTransactionRouter.post('/summary', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, document_transaction_service_1.fetchDocumentTransactionsSummary)();
        if (!data) {
            return res.status(404).json({ message: 'Failed to fetch document transactions data' });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = documentTransactionRouter;
