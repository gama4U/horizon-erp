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
const memorandum_service_1 = require("../services/memorandum.service");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const memorandum_schema_1 = require("../schemas/memorandum.schema");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const client_1 = require("@prisma/client");
const memorandumRouter = express_1.default.Router();
memorandumRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memorandum = yield (0, memorandum_service_1.createMemorandum)(req.body);
        if (!memorandum) {
            throw new Error('Failed to create memorandum');
        }
        return res.status(200).json(memorandum);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
memorandumRouter.get('/', (0, validate_middleware_1.validate)(memorandum_schema_1.getMemorandumsSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { skip, take, search, branch } = req.query;
        const filters = {
            skip: skip ? Number(skip) : undefined,
            take: take ? Number(take) : undefined,
            search: search ? String(search) : undefined,
            branch: branch ? String(branch) : undefined,
        };
        const memorandums = yield (0, memorandum_service_1.fetchMemorandums)(filters);
        if (!memorandums) {
            throw new Error('Failed to get memorandums');
        }
        return res.status(200).json(memorandums);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
memorandumRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const memorandum = yield (0, memorandum_service_1.findMemorandumById)(id);
        if (!memorandum) {
            return res.status(404).json({ message: 'Memorandum not found' });
        }
        return res.status(200).json(memorandum);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
memorandumRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const itinerary = yield (0, memorandum_service_1.updateMemorandum)(Object.assign({ id }, req.body));
        if (!itinerary) {
            throw new Error('Failed to update memorandum');
        }
        res.status(200).json({ message: "Successfully updated memorandum" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
memorandumRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield (0, memorandum_service_1.deleteMemorandum)(id);
        if (!deleted) {
            throw new Error('Failed to delete memorandum');
        }
        res.status(200).json({ message: "Successfully deleted memorandum" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
memorandumRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memorandumId = req.params.id;
        const deleted = yield (0, memorandum_service_1.deleteMemorandum)(memorandumId);
        if (!deleted) {
            return res.status(404).json({ message: 'Memorandum not found' });
        }
        return res.status(200).json({
            message: 'Memorandum deleted successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
memorandumRouter.post('/summary', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, memorandum_service_1.fetchMemorandumSummary)();
        if (!data) {
            return res.status(404).json({ message: 'Failed to fetch sales agreement data' });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
memorandumRouter.patch('/:id/approver', (0, authorize_middleware_1.authorize)([client_1.UserType.ADMIN]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const approverId = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const { id } = req.params;
        const updated = yield (0, memorandum_service_1.updateMemorandumApprover)({ id, approverId });
        if (!updated) {
            throw new Error("Failed to update memorandum approver");
        }
        return res.status(200).json({
            message: 'Approved successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}));
exports.default = memorandumRouter;
