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
exports.createTourVoucher = createTourVoucher;
exports.updateTourVoucher = updateTourVoucher;
exports.deleteTourVoucher = deleteTourVoucher;
exports.createTourItinerary = createTourItinerary;
exports.updateTourItinerary = updateTourItinerary;
exports.deleteTourItinerary = deleteTourItinerary;
exports.createTransportItinerary = createTransportItinerary;
exports.updateTransportItinerary = updateTransportItinerary;
exports.deleteTransportItinerary = deleteTransportItinerary;
const db_utils_1 = __importDefault(require("../utils/db.utils"));
function createTourVoucher(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.tour.create({
            data: {
                transactionId: data.transactionId,
                tourGuide: data.tourGuide,
                tourContact: data.tourContact,
                driverName: data.driverName,
                driverContact: data.driverContact,
                remarks: data.remarks,
            },
        });
    });
}
function updateTourVoucher(_a) {
    return __awaiter(this, void 0, void 0, function* () {
        var { id } = _a, data = __rest(_a, ["id"]);
        return yield db_utils_1.default.tour.update({
            where: { id },
            data: {
                tourGuide: data.tourGuide,
                tourContact: data.tourContact,
                driverName: data.driverName,
                driverContact: data.driverContact,
                remarks: data.remarks,
            },
        });
    });
}
function deleteTourVoucher(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.tour.delete({
            where: {
                id
            }
        });
    });
}
function createTourItinerary(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.tourItinerary.create({
            data: Object.assign({}, data)
        });
    });
}
function updateTourItinerary(_a) {
    return __awaiter(this, void 0, void 0, function* () {
        var { id } = _a, data = __rest(_a, ["id"]);
        return yield db_utils_1.default.tourItinerary.update({
            where: { id },
            data
        });
    });
}
function deleteTourItinerary(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.tourItinerary.delete({
            where: { id },
        });
    });
}
function createTransportItinerary(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.transportItinerary.create({
            data: Object.assign({}, data)
        });
    });
}
function updateTransportItinerary(_a) {
    return __awaiter(this, void 0, void 0, function* () {
        var { id } = _a, data = __rest(_a, ["id"]);
        return yield db_utils_1.default.transportItinerary.update({
            where: { id },
            data
        });
    });
}
function deleteTransportItinerary(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_utils_1.default.transportItinerary.delete({
            where: { id },
        });
    });
}
