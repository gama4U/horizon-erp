import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/section/topbar";
import usePagination from "@/hooks/usePagination";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { fetchTransactions } from "@/api/queries/transaction";
import CommonInput from "@/components/common/input";
import { DataTable } from "@/components/tables/transactions/data-table";
import { Columns } from "@/components/tables/transactions/columns";
import { VoucherTypeFilter } from "@/components/custom/voucher-type-filter";
import { VoucherFilters, VoucherTypes } from "@/interfaces/transaction.interface";
import CreateTransactionDialog from "@/components/dialogs/transaction/add";
import { useAuth } from "@/providers/auth-provider";
import { UserType } from "@/interfaces/user.interface";

export default function Transactions() {
  const { skip, take, pagination, onPaginationChange } = usePagination();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [openCreateTransaction, setOpenCreateTransaction] = useState(false)

  const [voucherFilters, setVoucherFilters] = useState<VoucherFilters>({
    travel: false,
    accommodation: false,
    tour: false,
    transport: false
  });
  const { session: { user }, branch } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['transactions', pagination, debouncedSearch, voucherFilters, branch],
    queryFn: async () => await fetchTransactions({ skip, take, search: debouncedSearch, branch, ...voucherFilters })
  });

  const navigate = useNavigate();

  const handleVoucherFilterToggle = (type: VoucherTypes) => {
    setVoucherFilters((prevFilters) => ({
      ...prevFilters,
      [type]: !prevFilters[type]
    }));
  };
  return (
    <div className="space-y-2">
      <TopBar
        LeftSideHeader={
          <p className="text-sm">
            Transactions
          </p>
        }
        LeftSideSubHeader={
          <p className="text-primary text-xs">Manage your Transactions here.</p>
        }
      />
      <div className="space-y-4 bg-white p-4 rounded-lg">
        <div className="flex items-center justify-between py-1 gap-x-2">
          <div className="flex flex-1 gap-2 items-center p-[1px]">
            <CommonInput
              placeholder="Search by transaction number or client name"
              containerProps={{
                className: "w-full"
              }}
              defaultValue={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="flex flex-row gap-x-1 bg-slate-100 rounded-sm p-[7.2px] ">
              {Object.values(VoucherTypes).map((type) => (
                <VoucherTypeFilter
                  key={type}
                  type={type}
                  selected={voucherFilters[type as keyof typeof voucherFilters]}
                  onToggle={handleVoucherFilterToggle}
                />
              ))}
            </div>
          </div>
          <Button
            size={"sm"}
            onClick={() => setOpenCreateTransaction(true)}
            className="flex gap-x-2"
          >
            <Plus size={14} />
            <span>Create</span>
          </Button>
        </div>

        <DataTable
          columns={Columns}
          data={data?.transactions ?? []}
          total={data?.total ?? 0}
          loading={isLoading}
          onPaginationChange={onPaginationChange}
          pagination={pagination}
        />
      </div>
      <CreateTransactionDialog
        openDialog={openCreateTransaction}
        setOpenDialog={setOpenCreateTransaction}
        successNavigate={(id) => {
          navigate(`/${user?.userType === UserType.ADMIN ? 'admin' : 'employee'}/transactions/${id}/`);
        }}
      />
    </div>
  )
}
