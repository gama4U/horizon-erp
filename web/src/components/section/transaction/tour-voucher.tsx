import { useState } from "react";
import { Separator } from "../../ui/separator";
import { format } from "date-fns";
import { Button } from "../../ui/button";
import { Loader2, MapPin, Pencil } from "lucide-react";
import { ITourVoucher, IItinerary } from "../../../interfaces/tour.interface";
import { EditTourVoucherDialog } from "../../dialogs/transaction/tour-voucher/edit";
import { AddTourItineraryDialog } from "../../dialogs/transaction/tour-itinerary/add";
import { EditTourItineraryDialog } from "../../dialogs/transaction/tour-itinerary/edit";
import DeleteTour from "@/components/alert/transactions/tour/delete";
import DeleteItinerary from "@/components/alert/transactions/itinerary/delete-itinerary";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTourVoucher, ICreateTourVoucher } from "@/api/mutations/transaction.mutation";
import { toast } from "sonner";

interface ITourVoucherProps {
  transactionId?: string
  tourVoucher?: ITourVoucher[];
}

export default function TourVoucher({ tourVoucher, transactionId }: ITourVoucherProps) {
  const [tour, setTour] = useState<ITourVoucher>();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<IItinerary>();
  const [openEditItineraryDialog, setOpenEditItineraryDialog] = useState(false);
  const [openAddItineraryDialog, setOpenAddItineraryDialog] = useState(false);
  const queryClient = useQueryClient()

  const { mutate: addTourMutate, isPending: addingTour } = useMutation({
    mutationFn: async (data: ICreateTourVoucher) => await createTourVoucher(data),
    onError: (error) => {
      toast.error(error.message, {
        className: 'text-destructive',
        position: 'top-center',
      })
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['transaction'] })
      toast.success("Tour Voucher added successfully", {
        className: 'text-primary',
        position: 'top-center',
      });
    }
  });


  function handleEditTour(selectedTour: ITourVoucher) {
    setOpenEditDialog(true);
    setTour(selectedTour);
  }

  function handleAddItinerary(selectedTour: ITourVoucher) {
    setOpenAddItineraryDialog(true);
    setTour(selectedTour);
  }

  function handleEditItinerary(itinerary: IItinerary) {
    setSelectedItinerary(itinerary);
    setOpenEditItineraryDialog(true);
  }

  return (
    <div className="flex flex-col gap-y-6 p-4 sm:p-6 lg:p-0 mt-2 bg-white rounded-lg">

      <div className="flex justify-end">
        <Button
          disabled={addingTour}
          variant="outline" className="text-xs gap-x-2 text-primary" onClick={() => addTourMutate({
            transactionId: transactionId ?? ""
          })}>
          {
            addingTour ?
              <div className="flex flex-row items-center gap-x-">
                <p className="text-xs">Adding..</p>
                <Loader2 className="animate-spin" />
              </div> :
              <p className="text-xs">Add</p>
          }
          <MapPin />
        </Button>
      </div>
      {tourVoucher?.length === 0 && (
        <div className="flex justify-center p-5">
          <p className="text-gray-400 text-xs">Transaction does not include any tour voucher.</p>
        </div>

      )}
      {tourVoucher?.map((voucher, index) => (
        <div key={index} className="border-2 border-dotted p-4 mb-2">
          <div className="flex flex-row justify-between items-center">
            <p className="text-sm font-semibold">Tour #{index + 1}</p>
            <div className="flex flex-row gap-x-2 items-center ">
              <Button size="icon" variant="ghost" className="text-xs gap-x-2" onClick={() => handleEditTour(voucher)}>
                <Pencil size={14} />
              </Button>
              <DeleteTour id={String(voucher?.id)} />
            </div>
          </div>

          <Separator className="my-2" />
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
                    <DeleteItinerary id={String(itinerary?.id)} type="tour" />
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
          <Separator className="my-6" />
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-col items-start sm:items-start justify-between">
              <p className="text-xs font-medium">Remarks:</p>
              <p className="text-xs text-gray-700">{voucher.remarks ?? "N/A"}</p>
            </div>
          </div>
          {index < tourVoucher.length - 1 && <Separator className="my-6" />}
        </div>
      ))}

      {tour && (
        <EditTourVoucherDialog
          selectedTour={tour}
          setOpenDialog={setOpenEditDialog}
          openDialog={openEditDialog}
        />
      )}

      {selectedItinerary && (
        <EditTourItineraryDialog
          itinerary={selectedItinerary}
          setOpenDialog={setOpenEditItineraryDialog}
          openDialog={openEditItineraryDialog}
        />
      )}

      {openAddItineraryDialog && (
        <AddTourItineraryDialog
          setOpenDialog={setOpenAddItineraryDialog}
          openDialog={openAddItineraryDialog}
          tourId={tour?.id}
        />
      )}
    </div>
  );
}
