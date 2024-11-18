import { OfficeBranch, Prisma } from "@prisma/client";
import prisma from "../utils/db.utils";
import { getNextMemorandumNumber } from "../utils/generate-number";
import moment from "moment";

export interface ICreateMemorandum {
  to: string
  subject: string
  contents: string
  creatorId: string
  branch?: string
}


export async function createMemorandum({ branch, ...data }: ICreateMemorandum) {
  const lastMemo = await prisma.memorandum.findFirst({
    where: {
      branch: branch as OfficeBranch,
    },
    orderBy: { memorandumNumber: 'desc' },
  });

  const nextMemoNumber = getNextMemorandumNumber(lastMemo?.memorandumNumber || null, String(branch));

  return await prisma.memorandum.create({
    data: {
      ...data,
      branch: branch as OfficeBranch,
      memorandumNumber: nextMemoNumber,
    },
  });
}

export async function deleteMemorandum(id: string) {
  return await prisma.memorandum.delete({
    where: {
      id
    }
  })
}
export interface IUpdateMemorandum {
  id: string
  to: string
  addressee: string
  contents: string
}
export async function updateMemorandum({ id, ...data }: IUpdateMemorandum) {
  return await prisma.memorandum.update({
    where: {
      id
    },
    data
  })
}

export interface IFindMemorandums {
  skip?: number;
  take?: number;
  search?: string;
  branch?: string
}

export async function fetchMemorandums({ skip, take, search, branch }: IFindMemorandums) {
  let whereInput: Prisma.MemorandumWhereInput = {};

  if (search) {
    whereInput = {
      OR: [
        { subject: { contains: search, mode: "insensitive" } },
        { to: { contains: search, mode: "insensitive" } },
        { memorandumNumber: { contains: search, mode: "insensitive" } },
      ],
    }
  }

  const memorandums = prisma.memorandum.findMany({
    where: {
      ...whereInput,
      branch: branch as OfficeBranch
    },
    skip: skip ?? 0,
    take: take ?? 10,
    orderBy: {
      createdAt: 'desc'
    }
  });

  const countMemorandums = prisma.memorandum.count({
    where: {
      ...whereInput,
      branch: branch as OfficeBranch
    },
  });

  const [memorandumData, total] = await prisma.$transaction([
    memorandums,
    countMemorandums
  ]);

  return { memorandumData, total };
}
export async function findMemorandumById(id: string) {
  return await prisma.memorandum.findUnique({
    where: { id },
    include: {
      creator: true,
      approver: true
    }
  });
}

export async function fetchMemorandumSummary() {
  const oneWeekAgo = moment().subtract(7, 'days').startOf('day').toDate();

  const [total, since7days, cebuCount, calbayogCount] = await Promise.all([
    prisma.memorandum.count(),
    prisma.memorandum.count({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    }),
    prisma.memorandum.count({
      where: {
        branch: OfficeBranch.CEBU
      }
    }),
    prisma.memorandum.count({
      where: {
        branch: OfficeBranch.CALBAYOG
      }
    }),
  ]);

  const rate = total > 0 ? (since7days / total) * 100 : 0;

  return {
    total, since7days, rate
  }
}

export interface IUpdateMemorandumApprover {
  id: string
  approverId: string
}

export async function updateMemorandumApprover({ id, approverId }: IUpdateMemorandumApprover) {
  return await prisma.memorandum.update({
    where: { id },
    data: { approverId }
  });
}
