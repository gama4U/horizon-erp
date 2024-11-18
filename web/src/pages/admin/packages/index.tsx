import { useQuery } from "@tanstack/react-query";
import TopBar from "@/components/section/topbar";
import usePagination from "@/hooks/usePagination";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import CommonInput from "@/components/common/input";
import { useAuth } from "@/providers/auth-provider";
import { fetchPackages } from "@/api/queries/package.query";
import { Columns } from "@/components/tables/packages/columns";
import { DataTable } from "@/components/tables/packages/data-table";
import CreatePackageDialog from "@/components/dialogs/package/create";

export default function Packages() {
  const { skip, take, pagination, onPaginationChange } = usePagination();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { branch } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['packages', pagination, debouncedSearch, branch],
    queryFn: async () => await fetchPackages({ skip, take, search: debouncedSearch, ...(branch && {branch}) })
  });

  return (
    <div className="space-y-2">
      <TopBar
        LeftSideHeader={
          <p className="text-sm">
            Proposals
          </p>
        }
        LeftSideSubHeader={
          <p className="text-primary text-xs">Manage proposals here.</p>
        }
      />
      <div className="space-y-4 bg-white p-4 rounded-lg">
        <div className="flex items-center justify-between py-1 gap-x-2">
          <div className="flex flex-1 gap-2 items-center p-[1px]">
            <CommonInput
              placeholder="Search by package no. or name"
              containerProps={{
                className: "w-full"
              }}
              defaultValue={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <CreatePackageDialog />
          </div>
        </div>
        <DataTable
          columns={Columns}
          data={data?.packages ?? []}
          total={data?.total ?? 0}
          loading={isLoading}
          onPaginationChange={onPaginationChange}
          pagination={pagination}
        />
      </div>
    </div>
  )
}
