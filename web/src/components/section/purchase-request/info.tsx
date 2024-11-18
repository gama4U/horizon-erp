import { IPurchaseRequestOrder } from "@/interfaces/purchase-request.interface"
import { Currency } from "@/interfaces/sales-agreement-item.interface"

interface Props {
  data: IPurchaseRequestOrder
}

const currencyMap: Record<Currency, string> = {
  PHP: 'Philippine Peso (PHP)',
  USD: 'US Dollar (USD)'
}

export default function PurchaseRequestInfo({ data }: Props) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-[10px]">
            Creator
          </span>
          <h3 className="text-[12px]">
            {`${data.creator?.firstName} ${data.creator?.lastName}`}
          </h3>
        </div>
        <div>
          <span className="text-muted-foreground text-[10px]">
            Purchase request no.
          </span>
          <h3 className="text-[12px]">
            {data.serialNumber}
          </h3>
        </div>
        <div>
          <span className="text-muted-foreground text-[10px]">
            Sales agreement no.
          </span>
          <h3 className="text-[12px]">
            {data.salesAgreement?.serialNumber}
          </h3>
        </div>
        <div>
          <span className="text-muted-foreground text-[10px]">
            Supplier's name
          </span>
          <h3 className="text-[12px]">
            {data.supplier?.name}
          </h3>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-[10px]">
            Disbursement type
          </span>
          <h3 className="text-[12px]">
            {data.disbursementType}
          </h3>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-[10px]">
            Classification
          </span>
          <h3 className="text-[12px]">
            {data.classification}
          </h3>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-[10px]">
            Classification type
          </span>
          <h3 className="text-[12px]">
            {data.classificationType}
          </h3>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-[10px]">Currency</span>
          <h3 className="text-[12px]">
            {data.currency && currencyMap[data.currency]}
          </h3>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-[10px]">
            Prepared by
          </span>
          <h3 className="text-[12px]">
            {`${data.creator?.firstName || ''} ${data.creator?.lastName || ''}`}
          </h3>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-[10px]">
            Approved by
          </span>
          <h3 className="text-[12px]">
            {`${data.approver?.firstName || ''} ${data.approver?.lastName || ''}`}
          </h3>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-[10px]">
            Others.
          </span>
          <h3 className="text-[12px]">
            {data.other}
          </h3>
        </div>
      </div>
    </>
  )
}
