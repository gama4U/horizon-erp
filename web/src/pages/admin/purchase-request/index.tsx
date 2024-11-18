import { useQuery } from "@tanstack/react-query";
import TopBar from "../../../components/section/topbar";
import usePagination from "../../../hooks/usePagination";
import { useState, useEffect } from "react";
import useDebounce from "../../../hooks/useDebounce";
import CommonInput from "../../../components/common/input";
import { fetchPurchaseRequestOrders } from "@/api/queries/purchase-request.queries";
import CreatePurchaseRequestDialog from "@/components/dialogs/purchase-request/create";
import { DataTable } from "@/components/tables/purchase-request/data-table";
import { Columns } from "@/components/tables/purchase-request/columns";
import { useAuth } from "@/providers/auth-provider";
import { OfficeBranch } from "@/interfaces/user.interface";
import { CostOfSalesClassificationsType, DisbursementType, ExpensesClassificationsType } from "@/interfaces/purchase-request.interface";
import AnimatedDiv from "@/components/animated/Div";
import { Button } from "@/components/ui/button";
import DisbursementTypeFilter from "@/components/select/purchase-request/disbursement-type-filter";
import ClassificationFilter from "@/components/select/purchase-request/classification-filter";

export default function PurchaseRequests() {
  const { skip, take, pagination, onPaginationChange } = usePagination();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [typeFilter, setTypeFilter] = useState<DisbursementType | string>('');
  const { branch } = useAuth();

  const [classificationFilter, setClassificationFilter] = useState<CostOfSalesClassificationsType | ExpensesClassificationsType | string>('');

  useEffect(() => {
    setClassificationFilter('');
  }, [typeFilter]);

  const { data, isLoading } = useQuery({
    queryKey: ['purchase-requests', pagination, debouncedSearch, branch, typeFilter, classificationFilter],
    queryFn: async () => await fetchPurchaseRequestOrders({
      skip,
      take,
      search,
      branch: branch as OfficeBranch,
      ...(typeFilter && { type: typeFilter }),
      ...(classificationFilter && { classification: classificationFilter })
    })
  });

  const handleClearFilters = () => {
    setTypeFilter("");
    setClassificationFilter("");
  }

  return (
    <div className="space-y-2">
      <TopBar
        LeftSideHeader={
          <p className="text-sm">Purchase Requests</p>
        }
        LeftSideSubHeader={
          <p className="text-primary text-xs">Manage purchase request here.</p>
        }
      />
      <div className="space-y-4 bg-white p-4 rounded-lg">
        <div className="flex gap-2 justify-between">
          <div className="flex flex-1 gap-2 items-center p-[1px]">
            <CommonInput
              placeholder="Search by supplier name or serial no."
              containerProps={{ className: "w-full" }}
              defaultValue={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <DisbursementTypeFilter
              value={typeFilter}
              onValueChange={setTypeFilter}
            />
            {typeFilter &&
              <ClassificationFilter
                disbursementType={typeFilter}
                value={classificationFilter}
                onValueChange={setClassificationFilter}
              />
            }
            {typeFilter &&
              <AnimatedDiv animationType="Shake">
                <Button onClick={handleClearFilters} className="text-xs" variant={'destructive'}>
                  Clear Filters
                </Button>
              </AnimatedDiv>
            }
          </div>
          <CreatePurchaseRequestDialog />
        </div>
        <DataTable
          columns={Columns}
          data={data?.purchaseRequests ?? []}
          loading={isLoading}
          total={data?.total ?? 0}
          onPaginationChange={onPaginationChange}
          pagination={pagination}
        />
      </div>
    </div>
  )
}
