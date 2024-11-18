import { Columns } from '../../tables/sales-agreement-items/columns'
import { DataTable } from '../../tables/sales-agreement-items/data-table'
import { Separator } from '../../ui/separator'
import AddSalesAgreementItemDialog from '../../dialogs/sales-agreement/add-item'
import { ISalesAgreementItem } from '../../../interfaces/sales-agreement-item.interface'
// import Constants from '@/constants'
import { useAuth } from '@/providers/auth-provider'
import { UserType } from '@/interfaces/user.interface'

interface Props {
  data: ISalesAgreementItem[],
  salesAgreementId: string;
  approverId?: string;
}

export default function SalesAgreementItems({ data, salesAgreementId, approverId }: Props) {
  // const { PermissionsCanEdit } = Constants;
  const { session: { user } } = useAuth();

  return (
    <div className='p-4'>
      <div className="border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between py-1 px-2">
          <h1 className='text-[12px] font-semibold'>
            Items
          </h1>
          {((user?.userType === UserType.EMPLOYEE && !approverId) || user?.userType === UserType.ADMIN) && (
            <AddSalesAgreementItemDialog salesAgreementId={salesAgreementId} />
          )}
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
