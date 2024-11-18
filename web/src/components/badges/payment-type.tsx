import { PaymentType } from "@/interfaces/purchase-request.interface";
import { Badge } from "../ui/badge";

interface Props {
  value: PaymentType;
}

const badgeStyleMap: Record<PaymentType, string> = {
  CASH: 'bg-green-100 hover:bg-green-200',
  CHECK: 'bg-blue-100 hover:bg-blue-200',
}

const labelMap: Record<PaymentType, string> = {
  CASH: 'Cash',
  CHECK: 'Check',
}

export default function PaymentTypeBadge({value}: Props) {
  return (
    <Badge
      className={`text-slate-700 ${badgeStyleMap[value]} cursor-default text-[10px] w-fit min-w-[125px] justify-center`}
    >
      {labelMap[value]}
    </Badge>
  )
}
