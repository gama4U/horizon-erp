import { UserType } from "@/interfaces/user.interface";
import { Badge } from "../ui/badge";

interface Props {
  value: UserType;
}

const badgeStyleMap: Record<UserType, string> = {
  ADMIN: 'bg-green-100 hover:bg-green-200',
  EMPLOYEE: 'bg-orange-100 hover:bg-orange-200',
} 

const badgeLabelMap: Record<UserType, string> = {
  ADMIN: 'Admin',
  EMPLOYEE: 'Employee',
} 

export default function UserTypeBadge({value}: Props) {
  return (
    <Badge
      className={`text-slate-700 ${badgeStyleMap[value]} cursor-default text-[10px] w-fit min-w-[125px] justify-center`}
    >
      {badgeLabelMap[value]}
    </Badge>
  )
}
