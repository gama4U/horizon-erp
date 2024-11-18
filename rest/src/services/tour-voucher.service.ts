import prisma from "../utils/db.utils";

export interface ICreateTourVoucher {
  transactionId: string
  tourGuide?: string
  tourContact?: string
  driverName?: string
  driverContact?: string
  itineraries: ICreateTourItinerary[]
  remarks?: string
}
export interface IUpdateTourVoucher {
  id: string
  tourGuide: string
  tourContact: string
  driverName: string
  driverContact: string
  itineraries: IUpdateTourItinerary[]
  remarks?: string
}


export async function createTourVoucher(data: ICreateTourVoucher) {
  return await prisma.tour.create({
    data: {
      transactionId: data.transactionId,
      // tourGuide: data.tourGuide,
      // tourContact: data.tourContact,
      // driverName: data.driverName,
      // driverContact: data.driverContact,
      remarks: data.remarks,
    },
  });
}

export async function updateTourVoucher({ id, ...data }: IUpdateTourVoucher) {
  return await prisma.tour.update({
    where: { id },
    data: {
      tourGuide: data.tourGuide,
      tourContact: data.tourContact,
      driverName: data.driverName,
      driverContact: data.driverContact,
      remarks: data.remarks,
    },
  });
}

export async function deleteTourVoucher(id: string) {
  return await prisma.tour.delete({
    where: {
      id
    }
  })
}

export interface ICreateTourItinerary {
  tourId: string
  title: string
  description: string
  startDate: Date
  endDate: Date
}
export interface IUpdateTourItinerary {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
}

export async function createTourItinerary(data: ICreateTourItinerary) {
  return await prisma.tourItinerary.create({
    data: {
      ...data,
    }
  })
}

export async function updateTourItinerary({ id, ...data }: IUpdateTourItinerary) {
  return await prisma.tourItinerary.update({
    where: { id },
    data
  })
}
export async function deleteTourItinerary(id: string) {
  return await prisma.tourItinerary.delete({
    where: { id },
  })
}

export interface ICreateTransportItinerary {
  transportId: string
  title: string
  description: string
  startDate: Date
  endDate: Date
}
export interface IUpdateTransportItinerary {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
}

export async function createTransportItinerary(data: ICreateTransportItinerary) {
  return await prisma.transportItinerary.create({
    data: {
      ...data,
    }
  })
}
export async function updateTransportItinerary({ id, ...data }: IUpdateTransportItinerary) {
  return await prisma.transportItinerary.update({
    where: { id },
    data
  })
}
export async function deleteTransportItinerary(id: string) {
  return await prisma.transportItinerary.delete({
    where: { id },
  })
}

