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
const tour_voucher_service_1 = require("../services/tour-voucher.service");
const tourItineraryRouter = express_1.default.Router();
tourItineraryRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itinerary = yield (0, tour_voucher_service_1.createTourItinerary)(req.body);
        if (!itinerary) {
            throw new Error('Failed to create itinerary');
        }
        res.status(200).json({ message: "Successfully created itinerary" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
tourItineraryRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const itinerary = yield (0, tour_voucher_service_1.updateTourItinerary)(Object.assign({ id }, req.body));
        if (!itinerary) {
            throw new Error('Failed to update itinerary');
        }
        res.status(200).json({ message: "Successfully created itinerary" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
tourItineraryRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield (0, tour_voucher_service_1.deleteTourItinerary)(id);
        if (!deleted) {
            throw new Error('Failed to delete tour itinerary');
        }
        res.status(200).json({ message: "Successfully deleted itinerary" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
exports.default = tourItineraryRouter;
