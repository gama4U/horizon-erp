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
const client_1 = require("@prisma/client");
const purchase_request_schema_1 = require("../schemas/purchase-request.schema");
const purchase_request_service_1 = require("../services/purchase-request.service");
const purchase_request_item_service_1 = require("../services/purchase-request-item.service");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const supplier_service_1 = require("../services/supplier.service");
const purchaseRequestRouter = express_1.default.Router();
purchaseRequestRouter.post('/', (0, validate_middleware_1.validate)(purchase_request_schema_1.createPurchaseRequestSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const foundSupplier = yield (0, supplier_service_1.findSupplierById)(req.body.supplierId);
        if (!foundSupplier) {
            throw new Error('Failed to find supplier');
        }
        const created = yield (0, purchase_request_service_1.createPurchaseRequest)(Object.assign(Object.assign({ creatorId: userId }, req.body), { officeBranch: foundSupplier.officeBranch }));
        if (!created) {
            throw new Error('Failed to create purchase request');
        }
        return res.status(200).json(Object.assign(Object.assign({}, created), { message: 'Purchase request created successfully' }));
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
purchaseRequestRouter.put('/:id', (0, validate_middleware_1.validate)(purchase_request_schema_1.updatePurchaseRequestSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const created = yield (0, purchase_request_service_1.updatePurchaseRequest)(Object.assign({ id }, req.body));
        if (!created) {
            throw new Error('Failed to update purchase request');
        }
        return res.status(200).json(Object.assign(Object.assign({}, created), { message: 'Purchase request updated successfully' }));
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
purchaseRequestRouter.get('/', (0, validate_middleware_1.validate)(purchase_request_schema_1.findPurchaseRequestsSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { skip, take, search, category, branch, type, classification } = req.query;
        const filters = {
            skip: skip ? Number(skip) : undefined,
            take: take ? Number(take) : undefined,
            search: search ? String(search) : undefined,
            category: category ? String(category) : undefined,
            branch: branch ? String(branch) : undefined,
            type: type ? String(type) : undefined,
            classification: classification ? String(classification) : undefined
        };
        const purchaseRequests = yield (0, purchase_request_service_1.findPurchaseRequests)(filters);
        if (!purchaseRequests) {
            throw new Error('Failed to find purchase requests');
        }
        return res.status(200).json(purchaseRequests);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
purchaseRequestRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const purchaseRequest = yield (0, purchase_request_service_1.findPurchaseRequestById)(id);
        if (!purchaseRequest) {
            return res.status(404).json({ message: 'Purchase request not found' });
        }
        return res.status(200).json(purchaseRequest);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
purchaseRequestRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const deletedItems = yield (0, purchase_request_item_service_1.deletePurchaseRequestItems)(id);
        if (!deletedItems) {
            throw new Error('Failed to delete purchase request items');
        }
        const deleted = yield (0, purchase_request_service_1.deletePurchaseRequestById)(id);
        if (!deleted) {
            throw new Error('Failed to delete purchase request');
        }
        return res.status(200).json({
            message: 'Purchase request deleted successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
purchaseRequestRouter.post('/summary', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, purchase_request_service_1.fetchPurchaseRequestSummary)();
        if (!data) {
            return res.status(404).json({ message: 'Failed to fetch purchase request data' });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
purchaseRequestRouter.patch('/:id/approver', (0, authorize_middleware_1.authorize)([client_1.UserType.ADMIN]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const approverId = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const { id } = req.params;
        const updated = yield (0, purchase_request_service_1.updatePurchaseRequestOrderApprover)({ id, approverId });
        if (!updated) {
            throw new Error('Failed to update purchase request approver');
        }
        return res.status(200).json({
            message: 'Purchase request approved successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
exports.default = purchaseRequestRouter;
