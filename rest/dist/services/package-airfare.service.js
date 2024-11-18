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
exports.deletePackageAirfare = exports.deletePackageAirfareByPackageId = exports.updatePackageAirfare = exports.createPackageAirfare = void 0;
const db_utils_1 = __importDefault(require("../utils/db.utils"));
const createPackageAirfare = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_utils_1.default.packageAirfare.create({ data });
});
exports.createPackageAirfare = createPackageAirfare;
const updatePackageAirfare = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var { id } = _a, data = __rest(_a, ["id"]);
    return yield db_utils_1.default.packageAirfare.update({
        where: { id },
        data
    });
});
exports.updatePackageAirfare = updatePackageAirfare;
const deletePackageAirfareByPackageId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_utils_1.default.packageAirfare.deleteMany({
        where: {
            packageId: id
        }
    });
});
exports.deletePackageAirfareByPackageId = deletePackageAirfareByPackageId;
const deletePackageAirfare = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_utils_1.default.packageAirfare.delete({
        where: { id }
    });
});
exports.deletePackageAirfare = deletePackageAirfare;
