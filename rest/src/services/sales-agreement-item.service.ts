import prisma from "../utils/db.utils";
import { ICreateSalesAgreementItem, IUpdateSalesAgreementItem } from "../interfaces/sales-agreement-item.interface";

export async function createSalesAgreementItem(data: ICreateSalesAgreementItem) {
  return prisma.salesAgreementItem.create({data});
}

export async function updateSalesAgreementItem({salesAgreementItemId, ...data}: IUpdateSalesAgreementItem) {
  return prisma.salesAgreementItem.update({
    where: {
      id: salesAgreementItemId
    },
    data
  })
}

export async function deleteSalesAgreementItem(id: string) {
  return await prisma.salesAgreementItem.delete({
    where: {
      id
    }
  });
}

export async function deleteSalesAgreementItems(id: string) {
  return await prisma.salesAgreementItem.deleteMany({
    where: {
      salesAgreementId: id
    }
  });
}
