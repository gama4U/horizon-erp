import { Loader2, Printer, ThumbsUp } from 'lucide-react';
import { format } from "date-fns";
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ITransaction } from '@/interfaces/transaction.interface';
import { TransportServiceType, VehicleType } from '@/interfaces/transport.interface';
import logo from '../../../assets/logo.png'
import { TravelVoucherType } from '@/interfaces/travel.interface';
import { useAuth } from '@/providers/auth-provider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { approveTransaction } from '@/api/mutations/transaction.mutation';
import Constants from '@/constants';
import { OfficeBranch } from '@/interfaces/user.interface';
import { RenderHeaderText } from '@/components/common/header';

interface Props {
  data: ITransaction;
}

export default function PrintPreview({ data }: Props) {
  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const { session: { user } } = useAuth();

  const { mutate: approveMutate, isPending: approving } = useMutation({
    mutationFn: async (id: string) => await approveTransaction(id),
    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: ['transaction'] })
      toast.success(data.message, {
        position: 'top-center',
        className: 'text-primary'
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        position: 'top-center',
        className: 'text-destructive'
      })
    },
  });

  return (
    <div className="w-full bg-white  p-4 border-[1px] shadow-md">
      <div className="h-[50px] px-4 flex items-center justify-between">
        <h1 className="text-xs text-muted-foreground italic">Print preview</h1>
        <div className='flex items-center gap-1'>
          {(!data?.approver && user?.permission && Constants.PermissionsCanApprove.includes(user?.permission)) && (
            <Button
              size={'sm'}
              onClick={() => approveMutate(data?.id)}
              className='gap-1'
              disabled={approving}
            >
              {(approving || queryClient.isFetching({ queryKey: ['transaction'] })) ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                <ThumbsUp size={16} />
              )}
              <span>Approve</span>
            </Button>
          )}
          <Button
            onClick={() => reactToPrintFn()}
            size={'sm'}
            className='gap-1'
            disabled={data.approver ? false : true}
          >
            <Printer size={16} />
            <span>Print</span>
          </Button>
        </div>
      </div>
      <Separator />

      <div ref={contentRef} className="flex flex-col min-h-[100vh] p-4 space-y-4 justify-between">
        <div className='flex justify-center items-center gap-x-4 flex-3'>
          <div className="text-center text-muted-foreground flex flex-col justify-center items-center">
            <img src={logo} className='object-contain w-[180px] h-[110px]' />
            {RenderHeaderText(data.client.officeBranch as OfficeBranch)}
          </div>
        </div>

        <div className="flex flex-col gap-2 justify-start  flex-1 p-2">
          <div className="flex items-start gap-2 text-xs justify-between">
            <div className='flex row gap-x-2'>
              <span className="font-semibold">Client Name:</span>
              <span>{data.client.name}</span>
            </div>
            <div className='flex row gap-x-2'>
              <span className="font-semibold">Date Created:</span>
              <span>{format(new Date(data?.createdAt ?? new Date), 'MMMM d, yyyy')}</span>
            </div>
          </div>
          <div className="flex items-start gap-2 text-xs mb-2">
            <span className="font-semibold">Transaction Voucher #:</span>
            <span>{data.transactionNumber}</span>
          </div>
          {data.travelVoucher && data.travelVoucher.length > 0 && (
            <div className="border-t pt-4">
              <>
                <h3 className="text-sm tracking-[18px] text-center font-medium uppercase bg-blue-300 py-1">Travel</h3>
              </>
              {data.travelVoucher.map((voucher, index) => (
                <div className='my-2'>
                  <p className='mb-1 text-xs'>Travel #{index + 1} - {voucher.type}</p>
                  {voucher.type === TravelVoucherType.AIRLINES &&
                    <div key={voucher.id} className="text-xs grid grid-cols-2">
                      <div>
                        <p>Name of Airlines: {voucher.airline?.name}</p>
                        <p>Airline Flight Code: {voucher.airline?.code}</p>
                      </div>
                      <div>
                        <p>Origin: {voucher.airline?.origin}</p>
                        <p>Destination: {voucher.airline?.destination}</p>
                      </div>
                      <div>
                        <p>ETD: {format(new Date(voucher.airline?.etd ?? new Date()), "MMMM d, yyyy")}</p>
                      </div>
                      <div>
                        <p>ETA: {format(new Date(voucher.airline?.eta ?? new Date()), "MMMM d, yyyy")}</p>
                      </div>
                    </div>}
                  {voucher.type === TravelVoucherType.SHIPPING &&
                    <div key={voucher.id} className="text-xs grid grid-cols-2">
                      <div>
                        <p>Name of Shipping: {voucher.shipping?.name}</p>
                        <p>Voyage Number: {voucher.shipping?.voyageNumber}</p>
                      </div>
                      <div>
                        <p>Origin: {voucher.shipping?.origin}</p>
                        <p>Destination: {voucher.shipping?.destination}</p>
                      </div>
                      <div>
                        <p>Date of Travel: {format(new Date(voucher.shipping?.dateOfTravel ?? new Date()), "MMMM d, yyyy")}</p>
                      </div>
                    </div>}
                </div>
              ))}
            </div>
          )}

          {data.accommodationVoucher && data.accommodationVoucher.length > 0 && (
            <div className="border-t pt-4">
              <>
                <h3 className="text-sm tracking-[18px] text-center font-medium uppercase bg-green-300 py-1">Accommodation</h3>
              </>
              {data.accommodationVoucher.map((accommodation, index) => (
                <div key={accommodation.id} className='my-2'>
                  <p className='text-sm font-semibold mb-2'>Accommodation #{index + 1} - {accommodation.type}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 text-xs text-slate-700 mb-2">
                    <div>
                      <p><span className="font-semibold">Name:</span> {accommodation.name}</p>
                      <p><span className="font-semibold">Number of Nights:</span> {accommodation.numberOfNights}</p>
                    </div>
                    <div>
                      <p><span className="font-semibold">Check-in:</span> {format(new Date(accommodation.checkinDate), "MMMM d, yyyy")}</p>
                      <p><span className="font-semibold">Check-out:</span> {format(new Date(accommodation.checkoutDate), "MMMM d, yyyy")}</p>
                    </div>
                    <div>
                      <p><span className="font-semibold">Confirmation Number:</span> {accommodation.hotelConfirmationNumber}</p>
                    </div>
                    <div>
                      {accommodation.remarks && <p><span className="font-semibold">Remarks:</span> {accommodation.remarks}</p>}
                    </div>
                    <div>
                      <p><span className="font-semibold">Pax:</span> {accommodation.pax}</p>
                    </div>
                    <div>
                      <p><span className="font-semibold">Number of Rooms:</span> {accommodation.rooms.length}</p>
                    </div>
                  </div>
                  {accommodation.rooms && (
                    <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                      <table className="min-w-full table-auto text-xs text-slate-600">
                        <thead className="bg-slate-100 text-center">
                          <tr>
                            <th className="px-4 py-2">Room #</th>
                            <th className="px-4 py-2">Children</th>
                            <th className="px-4 py-2">Infants</th>
                            <th className="px-4 py-2">Adults</th>
                            <th className="px-4 py-2">Senior Citizens</th>
                          </tr>
                        </thead>
                        <tbody>
                          {accommodation.rooms && accommodation.rooms.map((room, index) => (
                            <tr key={index} className="border-t border-slate-200 text-center">
                              <td className="px-4 py-2">{index + 1}</td>
                              <td className="px-4 py-2">{room.childrenCount}</td>
                              <td className="px-4 py-2">{room.infantCount}</td>
                              <td className="px-4 py-2">{room.adultCount}</td>
                              <td className="px-4 py-2">{room.seniorCount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}            </div>
          )}
          {data.tourVoucher && data.tourVoucher.length > 0 && (
            <div className="border-t pt-4">
              <>
                <h3 className="uppercase text-sm tracking-[18px] text-center font-medium bg-yellow-300 py-1">Tour</h3>
              </>

              {data.tourVoucher.map((tour, index) => (
                <div className='my-2'>
                  <p className='mb-1 text-xs'>Tour #{index + 1}</p>
                  <div key={tour.id} className="text-xs grid grid-cols-2">
                    {tour.itineraries.length > 0 && (
                      <div className="col-span-2 my-2">
                        <h4 className="font-semibold mb-1">Itineraries</h4>
                        <table className="w-full text-left text-xs border">
                          <thead>
                            <tr>
                              <th className="border px-2 py-1">Title</th>
                              <th className="border px-2 py-1">Description</th>
                              <th className="border px-2 py-1">Start Date</th>
                              <th className="border px-2 py-1">End Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tour.itineraries.map(itinerary => (
                              <tr key={itinerary.id}>
                                <td className="border px-2 py-1">{itinerary.title}</td>
                                <td className="border px-2 py-1">{itinerary.description}</td>
                                <td className="border px-2 py-1">{format(new Date(itinerary.startDate), "MMMM d, yyyy")}</td>
                                <td className="border px-2 py-1">{format(new Date(itinerary.endDate), "MMMM d, yyyy")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  </div>
                  <div className='flex w-full text-xs'>
                    <p><p className='font-semibold'>Remarks:</p> {tour.remarks}</p>
                  </div>

                </div>))}
            </div>
          )}
          {data.transportVoucher && data.transportVoucher.length > 0 && (
            <div className="border-t pt-4">
              <>
                <h3 className="uppercase text-sm tracking-[18px] text-center font-medium bg-red-300 py-1">Transport</h3>
              </>

              {data.transportVoucher.map((transport, index) => (
                <div className='my-2'>
                  <p className='mb-1 text-xs'>Transport #{index + 1}</p>

                  <div key={transport.id} className="text-xs grid grid-cols-2 gap-4">
                    <div>
                      <p>Vehicle Type: {VehicleType[transport.vehicleType]}</p>
                      <p>Vehicle Plate: {transport.vehiclePlateNumber}</p>
                      <p>Service Type: {TransportServiceType[transport.serviceType]}</p>
                    </div>
                    <div>
                      <p>Driver: {transport.driverName}</p>
                      <p>Contact: {transport.driverContact}</p>
                    </div>
                    {transport.remarks && <div><p>Remarks: {transport.remarks}</p></div>}
                    {transport.itineraries.length > 0 && (
                      <div className="col-span-2 my-2">
                        <h4 className="font-semibold mb-1">Itineraries</h4>
                        <table className="w-full text-left text-xs border">
                          <thead>
                            <tr>
                              <th className="border px-2 py-1">Title</th>
                              <th className="border px-2 py-1">Description</th>
                              <th className="border px-2 py-1">Start Date</th>
                              <th className="border px-2 py-1">End Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transport.itineraries.map(itinerary => (
                              <tr key={itinerary.id}>
                                <td className="border px-2 py-1">{itinerary.title}</td>
                                <td className="border px-2 py-1">{itinerary.description}</td>
                                <td className="border px-2 py-1">{format(new Date(itinerary.startDate), "MMMM d, yyyy")}</td>
                                <td className="border px-2 py-1">{format(new Date(itinerary.endDate), "MMMM d, yyyy")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        <div className='flex items-end justify-evenly gap-4 text-muted-foreground mt-4 flex-3 pb-4'>
          <div className='w-full text-center max-w-[250px] text-[12px] text-muted-foreground'>
            <div className='flex-1 border-b leading-[16px]'>
              {data.preparedBy && (
                <div className='flex flex-col items-center'>
                  {data.preparedBy.signature && (
                    <img
                      className='relative -bottom-2 h-[45px] object-contain'
                      src={data.preparedBy.signature}
                      alt="signature"
                    />
                  )}
                  <span className='text-[12px] font-semibold uppercase'>
                    {`${data?.preparedBy?.firstName} ${data?.preparedBy?.lastName}`}
                  </span>
                </div>
              )}
            </div>
            <span className='leading-[16px]'>
              Prepared by
            </span>
          </div>
          <div className='w-full text-center max-w-[250px] text-[12px] text-muted-foreground'>
            <div className='flex-1 border-b leading-[16px]'>
              {data.approver && (
                <div className='flex flex-col items-center'>
                  {data.approver.signature && (
                    <img
                      className='relative -bottom-2 h-[45px] object-contain'
                      src={data.approver.signature}
                      alt="signature"
                    />
                  )}
                  <span className='text-[12px] font-semibold uppercase'>
                    {`${data?.approver?.firstName} ${data?.approver?.lastName}`}
                  </span>
                </div>
              )}
            </div>
            <span className='leading-[16px]'>
              Approved & Reviewed by
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
