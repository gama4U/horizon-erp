import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { ClientTypeFilter } from '../../../interfaces/sales-agreement.interface'
import Constants from '../../../constants';

interface Props {
  value: ClientTypeFilter | string;
  onValueChange: (value: ClientTypeFilter) => void;
}

export default function ClientTypeFilterSelect({ value, onValueChange }: Props) {
  return (
    <Select onValueChange={onValueChange} value={value ?? 'all'}>
      <SelectTrigger className="w-fit min-w-[200px] h-[40px] py-0 gap-[12px] text-muted-foreground bg-slate-100 border-none text-[12px]">
        <SelectValue placeholder="Filter by Client Type" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(Constants.ClientTypesMap).map(([value, label], index) => (
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
