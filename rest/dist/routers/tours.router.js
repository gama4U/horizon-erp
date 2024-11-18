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
const tour_voucher_schema_1 = require("../schemas/tour-voucher.schema");
const tour_voucher_service_1 = require("../services/tour-voucher.service");
const tourVoucherRouter = express_1.default.Router();
tourVoucherRouter.post('/', (0, validate_middleware_1.validate)(tour_voucher_schema_1.createTourVoucherSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tourVoucher = yield (0, tour_voucher_service_1.createTourVoucher)(req.body);
        if (!tourVoucher) {
            throw new Error('Failed to create tour voucher');
        }
        res.status(200).json({ message: "Successfully created tour voucher" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
tourVoucherRouter.put('/:id', (0, validate_middleware_1.validate)(tour_voucher_schema_1.updateTourVoucherSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updated = yield (0, tour_voucher_service_1.updateTourVoucher)(Object.assign({ id }, req.body));
        if (!updated) {
            throw new Error('Failed to update tour voucher');
        }
        res.status(200).json({ message: "Successfully updated tour voucher" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
tourVoucherRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield (0, tour_voucher_service_1.deleteTourVoucher)(id);
        if (!deleted)
            throw new Error('Failed to delete tour voucher');
        return res.status(200).json(deleted);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = tourVoucherRouter;
