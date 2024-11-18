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
const package_accommodation_service_1 = require("../services/package-accommodation.service");
const packageAccommodationRouter = express_1.default.Router();
packageAccommodationRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const created = yield (0, package_accommodation_service_1.createPackageAccommodation)(Object.assign({}, req.body));
        if (!created)
            throw new Error('Failed to create package accommodation');
        res.status(200).json({
            message: 'Created successfully'
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
packageAccommodationRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const created = yield (0, package_accommodation_service_1.updatePackageAccommodation)(Object.assign({ id }, req.body));
        if (!created)
            throw new Error('Failed to update package accommodation');
        res.status(200).json({
            message: 'Updated successfully'
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
packageAccommodationRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const deleted = yield (0, package_accommodation_service_1.deletePackageAccommodationById)(id);
        if (!deleted)
            throw new Error('Failed to delete package accommodation');
        res.status(200).json({
            message: 'Updated successfully'
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
exports.default = packageAccommodationRouter;
