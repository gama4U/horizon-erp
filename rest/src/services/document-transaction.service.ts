import { DocumentTransactionType, OfficeBranch, Prisma } from "@prisma/client";
import prisma from "../utils/db.utils";
import { getNextDtsNumber } from "../utils/generate-number";
import moment from "moment";

export interface ICreateDocumentTransaction {
  type: DocumentTransactionType
  preparedById: string
  clientId: string
}

export async function createDocumentTransaction(data: ICreateDocumentTransaction, officeBranch: string) {
  const lastDts = await prisma.documentTransaction.findFirst({
    where: {
      client: {
        officeBranch: officeBranch as OfficeBranch,
      }
    },
    orderBy: { dtsNumber: 'desc' },
  });

  const nextDtsNumber = getNextDtsNumber(lastDts?.dtsNumber || null, officeBranch);

  return await prisma.documentTransaction.create({
    data: {
      ...data,
      dtsNumber: nextDtsNumber,
    },
  });
}
export async function deleteDocumentTransaction(id: string) {
  return await prisma.documentTransaction.delete({
    where: {
      id
    }
  })
}
export interface ITransmitDocument {
  id: string
  transmittedById: string
}

export async function transmitDocument({ id, transmittedById }: ITransmitDocument) {
  return await prisma.documentTransaction.update({
    where: {
      id
    },
    data: {
      transmittedById
    }
  })
}
export interface IUpdateDocumentTransaction {
  id: string
  documents: string[]

  recievedById?: string
  transmittedById?: string
  returnedById?: string
  recievedByOutsider?: string
  recievedFromOutsider?: string
}
export async function updateDocumentTransaction({ id, ...data }: IUpdateDocumentTransaction) {
  return await prisma.documentTransaction.update({
    where: {
      id
    },
    data
  })
}

export interface IFindDocumentTransaction {
  skip?: number;
  take?: number;
  search?: string;
  branch?: string;
  RECIEVE?: boolean
  TRANSMITTAL?: boolean;
  RETURN?: boolean
}

export async function fetchDocumentTransactions({
  skip,
  take,
  search,
  RECIEVE,
  TRANSMITTAL,
  RETURN,
  branch
}: IFindDocumentTransaction & { RECIEVE?: boolean; TRANSMITTAL?: boolean; RETURN?: boolean }) {
  let whereInput: Prisma.DocumentTransactionWhereInput = {};

  if (search) {
    whereInput.OR = [
      {
        client: {
          name: { contains: search, mode: "insensitive" },
        },
      },
      { dtsNumber: { contains: search, mode: "insensitive" } },
    ];
  }

  const types: DocumentTransactionType[] = [];

  if (RECIEVE) types.push(DocumentTransactionType.RECIEVE);
  if (TRANSMITTAL) types.push(DocumentTransactionType.TRANSMITTAL);
  if (RETURN) types.push(DocumentTransactionType.RETURN);

  if (types.length > 0) {
    whereInput.type = {
      in: types,
    };
  }

  const documentTransactions = prisma.documentTransaction.findMany({
    where: {
      ...whereInput,
      client: {
        officeBranch: branch as OfficeBranch
      }
    },
    skip: skip ?? 0,
    take: take ?? 10,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      client: true,
      preparedBy: true,
      recievedBy: true,
      returnedBy: true,
      transmittedBy: true,
    },
  });

  const countDocumentTransactions = prisma.documentTransaction.count({
    where: {
      ...whereInput,
      client: {
        officeBranch: branch as OfficeBranch
      }
    },
  });

  const [documentTransactionData, total] = await prisma.$transaction([
    documentTransactions,
    countDocumentTransactions,
  ]);

  return { documentTransactionData, total };
}



export async function findDocumentTransactionById(id: string) {
  return await prisma.documentTransaction.findUnique({
    where: { id },
    include: {
      preparedBy: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true,
          signature: true
        }
      },
      client: true,
      recievedBy: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true,
          signature: true
        }
      },
      returnedBy: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true,
          signature: true
        }
      },
      transmittedBy: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true,
          signature: true
        }
      }
    }
  });
}
export async function fetchDocumentTransactionsSummary() {

  const oneWeekAgo = moment().subtract(7, 'days').startOf('day').toDate();

  const [total, since7days, cebuCount, calbayogCount] = await Promise.all([
    prisma.documentTransaction.count(),
    prisma.documentTransaction.count({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    }),
    prisma.documentTransaction.count({
      where: {
        client: {
          officeBranch: OfficeBranch.CEBU
        }
      }
    }),
    prisma.documentTransaction.count({
      where: {
        client: {
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

