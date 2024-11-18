import { OfficeBranch, Prisma } from "@prisma/client";
import prisma from "../utils/db.utils";
import moment from "moment";
import { IUpdateTransactionApprover } from "../interfaces/transaction.interface";
import { getNextTransactionNumber } from "../utils/generate-number";

interface ICreateTransaction {
  id: string;
  creatorId: string
  branch: OfficeBranch
}
export async function createTransaction({ id, creatorId, branch }: ICreateTransaction) {
  const lastTransaction = await prisma.transaction.findFirst({
    where: {
      client: {
        officeBranch: branch,
      },
      transactionNumber: {
        contains: branch === OfficeBranch.CEBU ? 'CEB' : 'CLB'
      }
    },
    orderBy: {
      transactionNumber: 'desc',
    },
  });

  const nextTransactionNumber = getNextTransactionNumber(lastTransaction?.transactionNumber || null, branch);

  return await prisma.transaction.create({
    data: {
      transactionNumber: nextTransactionNumber,
      clientId: id,
      creatorId,
    },
  });
}

interface IFetchTransaction {
  id: string;
}


interface IUpdateTransaction {
  id: string;
  salesAgreementId?: string;
  purchaseOrderId?: string;
}

export async function updateTransaction({ id, ...data }: IUpdateTransaction) {
  if (data.salesAgreementId) {
    const salesAgreementReferencedAlready = await prisma.transaction.findFirst({
      where: {
        salesAgreementId: data.salesAgreementId,
        id: { not: id },
      },
    });

    if (salesAgreementReferencedAlready) {
      throw new Error('Sales Agreement is already attached to another transaction.');
    }
  }

  if (data.purchaseOrderId) {
    const purchaseOrderReferencedAlready = await prisma.transaction.findFirst({
      where: {
        purchaseOrderId: data.purchaseOrderId,
        id: { not: id },
      },
    });

    if (purchaseOrderReferencedAlready) {
      throw new Error('Purchase Order is already attached in another transaction.');
    }
  }

  return await prisma.transaction.update({
    where: { id },
    data: {
      ...(data.salesAgreementId && { salesAgreementId: data.salesAgreementId }),
      ...(data.purchaseOrderId && { purchaseOrderId: data.purchaseOrderId }),
    },
  });
}

export async function deleteTransaction(id: string) {
  return await prisma.transaction.delete({
    where: { id },
  })
}

export async function fetchTransaction({ id }: IFetchTransaction) {
  return await prisma.transaction.findUnique({
    where: {
      id
    },
    include: {
      client: true,
      tourVoucher: {
        include: {
          itineraries: true
        }
      },
      approver: true,
      preparedBy: true,
      travelVoucher: {
        include: {
          airline: true,
          shipping: true
        }
      },
      accommodationVoucher: {
        include: {
          rooms: true
        }
      },
      transportVoucher: {
        include: {
          itineraries: true
        }
      },
      salesAgreement: {
        include: {
          creator: true,
          salesAgreementItems: true
        }
      },
      purchaseOrder: {
        include: {
          creator: true,
          purchaseOrderItems: {}
        }
      }
    }
  })
}
export interface IFetchTransactions {
  skip?: number;
  take?: number;
  search?: string;
  branch?: string;
  travel?: boolean;
  accommodation?: boolean;
  tour?: boolean;
  transport?: boolean;
}


export async function fetchTransactions({ skip, take, search, travel, accommodation, tour, transport, branch }: IFetchTransactions) {
  let whereInput: Prisma.TransactionWhereInput = {};

  if (search) {
    whereInput = {
      OR: [
        { client: { name: { contains: search, mode: 'insensitive' } } },
        { transactionNumber: { contains: search, mode: "insensitive" } },
      ],
    };
  }


  const voucherFilters: Prisma.TransactionWhereInput[] = [];

  if (travel) {
    voucherFilters.push({ travelVoucher: { some: {} } });
  }
  if (accommodation) {
    voucherFilters.push({ accommodationVoucher: { some: {} } });
  }
  if (tour) {
    voucherFilters.push({ tourVoucher: { some: {} } });
  }
  if (transport) {
    voucherFilters.push({ transportVoucher: { some: {} } });
  }

  if (voucherFilters.length > 0) {
    whereInput = {
      ...whereInput,
      OR: voucherFilters,
    };
  }
  const findTransaction = prisma.transaction.findMany({
    where: {
      ...whereInput,
      client: {
        officeBranch: branch as OfficeBranch
      }
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          officeBranch: true,
        },
      },
      preparedBy: true,
      approver: true,
      salesAgreement: true,
      purchaseOrder: true,
      tourVoucher: true,
      travelVoucher: true,
      accommodationVoucher: true,
      transportVoucher: true,
    },
    skip: skip ?? 0,
    take: take ?? 10,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const countTransactions = prisma.transaction.count({
    where: {
      ...whereInput,
      client: {
        officeBranch: branch as OfficeBranch
      }
    },
  });

  const [transactions, total] = await prisma.$transaction([findTransaction, countTransactions]);

  const enrichedTransactions = transactions.map((transaction) => {
    const travelVoucherCount = transaction.travelVoucher.length;
    const accommodationVoucherCount = transaction.accommodationVoucher.length;
    const tourVoucherCount = transaction.tourVoucher.length;
    const transportVoucherCount = transaction.transportVoucher.length;

    return {
      ...transaction,
      voucherCounts: {
        travel: travelVoucherCount,
        accommodation: accommodationVoucherCount,
        tour: tourVoucherCount,
        transport: transportVoucherCount,
      },
    };
  });

  return { transactions: enrichedTransactions, total };
}




