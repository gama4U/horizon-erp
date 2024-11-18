import { PurchaseRequestOrderType } from "@/interfaces/purchase-request.interface";
import { Badge } from "../ui/badge";

interface Props {
  value: PurchaseRequestOrderType;
}

const badgeStyleMap: Record<PurchaseRequestOrderType, string> = {
  ACCOMMODATION: 'bg-green-100 hover:bg-green-200',
  INTERNATIONAL_AIRLINE_TICKETING: 'bg-purple-100 hover:bg-purple-200',
  DOMESTIC_AIRLINE_TICKETING: 'bg-orange-100 hover:bg-orange-200',
  SHIPPING: 'bg-teal-100 hover:bg-teal-200',
  TRANSPORTATION_RENTAL: 'bg-indigo-100 hover:bg-indigo-200',
  VISA: 'bg-blue-100 hover:bg-blue-200',
}

const labelMap: Record<PurchaseRequestOrderType, string> = {
  ACCOMMODATION: 'Accommodation',
  VISA: 'Visa',
  TRANSPORTATION_RENTAL: 'Transportation Rental',
  SHIPPING: 'Shipping',
  DOMESTIC_AIRLINE_TICKETING: 'Domestic Airline',
  INTERNATIONAL_AIRLINE_TICKETING: 'International Airline',
}

export default function PurchaseRequestTypeBadge({ value }: Props) {
  return (
    <Badge
      className={`text-slate-700 ${badgeStyleMap[value]} cursor-default text-[10px] w-fit min-w-[125px] justify-center`}
    >
      {labelMap[value]}
    </Badge>
  )
}
