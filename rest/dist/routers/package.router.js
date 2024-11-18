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
const package_schema_1 = require("../schemas/package.schema");
const package_service_1 = require("../services/package.service");
const package_accommodation_service_1 = require("../services/package-accommodation.service");
const package_airfare_service_1 = require("../services/package-airfare.service");
const packageRouter = express_1.default.Router();
packageRouter.get('/', (0, validate_middleware_1.validate)(package_schema_1.getPackagesSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {
            skip: Number(req.query.skip),
            take: Number(req.query.take),
            search: req.query.search,
            branch: req.query.branch,
            type: req.query.type
        };
        const packages = yield (0, package_service_1.findPackages)(query);
        if (!packages)
            throw new Error('Failed to get packages');
        res.status(200).json(packages);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
packageRouter.get('/:id', (0, validate_middleware_1.validate)(package_schema_1.getPackagesSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const foundPackage = yield (0, package_service_1.findPackageById)(id);
        if (!foundPackage)
            throw new Error('Failed to get package');
        res.status(200).json(foundPackage);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
packageRouter.post('/', (0, validate_middleware_1.validate)(package_schema_1.createPackageSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const creatorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const created = yield (0, package_service_1.createPackage)(Object.assign({ creatorId }, req.body));
        if (!created)
            throw new Error('Failed to create packages');
        res.status(200).json(created);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
packageRouter.put('/:id', (0, validate_middleware_1.validate)(package_schema_1.updatePackageSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const updated = yield (0, package_service_1.updatePackage)(Object.assign({ id }, req.body));
        if (!updated)
            throw new Error('Failed to update packages');
        res.status(200).json({
            message: 'Updated successfully'
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
packageRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const deletedAccommodation = yield (0, package_accommodation_service_1.deletePackageAccommodationByPackageId)(id);
        if (!deletedAccommodation) {
            throw new Error('Failed to deleted package accommodations');
        }
        const deletedAirfare = yield (0, package_airfare_service_1.deletePackageAirfareByPackageId)(id);
        if (!deletedAirfare) {
            throw new Error('Failed to deleted package airfare');
        }
        const deletedPackages = yield (0, package_service_1.deletePackage)(id);
        if (!deletedPackages) {
            throw new Error('Failed to deleted packages');
        }
        res.status(200).json({
            message: 'Delete successfully'
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
packageRouter.patch('/:id/approver', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const approverId = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const id = req.params.id;
        const update = yield (0, package_service_1.updatePackageApprover)({ id, approverId });
        if (!update) {
            throw new Error('Failed to approve package');
        }
        return res.status(200).json({
            message: 'Package approved successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
exports.default = packageRouter;
