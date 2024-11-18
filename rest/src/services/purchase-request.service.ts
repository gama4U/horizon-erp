import { OfficeBranch, Prisma } from "@prisma/client";
import moment from 'moment';
import prisma from "../utils/db.utils";
import { ICreatePurchaseRequest, IFindPurchaseRequests, IUpdatePurchaseRequest, IUpdatePurchaseRequestApprover } from "../interfaces/purchase-request.interface";
import { getNextPurchaseRequestNumber } from "../utils/generate-number";

export async function createPurchaseRequest({ officeBranch, ...data }: ICreatePurchaseRequest) {
  const latestPurchaseRequest = await prisma.purchaseRequestOrder.findFirst({
    where: {
      supplier: {
        officeBranch,
      },
    },
    orderBy: {
      sequenceNumber: 'desc',
    },
  });

  const serialNumber = getNextPurchaseRequestNumber(latestPurchaseRequest?.serialNumber || null, officeBranch);

  return prisma.purchaseRequestOrder.create({
    data: {
      ...data,
      serialNumber,
    },
  });
}

export async function updatePurchaseRequest({ id, ...data }: IUpdatePurchaseRequest) {
  return prisma.purchaseRequestOrder.update({
    where: {
      id
    },
    data
  })
}


export async function findPurchaseRequests({ skip, take, search, branch, type, classification }: IFindPurchaseRequests) {
  let whereInput: Prisma.PurchaseRequestOrderWhereInput = {
    disbursementType: type,
    classification,
    supplier: {
      officeBranch: branch as OfficeBranch,
    },
  };


  if (search) {
    whereInput = {
      ...whereInput,
      OR: [
        {
          supplier: {
            name: { contains: search, mode: "insensitive" }
          },
        },
        {
          supplier: {
            address: { contains: search, mode: "insensitive" }
          },
        },
        {
          supplier: {
            contact: { contains: search, mode: "insensitive" }
          },
        },
      ],
    };
  }


  const findPurchaseRequests = prisma.purchaseRequestOrder.findMany({
    where: whereInput,
    include: {
      creator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          userType: true
        }
      },
      supplier: true,
      _count: {
        select: {
          purchaseOrderItems: true
        }
      }
    },
    skip: skip ?? 0,
    take: take ?? 10,
    orderBy: {
      createdAt: 'desc'
    }
  });

  const countPurchaseRequests = prisma.purchaseRequestOrder.count({
    where: whereInput,
  });

  const [purchaseRequests, total] = await prisma.$transaction([
    findPurchaseRequests,
    countPurchaseRequests
  ]);

  return { purchaseRequests, total };
}


export async function findPurchaseRequestById(id: string) {
  return await prisma.purchaseRequestOrder.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          avatar: true,
          firstName: true,
          lastName: true,
          email: true,
          userType: true,
          signature: true
        }
      },
      salesAgreement: true,
      transaction: true,
      purchaseOrderItems: {
        orderBy: {
          createdAt: 'desc'
        }
      },
      approver: {
        select: {
          id: true,
          avatar: true,
          firstName: true,
          lastName: true,
          email: true,
          userType: true,
          signature: true
        }
      },
      supplier: true,
      _count: {
        select: {
          purchaseOrderItems: true
        }
      }
    }
  });
}

export async function deletePurchaseRequestById(id: string) {
  return await prisma.purchaseRequestOrder.delete({
    where: {
      id
    }
  });
}
export async function fetchPurchaseRequestSummary() {
  const oneWeekAgo = moment().subtract(7, 'days').startOf('day').toDate();

  const [total, since7days, cebuCount, calbayogCount] = await Promise.all([
    prisma.purchaseRequestOrder.count(),
    prisma.purchaseRequestOrder.count({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    }),
    prisma.purchaseRequestOrder.count({
      where: {
        supplier: {
          officeBranch: OfficeBranch.CEBU
        }
      }
    }),
    prisma.purchaseRequestOrder.count({
      where: {
        supplier: {
          officeBranch: OfficeBranch.CALBAYOG
        }
      }
    }),
  ]);

  const rate = total > 0 ? (since7days / total) * 100 : 0;

  return {
    total, since7days, rate, cebuCount, calbayogCount
  }
}


export async function updatePurchaseRequestOrderApprover({ id, approverId }: IUpdatePurchaseRequestApprover) {
  return await prisma.purchaseRequestOrder.update({
    where: { id },
    data: { approverId }
  });
}