export async function fetchTransactionSummary(startDate: Date, endDate: Date) {
  const oneWeekAgo = moment().subtract(7, 'days').startOf('day').toDate();

  const [total, cebuCount, calbayogCount, since7days, transactions] = await Promise.all([
    prisma.transaction.count(),
    prisma.transaction.count({
      where: {
        client: {
          officeBranch: OfficeBranch.CEBU,
        },
      },
    }),

    prisma.transaction.count({
      where: {
        client: {
          officeBranch: OfficeBranch.CALBAYOG,
        },
      },
    }),
    prisma.transaction.count({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    }),
    prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        travelVoucher: true,
        accommodationVoucher: true,
        tourVoucher: true,
        transportVoucher: true,
      },
    }),
  ]);

  const enrichedTransactions = transactions.map((transaction) => {
    const travelVoucherCount = transaction.travelVoucher.length;
    const accommodationVoucherCount = transaction.accommodationVoucher.length;
    const tourVoucherCount = transaction.tourVoucher.length;
    const transportVoucherCount = transaction.transportVoucher.length;

    return {
      ...transaction,
      voucherCounts: {
        travel: travelVoucherCount,
        accommodation: accommodationVoucherCount,
        tour: tourVoucherCount,
        transport: transportVoucherCount,
      },
    };
  });

  const totalVoucherCounts = {
    travel: 0,
    accommodation: 0,
    tour: 0,
    transport: 0,
  };

  enrichedTransactions.forEach((transaction) => {
    totalVoucherCounts.travel += transaction.travelVoucher.length;
    totalVoucherCounts.accommodation += transaction.accommodationVoucher.length;
    totalVoucherCounts.tour += transaction.tourVoucher.length;
    totalVoucherCounts.transport += transaction.transportVoucher.length;
  });



  return { since7days, total, enrichedTransactions, totalVoucherCounts, cebuCount, calbayogCount };
}


export async function fetchRecentEntries() {
  // Fetch the most recent created entries
  const transactionsPromise = prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      preparedBy: true,
    },
    take: 5,
  });

  const salesAgreementsPromise = prisma.salesAgreement.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      creator: true,
    },
    take: 5,
  });

  const purchaseOrdersPromise = prisma.purchaseRequestOrder.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      creator: true,
    },
    take: 5,
  });

  const memorandumsPromise = prisma.memorandum.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  // Fetch updated entries
  const updatedTransactionsPromise = prisma.transaction.findMany({
    where: { updatedAt: { not: null } },
    orderBy: { updatedAt: 'desc' },
    include: {
      preparedBy: true,
    },
    take: 5,
  });

  const updatedSalesAgreementsPromise = prisma.salesAgreement.findMany({
    where: { updatedAt: { not: null } },
    orderBy: { updatedAt: 'desc' },
    include: {
      creator: true,
    },
    take: 5,
  });

  const updatedPurchaseOrdersPromise = prisma.purchaseRequestOrder.findMany({
    where: { updatedAt: { not: null } },
    orderBy: { updatedAt: 'desc' },
    include: {
      creator: true,
    },
    take: 5,
  });

  const updatedMemorandumsPromise = prisma.memorandum.findMany({
    where: { updatedAt: { not: null } },
    orderBy: { updatedAt: 'desc' },
    take: 5,
  });




  const [
    transactions,
    salesAgreements,
    purchaseOrders,
    memorandums,
    updatedTransactions,
    updatedSalesAgreements,
    updatedPurchaseOrders,
    updatedMemorandums,
  ] = await Promise.all([
    transactionsPromise,
    salesAgreementsPromise,
    purchaseOrdersPromise,
    memorandumsPromise,
    updatedTransactionsPromise,
    updatedSalesAgreementsPromise,
    updatedPurchaseOrdersPromise,
    updatedMemorandumsPromise,
  ]);

  const allEntries = [
    ...transactions.map(item => ({ ...item, type: 'Transaction', status: 'Created' })),
    ...salesAgreements.map(item => ({ ...item, type: 'Sales Agreement', status: 'Created' })),
    ...purchaseOrders.map(item => ({ ...item, type: 'Purchase Request Order', status: 'Created' })),
    ...memorandums.map(item => ({ ...item, type: 'Memorandum', status: 'Created' })),

    ...updatedTransactions.map(item => ({ ...item, type: 'Transaction', status: 'Updated' })),
    ...updatedSalesAgreements.map(item => ({ ...item, type: 'Sales Agreement', status: 'Updated' })),
    ...updatedPurchaseOrders.map(item => ({ ...item, type: 'Purchase Request Order', status: 'Updated' })),
    ...updatedMemorandums.map(item => ({ ...item, type: 'Memorandum', status: 'Updated' })),

  ];

  allEntries.sort((a, b) => {
    const aDate = a.updatedAt || a.createdAt || new Date(0);
    const bDate = b.updatedAt || b.createdAt || new Date(0);

    return bDate.getTime() - aDate.getTime();
  });

  return allEntries.slice(0, 10);
}

export async function updateTransactionApprover({ id, approverId }: IUpdateTransactionApprover) {
  return await prisma.transaction.update({
    where: { id },
    data: { approverId }
  });
}

