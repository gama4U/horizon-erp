export interface ICreateAccommodationVoucher {
  transactionId: string
  type: AccommodationType
  name: string
  hotelConfirmationNumber: string
  numberOfNights?: number
  pax?: number
  checkinDate: Date
  checkoutDate: Date
  remarks?: string
}
export interface IUpdateAccommodationVoucher {
  type: AccommodationType
  name: string
  hotelConfirmationNumber: string
  checkinDate: Date
  checkoutDate: Date
  numberOfNights: number
  pax: number
  remarks?: string
}

import { AccommodationType } from "@prisma/client"
import prisma from "../utils/db.utils";

export async function createAccommodationVoucher(data: ICreateAccommodationVoucher) {
  return await prisma.accommodation.create({
    data
  })
}
export async function updateAccommodationVoucher(id: string, data: IUpdateAccommodationVoucher) {
  return await prisma.accommodation.update({
    where: {
      id: id
    },
    data
  })
}
export async function deleteAccommodationVoucher(id: string) {
  return await prisma.accommodation.delete({
    where: {
      id: id
    },
  })
}

interface ICreateRoomAccommodation {
  childrenCount: number | 0
  infantCount: number | 0
  adultCount: number | 0
  seniorCount: number | 0
}
interface IUpdateRoomAccommodation {
  id: string
  childrenCount: number
  infantCount: number
  adultCount: number
  seniorCount: number
}

export async function createRoomAccommodation(accommodationId: string, data: ICreateRoomAccommodation) {
  return await prisma.roomAccommodation.create({
    data: {
      accommodationId,
      ...data
    },
  })
}
export async function updateRoomAccommodation({ id, ...data }: IUpdateRoomAccommodation) {
  return await prisma.roomAccommodation.update({
    where: {
      id
    },
    data
  })
}
export async function deleteRoomAccommodation(id: string) {
  return await prisma.roomAccommodation.delete({
    where: {
      id
    }
  })
}
