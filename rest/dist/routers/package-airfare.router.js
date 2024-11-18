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
const package_airfare_service_1 = require("../services/package-airfare.service");
const packageAirfareRouter = express_1.default.Router();
packageAirfareRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const created = yield (0, package_airfare_service_1.createPackageAirfare)(req.body);
        if (!created)
            throw new Error('Failed to create package airfare');
        res.status(200).json({
            message: 'Updated successfully'
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
packageAirfareRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const updated = yield (0, package_airfare_service_1.updatePackageAirfare)(Object.assign({ id }, req.body));
        if (!updated)
            throw new Error('Failed to update package airfare');
        res.status(200).json({
            message: 'Updated successfully'
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
packageAirfareRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const deleted = yield (0, package_airfare_service_1.deletePackageAirfare)(id);
        if (!deleted)
            throw new Error('Failed to delete package airfare');
        res.status(200).json({
            message: 'Deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
exports.default = packageAirfareRouter;
