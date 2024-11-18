import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import morgan from "morgan";
import * as dotenv from 'dotenv';
import { User } from "@prisma/client";
import mainRouter from "./middlewares/main-router.middleware";
import authRouter from "./routers/auth.router";
import userRouter from "./routers/user.router";
import uploadRouter from "./routers/upload.router";
import salesAgreementRouter from "./routers/sales-agreement.router";
import transactionRouter from "./routers/transaction.router";
import travelVoucherRouter from "./routers/travel.router";
import accommodationVoucherRouter from "./routers/accommodation.router";
import tourVoucherRouter from "./routers/tours.router";
import transportVoucherRouter from "./routers/transport.router";
import tourItineraryRouter from "./routers/tour-itinerary.router";
import transportItineraryRouter from "./routers/transport-itinerary.router";
import salesAgreementItemRouter from "./routers/sales-agreement-items.router";
import purchaseRequestRouter from "./routers/purchase-request.router";
import purchaseRequestItemRouter from "./routers/purchase-request-items.router";
import profileRouter from "./routers/profile.router";
import memorandumRouter from "./routers/memorandum.router";
import clientRouter from "./routers/client.router";
import supplierRouter from "./routers/suppliers.router";
import documentTransactionRouter from "./routers/document-transaction.router";
import packageRouter from "./routers/package.router";
import packageAccommodationRouter from "./routers/package-accommodation.router";
import packageAirfareRouter from "./routers/package-airfare.router";

declare module 'express' {
  interface Request {
    user?: User;
  }
}

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

const allowedOrigins = [
  'https://edge.horizonexpress.ph',
  'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use('/auth', authRouter);
app.use('/api/v1', mainRouter);

mainRouter.use('/users', userRouter);
mainRouter.use('/uploads', uploadRouter);
mainRouter.use('/travel-vouchers', travelVoucherRouter);
mainRouter.use('/accommodation-vouchers', accommodationVoucherRouter);
mainRouter.use('/tour-vouchers', tourVoucherRouter);
mainRouter.use('/transport-vouchers', transportVoucherRouter);
mainRouter.use('/sales-agreements', salesAgreementRouter);
mainRouter.use('/transactions', transactionRouter);
mainRouter.use('/tour-itineraries', tourItineraryRouter);
mainRouter.use('/transport-itineraries', transportItineraryRouter);
mainRouter.use('/sales-agreement-items', salesAgreementItemRouter);
mainRouter.use('/purchase-requests', purchaseRequestRouter);
mainRouter.use('/purchase-request-items', purchaseRequestItemRouter);
mainRouter.use('/clients', clientRouter);
mainRouter.use('/profile', profileRouter);
mainRouter.use('/memorandums', memorandumRouter);
mainRouter.use('/suppliers', supplierRouter);
mainRouter.use('/document-transactions', documentTransactionRouter);
mainRouter.use('/packages', packageRouter)
mainRouter.use('/package-accommodations', packageAccommodationRouter);
mainRouter.use('/package-airfares', packageAirfareRouter);


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
});
