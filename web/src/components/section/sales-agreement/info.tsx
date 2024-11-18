import { Currency } from "@/interfaces/sales-agreement-item.interface"
import { ISalesAgreement } from "../../../interfaces/sales-agreement.interface"
import ClientTypeBadge from "../../badges/client-type"

interface Props {
  data: ISalesAgreement
}

const currencyMap: Record<Currency, string> = {
  PHP: 'Philippine Peso (PHP)',
  USD: 'US Dollar (USD)'
}

export default function SalesAgreementInfo({ data }: Props) {
  return (
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
          Ser. no.
        </span>
        <h3 className="text-[12px]">
          {data.serialNumber}
        </h3>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-[10px]">
          Type of client
        </span>
        <ClientTypeBadge
          value={data.client?.clientType}
        />
      </div>
      <div>
        <span className="text-muted-foreground text-[10px]">
          Client name
        </span>
        <h3 className="text-[12px]">
          {data.client.name}
        </h3>
      </div>
      <div>
        <span className="text-muted-foreground text-[10px]">
          Contact Number:
        </span>
        <h3 className="text-[12px]">
          {data.client.contactNumber}
        </h3>
      </div>
      {data.client.contactPerson &&
        <div>
          <span className="text-muted-foreground text-[10px]">
            Contact Person:
          </span>
          <h3 className="text-[12px]">
            {data.client.contactPerson}
          </h3>
        </div>
      }
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
      {data.client.department && (
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-[10px]">
            Department
          </span>
          <h3 className="text-[12px]">
            {data.client.department}
          </h3>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-[10px]">
          Currency
        </span>
        <h3 className="text-[12px]">
          {currencyMap[data.currency]}
        </h3>
      </div>
    </div>
  )
}
