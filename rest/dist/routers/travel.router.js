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
const express_1 = __importDefault(require("express"));
const travel_voucher_service_1 = require("../services/travel-voucher.service");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const travel_voucher_schema_1 = require("../schemas/travel-voucher.schema");
const client_1 = require("@prisma/client");
const travelVoucherRouter = express_1.default.Router();
travelVoucherRouter.post('/', (0, validate_middleware_1.validate)(travel_voucher_schema_1.createTravelVoucherSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { shipping, airline } = _a, data = __rest(_a, ["shipping", "airline"]);
    try {
        const travelVoucher = yield (0, travel_voucher_service_1.createTravelVoucher)(data);
        if (!travelVoucher) {
            throw new Error('Failed to create travel voucher');
        }
        if (data.type === client_1.TravelType.AIRLINES && airline) {
            const createdAirlines = yield (0, travel_voucher_service_1.createAirlines)(Object.assign({ travelId: travelVoucher.id }, airline));
            if (!createdAirlines) {
                throw new Error('Failed to add airline');
            }
        }
        if (data.type === client_1.TravelType.SHIPPING && shipping) {
            const createdShipping = yield (0, travel_voucher_service_1.createShipping)(Object.assign({ travelId: travelVoucher.id }, shipping));
            if (!createdShipping) {
                throw new Error('Failed to add shipping');
            }
        }
        res.status(200).json({ message: 'Successfully created travel voucher' });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
travelVoucherRouter.put('/:id', (0, validate_middleware_1.validate)(travel_voucher_schema_1.updateTravelVoucherSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _a = req.body, { shipping, airline } = _a, data = __rest(_a, ["shipping", "airline"]);
    try {
        const travelVoucher = yield (0, travel_voucher_service_1.updateTravelVoucher)(id, data);
        if (!travelVoucher) {
            throw new Error('Failed to update travel voucher');
        }
        if (data.type === client_1.TravelType.AIRLINES && airline) {
            const createdAirlines = yield (0, travel_voucher_service_1.updateAirline)(airline);
            if (!createdAirlines) {
                throw new Error('Failed to update airline');
            }
        }
        if (data.type === client_1.TravelType.SHIPPING && shipping) {
            const createdShipping = yield (0, travel_voucher_service_1.updateShipping)(shipping);
            if (!createdShipping) {
                throw new Error('Failed to update shipping');
            }
        }
        res.status(200).json({ message: 'Successfully updated travel voucher' });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
travelVoucherRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleted = yield (0, travel_voucher_service_1.deleteTravelVoucher)(id);
        if (!deleted) {
            throw new Error('Failed to delete travel voucher');
        }
        res.status(200).json({ message: 'Successfully deleted travel voucher' });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
exports.default = travelVoucherRouter;
