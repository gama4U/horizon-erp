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
const purchase_request_item_schema_1 = require("../schemas/purchase-request-item.schema");
const purchase_request_item_service_1 = require("../services/purchase-request-item.service");
const purchaseRequestItemRouter = express_1.default.Router();
purchaseRequestItemRouter.post('/', (0, validate_middleware_1.validate)(purchase_request_item_schema_1.createPurchaseRequestItemSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const created = yield (0, purchase_request_item_service_1.createPurchaseRequestItem)(req.body);
        if (!created) {
            throw new Error('Failed to created sales agreement item');
        }
        return res.status(200).json({
            message: 'Sales agreement item created successfully'
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
purchaseRequestItemRouter.put('/:id', (0, validate_middleware_1.validate)(purchase_request_item_schema_1.updatePurchaseRequestItemSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const updated = yield (0, purchase_request_item_service_1.updatePurchaseRequestItem)(Object.assign({ id }, req.body));
        if (!updated) {
            throw new Error('Failed to update purchase request item');
        }
        return res.status(200).json({
            message: 'Purchase request item updated successfully'
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
purchaseRequestItemRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const deleted = yield (0, purchase_request_item_service_1.deletePurchaseRequestItem)(id);
        if (!deleted) {
            throw new Error('Failed to delete purchase request item');
        }
        return res.status(200).json({
            message: 'Purchase request item deleted successfully'
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = purchaseRequestItemRouter;
