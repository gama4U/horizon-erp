import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { CostOfSalesClassificationsType, DisbursementType, ExpensesClassificationsType, PurchaseRequestOrderType } from '@/interfaces/purchase-request.interface';

interface Props {
  value: PurchaseRequestOrderType | string;
  onValueChange: (value: PurchaseRequestOrderType) => void;
  disbursementType?: DisbursementType | string
}

const costOfSalesMap: Record<CostOfSalesClassificationsType, string> = {
  "Ticketing": "Ticketing",
  "Tour Packages": "Tour Packages",
  "Documentation": "Documentation",
  "Accommodation": "Accommodation",
  "Transportation": "Transportation",
  "Others": "Others",
}
const expensesMap: Record<ExpensesClassificationsType, string> = {
  "Operating Expenses": "Operating Expenses",
  "MKT and Advertising": "MKT and Advertising",
  "Administrative Exp": "Administrative Exp",
  "Depreciation": "Depreciation",
  "Taxes": "Taxes",
  "Travel": "Travel",
  "Employee Benefits": "Employee Benefits",
}

export default function ClassificationFilter({ value, onValueChange, disbursementType }: Props) {
  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className="w-fit min-w-[200px] h-[40px] py-0 gap-[12px] text-muted-foreground bg-slate-100 border-none text-[12px]">
        <SelectValue placeholder="Filter by Classification" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(disbursementType === DisbursementType['Cost of Sales'] ? costOfSalesMap : expensesMap).map(([value, label], index) => (
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
