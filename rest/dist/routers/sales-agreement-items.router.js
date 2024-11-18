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
const sales_agreement_item_schema_1 = require("../schemas/sales-agreement-item.schema");
const sales_agreement_item_service_1 = require("../services/sales-agreement-item.service");
const salesAgreementItemRouter = express_1.default.Router();
salesAgreementItemRouter.post('/', (0, validate_middleware_1.validate)(sales_agreement_item_schema_1.createSalesAgreementItemSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const created = yield (0, sales_agreement_item_service_1.createSalesAgreementItem)(req.body);
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
salesAgreementItemRouter.put('/:id', (0, validate_middleware_1.validate)(sales_agreement_item_schema_1.updateSalesAgreementItemSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesAgreementItemId = req.params.id;
        const updated = yield (0, sales_agreement_item_service_1.updateSalesAgreementItem)(Object.assign({ salesAgreementItemId }, req.body));
        if (!updated) {
            throw new Error('Failed to update sales agreement item');
        }
        return res.status(200).json({
            message: 'Sales agreement item updated successfully'
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
salesAgreementItemRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesAgreementItemId = req.params.id;
        const deleted = yield (0, sales_agreement_item_service_1.deleteSalesAgreementItem)(salesAgreementItemId);
        if (!deleted) {
            throw new Error('Failed to delete sales agreement item');
        }
        return res.status(200).json({
            message: 'Sales agreement item deleted successfully'
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = salesAgreementItemRouter;
