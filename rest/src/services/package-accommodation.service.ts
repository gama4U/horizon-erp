import { Currency } from "@prisma/client";
import prisma from "../utils/db.utils"

type ICreatePackageAccommodation = {
  packageId: string;
  category: string;
  options: string[];
  ratePerPerson: number;
  currency: Currency;
}
export const createPackageAccommodation = async(data: ICreatePackageAccommodation) => {
  return await prisma.packageAccommodation.create({data})
}


type IUpdatePackageAccommodation = {
  id: string;
  category: string;
  options: string[];
  ratePerPerson: number;
  currency: Currency;
}
export const updatePackageAccommodation = async({id, ...data}: IUpdatePackageAccommodation) => {
  return await prisma.packageAccommodation.update({
    where: {id},
    data,
  })
}

export const deletePackageAccommodationByPackageId = async(id: string) => {
  return await prisma.packageAccommodation.deleteMany({
    where: {
      packageId: id
    }
  })
}

export const deletePackageAccommodationById = async(id: string) => {
  return await prisma.packageAccommodation.delete({
    where: {id}
  })
}
