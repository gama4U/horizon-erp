import prisma from "../utils/db.utils";
import { ICreateAirlines, ICreateShipping, ICreateTravelVoucher, IUpdateAirlines, IUpdateShipping, IUpdateTravelVoucher } from "../interfaces/travel-voucher.interface";


export async function createTravelVoucher(data: ICreateTravelVoucher) {
  return await prisma.travel.create({
    data: {
      type: data.type,
      transactionId: data.transactionId
    }
  })
}
export async function createAirlines(data: ICreateAirlines) {
  return await prisma.airlines.create({
    data
  })
}
export async function createShipping(data: ICreateShipping) {
  return await prisma.shipping.create({
    data
  })
}

export async function updateTravelVoucher(id: string, data: IUpdateTravelVoucher) {
  return await prisma.travel.update({
    where: {
      id: id
    },
    data: {
      type: data.type,
    }
  })
}

export async function deleteTravelVoucher(id: string) {
  return await prisma.travel.delete({
    where: { id }
  })
}

export async function updateAirline(data: IUpdateAirlines) {
  return await prisma.airlines.update({
    where: {
      id: data.id
    },
    data
  })
}
export async function updateShipping(data: IUpdateShipping) {
  return await prisma.shipping.update({
    where: {
      id: data.id
    },
    data
  })
}
