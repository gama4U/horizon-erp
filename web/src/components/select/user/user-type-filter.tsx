import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { UserType } from '@/interfaces/user.interface';

interface Props {
  value: UserType | 'ALL';
  onValueChange: (value: UserType | 'ALL') => void;
}

const selectItemsMap: Record<UserType | 'ALL',  string> = {
  ALL: 'All',
  ADMIN: 'Admin',
  EMPLOYEE: 'Employee'
}

export default function UserTypeFilter({value, onValueChange}: Props) {
  return (
    <Select onValueChange={onValueChange} value={value ?? 'all'}>
      <SelectTrigger className="w-fit min-w-[150px] h-[40px] py-0 gap-[12px] text-muted-foreground bg-slate-100 border-none text-[12px]">
        <SelectValue placeholder="Select a verified email to display" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(selectItemsMap).map(([value, label], index) => (
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
