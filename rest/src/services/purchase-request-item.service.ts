import prisma from "../utils/db.utils";
import { ICreatePurchaseRequestItem, IUpdatePurchaseRequestItem } from "../interfaces/purchase-request-item.interface";

export async function createPurchaseRequestItem(data: ICreatePurchaseRequestItem) {
  return await prisma.purchaseRequestOrderItem.create({data})
}

export async function deletePurchaseRequestItem(id: string) {
  return await prisma.purchaseRequestOrderItem.delete({
    where: {
      id
    }
  });
}

export async function deletePurchaseRequestItems(purchaseRequestId: string) {
  return await prisma.purchaseRequestOrderItem.deleteMany({
    where: {
      purchaseRequestOrderId: purchaseRequestId
    }
  });
}

export async function updatePurchaseRequestItem({id, ...data}: IUpdatePurchaseRequestItem) {
  return await prisma.purchaseRequestOrderItem.update({
    where: {id},
    data
  })
}
