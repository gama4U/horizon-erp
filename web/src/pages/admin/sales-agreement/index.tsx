import { useQuery } from "@tanstack/react-query";
import TopBar from "../../../components/section/topbar";
import { Columns } from "../../../components/tables/sales-agreement/columns";
import { DataTable } from "../../../components/tables/sales-agreement/data-table";
import usePagination from "../../../hooks/usePagination";
import { useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import CreateSalesAgreementDialog from "../../../components/dialogs/sales-agreement/create";
import { ClientTypeFilter } from "../../../interfaces/sales-agreement.interface";
import CommonInput from "../../../components/common/input";
import ClientTypeFilterSelect from "../../../components/select/sales-agreement/client-type-filter";
import { fetchSalesAgreements } from "@/api/queries/sales-agreements.queries";
import { useAuth } from "@/providers/auth-provider";
import { OfficeBranch } from "@/interfaces/user.interface";
import { Button } from "@/components/ui/button";
import AnimatedDiv from "@/components/animated/Div";

export default function SalesAgreements() {
  const { skip, take, pagination, onPaginationChange } = usePagination();
  const [search, setSearch] = useState('');
  const [clientTypeFilter, setClientTypeFilter] = useState<ClientTypeFilter | string>("");
  const debouncedSearch = useDebounce(search, 500);
  const { branch } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['sales-agreements', pagination, debouncedSearch, clientTypeFilter, branch],
    queryFn: async () => await fetchSalesAgreements({
      skip,
      take,
      branch: branch as OfficeBranch,
      search,
      ...(clientTypeFilter && {
        typeOfClient: clientTypeFilter
      })
    })
  });

  const handleClearFilters = () => {
    setClientTypeFilter("")
  }

  return (
    <div className="space-y-2">
      <TopBar
        LeftSideHeader={
          <p className="text-sm">
            Sales Agreements
          </p>
        }
        LeftSideSubHeader={
          <p className="text-primary text-xs">Manage sales agreements here.</p>
        }
      />
      <div className="space-y-4 bg-white p-4 rounded-lg">
        <div className="flex gap-2 justify-between">
          <div className="flex flex-1 gap-2 items-center p-[1px]">
            <CommonInput
              placeholder="Search by client name or serial no."
              containerProps={{
                className: "w-full"
              }}
              defaultValue={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <ClientTypeFilterSelect
              value={clientTypeFilter}
              onValueChange={(value) => setClientTypeFilter(value)}
            />
            {clientTypeFilter &&
              <AnimatedDiv animationType="Shake">
                <Button onClick={handleClearFilters}
                  className="text-xs"
                  variant={'destructive'}>Clear Filters
                </Button>
              </AnimatedDiv>
            }
          </div>
          <CreateSalesAgreementDialog />
        </div>
        <DataTable
          columns={Columns}
          loading={isLoading}
          data={data?.salesAgreements ?? []}
          total={data?.total ?? 0}
          onPaginationChange={onPaginationChange}
          pagination={pagination}
        />
      </div>
    </div>
  )
}
