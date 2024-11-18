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
const transport_voucher_schema_1 = require("../schemas/transport-voucher.schema");
const transport_voucher_service_1 = require("../services/transport-voucher.service");
const transportVoucherRouter = express_1.default.Router();
transportVoucherRouter.post('/', (0, validate_middleware_1.validate)(transport_voucher_schema_1.createTransportVoucherSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transportVoucher = yield (0, transport_voucher_service_1.createTransportVoucher)(req.body);
        if (!transportVoucher) {
            throw new Error('Failed to create transport voucher');
        }
        res.status(200).json({ message: "Successfully created transport voucher" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
transportVoucherRouter.put('/:id', (0, validate_middleware_1.validate)(transport_voucher_schema_1.updateTransportVoucherSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const update = yield (0, transport_voucher_service_1.updateTransportVoucher)(Object.assign({ id }, req.body));
        if (!update) {
            throw new Error('Failed to update transport voucher');
        }
        res.status(200).json({ message: "Successfully updated tour voucher" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
transportVoucherRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield (0, transport_voucher_service_1.deleteTransportVoucher)(id);
        if (!deleted) {
            throw new Error('Failed to delete transport voucher');
        }
        res.status(200).json({ message: "Successfully deleted tour voucher" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
exports.default = transportVoucherRouter;
