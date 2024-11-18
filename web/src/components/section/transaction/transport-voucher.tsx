import { useState } from "react";
import { Separator } from "../../ui/separator";
import { format } from "date-fns";
import { Button } from "../../ui/button";
import { Pencil } from "lucide-react";
import { IItinerary } from "../../../interfaces/tour.interface";
import { ITransportVoucher } from "../../../interfaces/transport.interface";
import { EditTransportVoucherDialog } from "../../dialogs/transaction/transport-voucher/edit";
import { AddTransportItineraryDialog } from "../../dialogs/transaction/transport-itinerary/add";
import { EditTransportItineraryDialog } from "../../dialogs/transaction/transport-itinerary/edit";
import DeleteTransportation from "@/components/alert/transactions/transportation/delete";
import DeleteItinerary from "@/components/alert/transactions/itinerary/delete-itinerary";

interface ITransportVoucherProps {
  transportVoucher: ITransportVoucher[];
}

export default function TransportVoucher({ transportVoucher }: ITransportVoucherProps) {
  const [transport, setTransport] = useState<ITransportVoucher>();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<IItinerary>();
  const [openEditItineraryDialog, setOpenEditItineraryDialog] = useState(false);
  const [openAddItineraryDialog, setOpenAddItineraryDialog] = useState(false);

  function handleEditTransportation(selectedTransport: ITransportVoucher) {
    setOpenEditDialog(true);
    setTransport(selectedTransport);
  }

  function handleAddItinerary(selectedTransport: ITransportVoucher) {
    setOpenAddItineraryDialog(true);
    setTransport(selectedTransport);
  }

  function handleEditItinerary(itinerary: IItinerary) {
    setSelectedItinerary(itinerary);
    setOpenEditItineraryDialog(true);
  }

  return (
    <div className="flex flex-col gap-y-6 p-4 sm:p-6 lg:p-0 mt-2 bg-white rounded-lg">
      {transportVoucher.map((voucher, index) => (
        <div key={index} className="border-2 border-dotted p-4 mb-2">
          <div className="flex flex-row justify-between items-center">
            <p className="text-sm font-semibold">Transportation #{index + 1}</p>
            <div className="flex flex-row gap-x-2 items-center ">
              <Button size="icon" variant="ghost" className="text-xs gap-x-2" onClick={() => handleEditTransportation(voucher)}>
                <Pencil size={14} />
              </Button>
              <DeleteTransportation id={String(voucher?.id)} />
            </div>
          </div>

          <Separator className="my-2" />


          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <p className="text-xs font-medium">Service Type:</p>
              <p className="text-xs text-gray-700">{voucher.serviceType}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <p className="text-xs font-medium">Vehicle Type:</p>
              <p className="text-xs text-gray-700">{voucher.vehicleType}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <p className="text-xs font-medium">Vehicle Plate Number:</p>
              <p className="text-xs text-gray-700">{voucher.vehiclePlateNumber}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <p className="text-xs font-medium">Driver Name:</p>
              <p className="text-xs text-gray-700">{voucher.driverName}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <p className="text-xs font-medium">Driver Contact:</p>
              <p className="text-xs text-gray-700">{voucher.driverContact}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <p className="text-xs font-medium">Remarks:</p>
              <p className="text-xs text-gray-700">{voucher.remarks ?? "N/A"}</p>
            </div>
          </div>
          <Separator className="my-6" />

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold">Itineraries</h2>
              <Button variant="outline" className="text-xs" onClick={() => handleAddItinerary(voucher)}>
                Add Itinerary
              </Button>
            </div>
            {voucher.itineraries?.map((itinerary, idx) => (
              <div key={idx} className="space-y-4 border-2 rounded-xl p-4">
                <div className="flex flex-row justify-between items-center">
                  <p className="text-xs text-primary font-semibold">Itinerary #{index + 1}</p>
                  <div className="flex flex-row gap-x-2 items-center ">
                    <Button size="icon" variant="ghost" className="text-xs gap-x-2" onClick={() => handleEditItinerary(itinerary)}>
                      <Pencil size={14} />
                    </Button>
                    <DeleteItinerary id={String(itinerary?.id)} type="transport" />
                  </div>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <p className="text-xs font-medium">Title:</p>
                    <p className="text-xs text-gray-700">{itinerary.title ?? "N/A"}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <p className="text-xs font-medium">Description:</p>
                    <p className="text-xs text-gray-700">{itinerary.description ?? "N/A"}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <p className="text-xs font-medium">Start Date:</p>
                    <p className="text-xs text-gray-700">{format(new Date(itinerary.startDate), "MMMM d, yyyy")}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <p className="text-xs font-medium">End Date:</p>
                    <p className="text-xs text-gray-700">{format(new Date(itinerary.endDate), "MMMM d, yyyy")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {index < transportVoucher.length - 1 && <Separator className="my-6" />}
        </div>
      ))}

      {transport && (
        <EditTransportVoucherDialog
          selectedTransport={transport}
          setOpenDialog={setOpenEditDialog}
          openDialog={openEditDialog}
        />
      )}

      {selectedItinerary && (
        <EditTransportItineraryDialog
          itinerary={selectedItinerary}
          setOpenDialog={setOpenEditItineraryDialog}
          openDialog={openEditItineraryDialog}
        />
      )}

      {openAddItineraryDialog && (
        <AddTransportItineraryDialog
          setOpenDialog={setOpenAddItineraryDialog}
          openDialog={openAddItineraryDialog}
          transportId={transport?.id}
        />
      )}
    </div>
  );
}
