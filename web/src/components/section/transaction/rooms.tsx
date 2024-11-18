import { IRoomAccommodation } from '@/interfaces/accommodation.interface'
import AddRoomAccommodation from '@/components/dialogs/transaction/accommodation-voucher/rooms/add'
import DeleteRoomAccommodation from '@/components/alert/transactions/acccommodation/rooms/delete'
import EditRoomAccommodation from '@/components/dialogs/transaction/accommodation-voucher/rooms/edit';

interface Props {
  data: IRoomAccommodation[],
  accommodationId: string;
}

export default function RoomAccommodations({ data, accommodationId }: Props) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 max-w-full my-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className='text-xs '>
          Number of Rooms Accommodated: {data.length}
        </h1>
        <AddRoomAccommodation accommodationId={accommodationId} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-xs text-slate-600">
          <thead className="bg-slate-100 text-center">
            <tr>
              <th className="px-4 py-2">Room #</th>
              <th className="px-4 py-2">Children</th>
              <th className="px-4 py-2">Infants</th>
              <th className="px-4 py-2">Adults</th>
              <th className="px-4 py-2">Senior Citizens</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.map((room, index) => (
              <tr key={index} className="border-t border-slate-200 text-center">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{room.childrenCount}</td>
                <td className="px-4 py-2">{room.infantCount}</td>
                <td className="px-4 py-2">{room.adultCount}</td>
                <td className="px-4 py-2">{room.seniorCount}</td>
                <td className="px-4 py-2 text-right">
                  <EditRoomAccommodation accommodationId={accommodationId} id={room.id} roomData={room} />
                  <DeleteRoomAccommodation accommodationId={accommodationId} id={room.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
