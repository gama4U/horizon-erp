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
const accommodation_voucher_schema_1 = require("../schemas/accommodation-voucher.schema");
const accommodation_voucher_service_1 = require("../services/accommodation-voucher.service");
const accommodationVoucherRouter = express_1.default.Router();
accommodationVoucherRouter.post('/', (0, validate_middleware_1.validate)(accommodation_voucher_schema_1.createAccommodationVoucherSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accommodationVoucher = yield (0, accommodation_voucher_service_1.createAccommodationVoucher)(req.body);
        if (!accommodationVoucher) {
            throw new Error('Failed to create accommodation voucher');
        }
        res.status(200).json({ message: "Successfully created accommodation voucher" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
accommodationVoucherRouter.put('/:id', (0, validate_middleware_1.validate)(accommodation_voucher_schema_1.updateAccommodationVoucherSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const accommodationVoucher = yield (0, accommodation_voucher_service_1.updateAccommodationVoucher)(id, req.body);
        if (!accommodationVoucher) {
            throw new Error('Failed to create accommodation voucher');
        }
        res.status(200).json({ message: "Successfully created accommodation voucher" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
accommodationVoucherRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const accommodationVoucher = yield (0, accommodation_voucher_service_1.deleteAccommodationVoucher)(id);
        if (!accommodationVoucher) {
            throw new Error('Failed to delete accommodation voucher');
        }
        res.status(200).json({ message: "Successfully deleted accommodation voucher" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
exports.default = accommodationVoucherRouter;
