import { useQuery } from "@tanstack/react-query";
import TopBar from "../../../components/section/topbar";
import usePagination from "../../../hooks/usePagination";
import { useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import CommonInput from "../../../components/common/input";
import { fetchUsers } from "@/api/queries/user.query";
import { DataTable } from "@/components/tables/users/data-table";
import { Columns } from "@/components/tables/users/columns";
import UserTypeFilter from "@/components/select/user/user-type-filter";
import { UserType } from "@/interfaces/user.interface";
import CreateUserDialog from "@/components/dialogs/user/create-user";
import { useAuth } from "@/providers/auth-provider";

export default function Users() {
  const { skip, take, pagination, onPaginationChange } = usePagination();
  const [search, setSearch] = useState('');
  const [userType, setUserType] = useState<UserType | 'ALL'>('ALL');
  const debouncedSearch = useDebounce(search, 500);
  const { branch } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['users', pagination, debouncedSearch, userType, branch],
    queryFn: async () => await fetchUsers({
      skip,
      take,
      search,
      branch,
      ...(userType !== 'ALL' && {
        type: userType
      })
    })
  });

  return (
    <div className="space-y-2">
      <TopBar
        LeftSideHeader={
          <p className="text-sm">
            Users
          </p>
        }
        LeftSideSubHeader={
          <p className="text-primary text-xs">Manage users here.</p>
        }
      />
      <div className="space-y-4 bg-white p-4 rounded-lg">
        <div className="flex gap-2 justify-between">
          <div className="flex flex-1 gap-2 items-center p-[1px] gap-x-2">
            <CommonInput
              placeholder="Search by name or email"
              containerProps={{
                className: "w-full"
              }}
              defaultValue={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <UserTypeFilter
              value={userType}
              onValueChange={(value) => setUserType(value)}
            />
          </div>
          <CreateUserDialog />
        </div>
        <DataTable
          columns={Columns}
          data={data?.users ?? []}
          loading={isLoading}
          total={data?.total ?? 0}
          onPaginationChange={onPaginationChange}
          pagination={pagination}
        />
      </div>
    </div>
  )
}
