import { OfficeBranch } from "@prisma/client";
import dayjs from "dayjs";

export function getNextMemorandumNumber(lastMemoNumber: string | null, branch: string) {
  const today = dayjs().format('MMDDYYYY');
  let newNumber = 1;

  if (lastMemoNumber) {
    const numericPart = parseInt(lastMemoNumber.split('-')[0]);
    newNumber = numericPart + 1;
  }

  const paddedNumber = String(newNumber).padStart(3, '0');
  const branchCode = branch === 'CEBU' ? 'CEB' : 'CAL';

  return `${paddedNumber}-${today}-${branchCode}`;
}


export function getNextDtsNumber(lastDtsNumber: string | null, officeBranch: string) {
  let newNumber = 1;

  if (lastDtsNumber) {
    const numericPart = parseInt(lastDtsNumber.slice(3, 8));
    newNumber = numericPart + 1;
  }
  const paddedNumber = String(newNumber).padStart(5, '0');
  const today = dayjs().format('MMDDYYYY');
  const branchCode = officeBranch === 'CEBU' ? 'CEB' : 'CAL';

  return `DTS${paddedNumber}-${today}-${branchCode}`;
}



export function getNextTransactionNumber(lastTransactionNumber: string | null, branch: OfficeBranch) {
  const today = dayjs().format('MMDDYYYY');
  let newTransactionNumber = '001';

  if (lastTransactionNumber) {
    const numericPart = lastTransactionNumber.slice(1, 4);

    if (numericPart) {
      newTransactionNumber = (parseInt(numericPart) + 1).toString().padStart(3, '0');
    }
  }

  const branchCode = branch === OfficeBranch.CALBAYOG ? 'CLB' : 'CEB';
  return `T${newTransactionNumber}-${today}-${branchCode}`;
}


export function getNextSerialNumber(lastSerialNumber: string | null, branch: string) {
  const today = dayjs().format('MMDDYYYY');
  let newNumber = branch === 'CEBU' ? 251 : 1451;

  if (lastSerialNumber) {
    const numericPart = parseInt(lastSerialNumber.slice(2, 7));
    newNumber = numericPart + 1;
  }

  const paddedNumber = String(newNumber).padStart(5, '0');
  const branchCode = branch === 'CEBU' ? 'CEB' : 'CAL';

  return `SA${paddedNumber}-${today}-${branchCode}`;
}

export function getNextPurchaseRequestNumber(lastSerialNumber: string | null, officeBranch: string) {
  const today = dayjs().format('MMDDYYYY');
  let newNumber = officeBranch === 'CEBU' ? 551 : 2451;
  if (lastSerialNumber) {
    const numericPart = parseInt(lastSerialNumber.slice(2, 7));
    newNumber = numericPart + 1;
  }

  const paddedNumber = String(newNumber).padStart(5, '0');
  const branchCode = officeBranch === 'CEBU' ? 'CEB' : 'CAL';

  return `PO${paddedNumber}-${today}-${branchCode}`;
}


export function getNextPackageNumber(lastSerialNumber: string | null, officeBranch: string) {
  const today = dayjs().format('MMDDYYYY');
  let newNumber = officeBranch === 'CEBU' ? 501 : 1;
  if (lastSerialNumber) {
    const numericPart = parseInt(lastSerialNumber.slice(2, 7));
    newNumber = numericPart + 1;
  }

  const paddedNumber = String(newNumber).padStart(5, '0');
  const branchCode = officeBranch === 'CEBU' ? 'CEB' : 'CAL';

  return `P${paddedNumber}-${today}-${branchCode}`;
}
