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
const client_service_1 = require("../services/client.service");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const client_schema_1 = require("../schemas/client.schema");
const client_1 = require("@prisma/client");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const clientRouter = express_1.default.Router();
clientRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const created = yield (0, client_service_1.createClient)(req.body);
        if (!created)
            throw new Error('Failed to create client');
        return res.status(200).json(created);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
clientRouter.get('/', (0, validate_middleware_1.validate)(client_schema_1.getClientsSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { skip, take, search, branch, typeOfClient, isApproved } = req.query;
        const filters = {
            skip: skip ? Number(skip) : undefined,
            take: take ? Number(take) : undefined,
            search: search ? String(search) : undefined,
            branch: branch ? String(branch) : undefined,
            isApproved: isApproved === 'true' ? true : isApproved === 'false' ? false : undefined,
            typeOfClient: typeOfClient ? typeOfClient : undefined,
        };
        const clients = yield (0, client_service_1.fetchClients)(filters);
        if (!clients) {
            throw new Error('Failed to get clients');
        }
        return res.status(200).json(clients);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
clientRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updated = yield (0, client_service_1.updateClient)(id, req.body);
        if (!updated)
            throw new Error('Failed to update client');
        return res.status(200).json(updated);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
clientRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield (0, client_service_1.deleteClient)(id);
        if (!deleted) {
            throw new Error('Failed to delete client');
        }
        return res.status(200).json({
            message: 'Client deleted successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
clientRouter.patch('/:id/approver', (0, authorize_middleware_1.authorize)([client_1.UserType.ADMIN]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const approverId = String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const id = req.params.id;
        const update = yield (0, client_service_1.updateClientApprover)({ id, approverId });
        if (!update) {
            throw new Error('Failed to approve client');
        }
        return res.status(200).json({
            message: 'Client approved successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}));
clientRouter.post('/summary', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startMonth, endMonth } = req.body;
    if (startMonth < 1 || startMonth > 12 ||
        endMonth < 1 || endMonth > 12 ||
        (startMonth > endMonth && !(startMonth === 12 && endMonth === 1))) {
        return res.status(400).json({ message: 'Invalid month range' });
    }
    try {
        const data = yield (0, client_service_1.fetchClientSummary)(startMonth, endMonth);
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No clients data found for the selected range' });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        console.error('Error fetching client summary:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = clientRouter;
