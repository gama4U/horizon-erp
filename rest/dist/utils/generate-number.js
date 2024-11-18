"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextMemorandumNumber = getNextMemorandumNumber;
exports.getNextDtsNumber = getNextDtsNumber;
exports.getNextTransactionNumber = getNextTransactionNumber;
exports.getNextSerialNumber = getNextSerialNumber;
exports.getNextPurchaseRequestNumber = getNextPurchaseRequestNumber;
exports.getNextPackageNumber = getNextPackageNumber;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
function getNextMemorandumNumber(lastMemoNumber, branch) {
    const today = (0, dayjs_1.default)().format('MMDDYYYY');
    let newNumber = 1;
    if (lastMemoNumber) {
        const numericPart = parseInt(lastMemoNumber.split('-')[0]);
        newNumber = numericPart + 1;
    }
    const paddedNumber = String(newNumber).padStart(3, '0');
    const branchCode = branch === 'CEBU' ? 'CEB' : 'CAL';
    return `${paddedNumber}-${today}-${branchCode}`;
}
function getNextDtsNumber(lastDtsNumber, officeBranch) {
    let newNumber = 1;
    if (lastDtsNumber) {
        const numericPart = parseInt(lastDtsNumber.slice(3, 8));
        newNumber = numericPart + 1;
    }
    const paddedNumber = String(newNumber).padStart(5, '0');
    const today = (0, dayjs_1.default)().format('MMDDYYYY');
    const branchCode = officeBranch === 'CEBU' ? 'CEB' : 'CAL';
    return `DTS${paddedNumber}-${today}-${branchCode}`;
}
function getNextTransactionNumber(lastTransactionNumber, branch) {
    const today = (0, dayjs_1.default)().format('MMDDYYYY');
    let newTransactionNumber = '001';
    if (lastTransactionNumber) {
        const numericPart = lastTransactionNumber.slice(1, 4);
        if (numericPart) {
            newTransactionNumber = (parseInt(numericPart) + 1).toString().padStart(3, '0');
        }
    }
    const branchCode = branch === client_1.OfficeBranch.CALBAYOG ? 'CLB' : 'CEB';
    return `T${newTransactionNumber}-${today}-${branchCode}`;
}
function getNextSerialNumber(lastSerialNumber, branch) {
    const today = (0, dayjs_1.default)().format('MMDDYYYY');
    let newNumber = branch === 'CEBU' ? 251 : 1451;
    if (lastSerialNumber) {
        const numericPart = parseInt(lastSerialNumber.slice(2, 7));
        newNumber = numericPart + 1;
    }
    const paddedNumber = String(newNumber).padStart(5, '0');
    const branchCode = branch === 'CEBU' ? 'CEB' : 'CAL';
    return `SA${paddedNumber}-${today}-${branchCode}`;
}
function getNextPurchaseRequestNumber(lastSerialNumber, officeBranch) {
    const today = (0, dayjs_1.default)().format('MMDDYYYY');
    let newNumber = officeBranch === 'CEBU' ? 551 : 2451;
    if (lastSerialNumber) {
        const numericPart = parseInt(lastSerialNumber.slice(2, 7));
        newNumber = numericPart + 1;
    }
    const paddedNumber = String(newNumber).padStart(5, '0');
    const branchCode = officeBranch === 'CEBU' ? 'CEB' : 'CAL';
    return `PO${paddedNumber}-${today}-${branchCode}`;
}
function getNextPackageNumber(lastSerialNumber, officeBranch) {
    const today = (0, dayjs_1.default)().format('MMDDYYYY');
    let newNumber = officeBranch === 'CEBU' ? 501 : 1;
    if (lastSerialNumber) {
        const numericPart = parseInt(lastSerialNumber.slice(2, 7));
        newNumber = numericPart + 1;
    }
    const paddedNumber = String(newNumber).padStart(5, '0');
    const branchCode = officeBranch === 'CEBU' ? 'CEB' : 'CAL';
    return `P${paddedNumber}-${today}-${branchCode}`;
}
