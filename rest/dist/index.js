"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv = __importStar(require("dotenv"));
const main_router_middleware_1 = __importDefault(require("./middlewares/main-router.middleware"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const upload_router_1 = __importDefault(require("./routers/upload.router"));
const sales_agreement_router_1 = __importDefault(require("./routers/sales-agreement.router"));
const transaction_router_1 = __importDefault(require("./routers/transaction.router"));
const travel_router_1 = __importDefault(require("./routers/travel.router"));
const accommodation_router_1 = __importDefault(require("./routers/accommodation.router"));
const tours_router_1 = __importDefault(require("./routers/tours.router"));
const transport_router_1 = __importDefault(require("./routers/transport.router"));
const tour_itinerary_router_1 = __importDefault(require("./routers/tour-itinerary.router"));
const transport_itinerary_router_1 = __importDefault(require("./routers/transport-itinerary.router"));
const sales_agreement_items_router_1 = __importDefault(require("./routers/sales-agreement-items.router"));
const purchase_request_router_1 = __importDefault(require("./routers/purchase-request.router"));
const purchase_request_items_router_1 = __importDefault(require("./routers/purchase-request-items.router"));
const profile_router_1 = __importDefault(require("./routers/profile.router"));
const memorandum_router_1 = __importDefault(require("./routers/memorandum.router"));
const client_router_1 = __importDefault(require("./routers/client.router"));
const suppliers_router_1 = __importDefault(require("./routers/suppliers.router"));
const document_transaction_router_1 = __importDefault(require("./routers/document-transaction.router"));
const package_router_1 = __importDefault(require("./routers/package.router"));
const package_accommodation_router_1 = __importDefault(require("./routers/package-accommodation.router"));
const package_airfare_router_1 = __importDefault(require("./routers/package-airfare.router"));
dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5001;
const allowedOrigins = [
    'https://edge.horizonexpress.ph',
    'http://localhost:5173',
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, origin);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('tiny'));
app.use('/auth', auth_router_1.default);
app.use('/api/v1', main_router_middleware_1.default);
main_router_middleware_1.default.use('/users', user_router_1.default);
main_router_middleware_1.default.use('/uploads', upload_router_1.default);
main_router_middleware_1.default.use('/travel-vouchers', travel_router_1.default);
main_router_middleware_1.default.use('/accommodation-vouchers', accommodation_router_1.default);
main_router_middleware_1.default.use('/tour-vouchers', tours_router_1.default);
main_router_middleware_1.default.use('/transport-vouchers', transport_router_1.default);
main_router_middleware_1.default.use('/sales-agreements', sales_agreement_router_1.default);
main_router_middleware_1.default.use('/transactions', transaction_router_1.default);
main_router_middleware_1.default.use('/tour-itineraries', tour_itinerary_router_1.default);
main_router_middleware_1.default.use('/transport-itineraries', transport_itinerary_router_1.default);
main_router_middleware_1.default.use('/sales-agreement-items', sales_agreement_items_router_1.default);
main_router_middleware_1.default.use('/purchase-requests', purchase_request_router_1.default);
main_router_middleware_1.default.use('/purchase-request-items', purchase_request_items_router_1.default);
main_router_middleware_1.default.use('/clients', client_router_1.default);
main_router_middleware_1.default.use('/profile', profile_router_1.default);
main_router_middleware_1.default.use('/memorandums', memorandum_router_1.default);
main_router_middleware_1.default.use('/suppliers', suppliers_router_1.default);
main_router_middleware_1.default.use('/document-transactions', document_transaction_router_1.default);
main_router_middleware_1.default.use('/packages', package_router_1.default);
main_router_middleware_1.default.use('/package-accommodations', package_accommodation_router_1.default);
main_router_middleware_1.default.use('/package-airfares', package_airfare_router_1.default);
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
