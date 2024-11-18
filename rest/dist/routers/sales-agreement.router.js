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
const sales_agreement_schema_1 = require("../schemas/sales-agreement.schema");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const sales_agreement_service_1 = require("../services/sales-agreement.service");
const sales_agreement_item_service_1 = require("../services/sales-agreement-item.service");
const client_service_1 = require("../services/client.service");
const salesAgreementRouter = express_1.default.Router();
salesAgreementRouter.post('/', (0, validate_middleware_1.validate)(sales_agreement_schema_1.createSalesAgreementSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const foundClient = yield (0, client_service_1.findClientById)(req.body.clientId);
        if (!foundClient) {
            throw new Error('Failed to find client');
        }
        const created = yield (0, sales_agreement_service_1.createSalesAgreement)(Object.assign(Object.assign({ creatorId: userId }, req.body), { officeBranch: foundClient.officeBranch }));
        if (!created) {
            throw new Error('Failed to create sales agreement');
        }
        return res.status(200).json(Object.assign(Object.assign({}, created), { message: 'Sales agreement created successfully' }));
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
salesAgreementRouter.put('/:id', (0, validate_middleware_1.validate)(sales_agreement_schema_1.updateSalesAgreementSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesAgreementItemId = req.params.id;
        const created = yield (0, sales_agreement_service_1.updateSalesAgreement)(Object.assign({ id: salesAgreementItemId }, req.body));
        if (!created) {
            throw new Error('Failed to update sales agreement');
        }
        return res.status(200).json(Object.assign(Object.assign({}, created), { message: 'Sales agreement update successfully' }));
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
salesAgreementRouter.get('/', (0, validate_middleware_1.validate)(sales_agreement_schema_1.getSalesAgreementsSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { skip, take, search, typeOfClient, branch } = req.query;
        const filters = {
            skip: skip ? Number(skip) : undefined,
            take: take ? Number(take) : undefined,
            search: search ? String(search) : undefined,
            branch: branch ? String(branch) : undefined,
            typeOfClient: typeOfClient ? typeOfClient : undefined,
        };
        const salesAgreements = yield (0, sales_agreement_service_1.findSalesAgreements)(filters);
        if (!salesAgreements) {
            throw new Error('Failed to get sales agreements');
        }
        return res.status(200).json(salesAgreements);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
salesAgreementRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesAgreementId = req.params.id;
        const salesAgreement = yield (0, sales_agreement_service_1.findSalesAgreementById)(salesAgreementId);
        if (!salesAgreement) {
            return res.status(404).json({ message: 'Sales agreement not found' });
        }
        return res.status(200).json(salesAgreement);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
salesAgreementRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesAgreementId = req.params.id;
        const deletedItems = yield (0, sales_agreement_item_service_1.deleteSalesAgreementItems)(salesAgreementId);
        if (!deletedItems) {
            throw new Error('Failed to delete sales agreement items');
        }
        const deleted = yield (0, sales_agreement_service_1.deleteSalesAgreementById)(salesAgreementId);
        if (!deleted) {
            return res.status(404).json({ message: 'Sales agreement not found' });
        }
        return res.status(200).json({
            message: 'Sales agreement deleted successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
salesAgreementRouter.post('/summary', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, sales_agreement_service_1.fetchSalesAgreementSummary)();
        if (!data) {
            return res.status(404).json({ message: 'Failed to fetch sales agreement data' });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
salesAgreementRouter.patch('/:id/approver', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const approverId = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const id = req.params.id;
        const update = yield (0, sales_agreement_service_1.updateSalesAgreementApprover)({ id, approverId });
        if (!update) {
            throw new Error('Failed to approve sales agreement');
        }
        return res.status(200).json({
            message: 'Sales agreement approved successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
exports.default = salesAgreementRouter;
