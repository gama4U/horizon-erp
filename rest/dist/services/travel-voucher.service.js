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
exports.createTravelVoucher = createTravelVoucher;
exports.createAirlines = createAirlines;
exports.createShipping = createShipping;
exports.updateTravelVoucher = updateTravelVoucher;
exports.deleteTravelVoucher = deleteTravelVoucher;
exports.updateAirline = updateAirline;
exports.updateShipping = updateShipping;
const db_utils_1 = __importDefault(require("../utils/db.utils"));
function createTravelVoucher(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.travel.create({
            data: {
                type: data.type,
                transactionId: data.transactionId
            }
        });
    });
}
function createAirlines(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.airlines.create({
            data
        });
    });
}
function createShipping(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.shipping.create({
            data
        });
    });
}
function updateTravelVoucher(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.travel.update({
            where: {
                id: id
            },
            data: {
                type: data.type,
            }
        });
    });
}
function deleteTravelVoucher(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.travel.delete({
            where: { id }
        });
    });
}
function updateAirline(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.airlines.update({
            where: {
                id: data.id
            },
            data
        });
    });
}
function updateShipping(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.shipping.update({
            where: {
                id: data.id
            },
            data
        });
    });
}
