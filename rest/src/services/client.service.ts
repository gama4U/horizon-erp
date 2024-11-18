import { ClientType, OfficeBranch, Prisma } from "@prisma/client";
import prisma from "../utils/db.utils";
import { ICreateClient, IUpdateClient } from "../interfaces/client.interface";
import moment from "moment";

export async function createClient(data: ICreateClient) {
  return await prisma.client.create({
    data
  })
}

export async function updateClient(id: string, data: IUpdateClient) {
  return await prisma.client.update({
    where: {
      id: id
    },
    data
  })
}

export async function deleteClient(id: string) {
  return await prisma.client.delete({
    where: {
      id: id
    }
  })
}

export interface IFindClient {
  skip?: number;
  take?: number;
  search?: string;
  branch?: string;
  isApproved?: boolean;
  typeOfClient?: ClientType
}


export async function fetchClients({ skip, take, search, branch, typeOfClient, isApproved }: IFindClient) {
  let whereInput: Prisma.ClientWhereInput = {};

  if (search) {
    const searchParts = search.split(/\s+/);
    whereInput = {
      AND: searchParts.map((part) => ({
        OR: [
          { name: { contains: part, mode: "insensitive" } },
        ],
      })),
    };
  }

  if (isApproved === true) {
    whereInput.approverId = { not: null };
  }

  const client = prisma.client.findMany({
    where: {
      ...whereInput,
      clientType: typeOfClient,
      officeBranch: branch as OfficeBranch,
    },
    include: {
      transactions: true,
      creator: true,
      approver: true,
      _count: {
        select: {
          transactions: true,
        },
      },
    },
    skip: skip ?? 0,
    take: take ?? 10,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const countClients = prisma.client.count({
    where: {
      ...whereInput,
      clientType: typeOfClient,
      officeBranch: branch as OfficeBranch,
    },
  });

  const [clientsData, total] = await prisma.$transaction([client, countClients]);

  return { clientsData, total };
}


export const findClientById = async (id: string) => {
  return await prisma.client.findUnique({
    where: { id }
  })
}
interface IUpdateClientApprover {
  id: string,
  approverId: string
}
export async function updateClientApprover({ id, approverId }: IUpdateClientApprover) {
  return await prisma.client.update({
    where: { id },
    data: { approverId }
  });
}
interface IClientSummary {
  month: string;
  desktop: number;
  cebuCount: number;
  calbayogCount: number;
}

export async function fetchClientSummary(startMonth: number, endMonth: number): Promise<IClientSummary[]> {
  const summary: IClientSummary[] = [];

  const currentYear = moment().year();

  const isSameYear = endMonth >= startMonth;
  const startYear = isSameYear ? currentYear : currentYear - 1;
  const endYear = isSameYear ? currentYear : currentYear;

  const calbayogCount = await prisma.client.count({
    where: {
      officeBranch: OfficeBranch.CALBAYOG
    }
  });

  const cebuCount = await prisma.client.count({
    where: {
      officeBranch: OfficeBranch.CEBU
    }
  });

  for (let month = startMonth; month <= endMonth; month++) {
    const monthStart = moment().year(month === 1 && startYear > currentYear ? startYear : currentYear).month(month - 1).startOf('month').toDate();
    const monthEnd = moment().year(month === 12 && endYear > currentYear ? endYear : currentYear).month(month - 1).endOf('month').toDate();

    const count = await prisma.client.count({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    summary.push({
      month: moment(monthStart).format("MMMM"),
      desktop: count,
      cebuCount,
      calbayogCount
    });
  }

  return summary;
}
