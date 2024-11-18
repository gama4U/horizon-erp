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
exports.createAccommodationVoucher = createAccommodationVoucher;
exports.updateAccommodationVoucher = updateAccommodationVoucher;
exports.deleteAccommodationVoucher = deleteAccommodationVoucher;
const db_utils_1 = __importDefault(require("../utils/db.utils"));
function createAccommodationVoucher(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.accommodation.create({
            data
        });
    });
}
function updateAccommodationVoucher(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.accommodation.update({
            where: {
                id: id
            },
            data
        });
    });
}
function deleteAccommodationVoucher(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.accommodation.delete({
            where: {
                id: id
            },
        });
    });
}
