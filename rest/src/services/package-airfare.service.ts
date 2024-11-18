import prisma from "../utils/db.utils"

interface ICreatePackageAirfare {
  packageId: string;
  airline: string;
  flightDetails: string;
}
export const createPackageAirfare = async(data: ICreatePackageAirfare) => {
  return await prisma.packageAirfare.create({data});
}

interface IUpdatePackageAirfare {
  id: string;
  airline: string;
  flightDetails: string;
}
export const updatePackageAirfare = async({id, ...data}: IUpdatePackageAirfare) => {
  return await prisma.packageAirfare.update({
    where: {id},
    data
  });
}

export const deletePackageAirfareByPackageId = async(id: string) => {
  return await prisma.packageAirfare.deleteMany({
    where: {
      packageId: id
    }
  })
}

export const deletePackageAirfare = async(id: string) => {
  return await prisma.packageAirfare.delete({
    where: {id}
  });
}
