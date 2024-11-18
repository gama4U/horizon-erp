import { Separator } from '../../ui/separator'
import { DataTable } from '@/components/tables/purchase-request-items/data-table';
import { IPurchaseRequestOrderItem } from '@/interfaces/purchase-request-item.interface';
import { Columns } from '@/components/tables/purchase-request-items/columns';
import AddPurchaseRequestItemDialog from '@/components/dialogs/purchase-request/add-item';

interface Props {
  data: IPurchaseRequestOrderItem[],
  purchaseRequestId: string;
}

export default function PurchaseRequestItems({ data, purchaseRequestId }: Props) {
  return (
    <div className='p-4'>
      <div className="border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between py-1 px-2">
          <h1 className='text-[12px] font-semibold'>
            Items
          </h1>
          <AddPurchaseRequestItemDialog
            purchaseRequestId={purchaseRequestId}
          />
        </div>
        <Separator />
        <DataTable
          columns={Columns}
          data={data}
        />
      </div>
    </div>
  )
}
