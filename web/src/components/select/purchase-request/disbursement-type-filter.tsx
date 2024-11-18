import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { DisbursementType, PurchaseRequestOrderType } from '@/interfaces/purchase-request.interface';

interface Props {
  value: PurchaseRequestOrderType | string;
  onValueChange: (value: PurchaseRequestOrderType) => void;
}

const DisbursementTypeMap: Record<DisbursementType, string> = {
  "Cost of Sales": "Cost of Sales",
  "Expenses": "Expenses"
}

export default function DisbursementTypeFilter({ value, onValueChange }: Props) {
  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className="w-fit min-w-[200px] h-[40px] py-0 gap-[12px] text-muted-foreground bg-slate-100 border-none text-[12px]">
        <SelectValue placeholder="Filter by Type" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(DisbursementTypeMap).map(([value, label], index) => (
          <SelectItem
            key={index}
            value={value}
            className="text-[12px] text-muted-foreground"
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
