import { ITravelVoucher, TravelVoucherType } from "../../../interfaces/travel.interface";
import { format } from 'date-fns';
import { Button } from "../../ui/button";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Separator } from "../../ui/separator";
import EditTravelVoucherDialog from "../../dialogs/transaction/travel-voucher/edit";
import DeleteTravel from "@/components/alert/transactions/travel/delete";

interface TravelVoucherProps {
  travelVoucher: ITravelVoucher[];
}

export default function TravelVoucher({ travelVoucher }: TravelVoucherProps) {

  const [travel, setTravel] = useState<ITravelVoucher>()
  const [openEditDialog, setOpenEditDialog] = useState(false)

  function handleEditTravelVoucher(selectedTravel: ITravelVoucher) {
    setOpenEditDialog(true)
    setTravel(selectedTravel)
  }
  return (
    <div className="flex flex-col gap-y-6 p-4 sm:p-6 lg:p-0 mt-2 bg-white rounded-lg">
      {travelVoucher.map((voucher, index) => (
        <div key={index} className="border-2 border-dotted p-4 mb-2">
          <div className="flex flex-row justify-between items-center">
            <p className="text-sm font-semibold">Travel #{index + 1}</p>
            <div className="flex flex-row gap-x-2 items-center ">
              <Button size="icon" variant="ghost" className="text-xs gap-x-2" onClick={() => handleEditTravelVoucher(voucher)}>
                <Pencil size={14} />
              </Button>
              <DeleteTravel id={String(voucher?.id)} />
            </div>
          </div>

          <Separator className="my-2" />

          {voucher.type === TravelVoucherType.AIRLINES &&
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-1 gap-x-4">
                <p className="text-sm md:text-xs">Travel Type:</p>
                <p className="text-sm md:text-xs font-medium">{voucher.type}</p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-1 gap-x-4">
                <p className="text-sm md:text-xs">Airline Name:</p>
                <p className="text-sm md:text-xs font-medium">{voucher.airline?.name ?? "N/A"}</p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-1 gap-x-4">
                <p className="text-sm md:text-xs">Airline Code:</p>
                <p className="text-sm md:text-xs font-medium">{voucher.airline?.code ?? "N/A"}</p>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-1 gap-x-4">
                <p className="text-sm md:text-xs">Origin:</p>
                <p className="text-sm md:text-xs font-medium">{voucher.airline?.origin ?? "N/A"}</p>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-1 gap-x-4">
                <p className="text-sm md:text-xs">Destination:</p>
                <p className="text-sm md:text-xs font-medium">{voucher.airline?.destination ?? "N/A"}</p>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-1 gap-x-4">
                <p className="text-sm md:text-xs">ETD:</p>
                <p className="text-sm md:text-xs font-medium">{format(new Date(voucher.airline?.etd ?? new Date()), "MMMM d, yyyy")}
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-1 gap-x-4">
                <p className="text-sm md:text-xs">ETA:</p>
                <p className="text-sm md:text-xs font-medium">
                  {format(new Date(voucher.airline?.eta ?? new Date()), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          }
          {voucher.type === TravelVoucherType.SHIPPING &&
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-1 gap-x-4">
                <p className="text-sm md:text-xs">Travel Type:</p>
                <p className="text-sm md:text-xs font-medium">{voucher.type}</p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-1 gap-x-4">
                <p className="text-sm md:text-xs">Shipping Name:</p>
                <p className="text-sm md:text-xs font-medium">{voucher.shipping?.name ?? "N/A"}</p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-1 gap-x-4">
                <p className="text-sm md:text-xs">Voyage Number:</p>
                <p className="text-sm md:text-xs font-medium">{voucher.shipping?.voyageNumber ?? "N/A"}</p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-1 gap-x-4">
                <p className="text-sm md:text-xs">Origin:</p>
                <p className="text-sm md:text-xs font-medium">{voucher.shipping?.origin ?? "N/A"}</p>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-1 gap-x-4">
                <p className="text-sm md:text-xs">Destination:</p>
                <p className="text-sm md:text-xs font-medium">{voucher.shipping?.destination ?? "N/A"}</p>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-1 gap-x-4">
                <p className="text-sm md:text-xs">Date of Travel</p>
                <p className="text-sm md:text-xs font-medium">
                  {format(new Date(voucher.shipping?.dateOfTravel ?? new Date()), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          }
        </div>
      ))}
      {travel &&
        <EditTravelVoucherDialog travelVoucher={travel} setOpenDialog={setOpenEditDialog} openDialog={openEditDialog} />
      }
    </div>

  );
}
