import { useQuery } from "@tanstack/react-query";
import TopBar from "../../../components/section/topbar";
import usePagination from "../../../hooks/usePagination";
import { useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import CommonInput from "../../../components/common/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react"
import { useAuth } from "@/providers/auth-provider";
import { useNavigate } from "react-router-dom";
import { UserType } from "@/interfaces/user.interface";
import { fetchDocumentTransactions } from "@/api/queries/document-transaction.query";
import { DataTable } from "@/components/tables/document-transactions/data-table";
import { Columns } from "@/components/tables/document-transactions/columns";
import CreateDocumentTransactionDialog from "@/components/dialogs/document-transactions/add";
import { DocumentTransactionTypeFilter } from "@/components/custom/document-type-filter";
import { DocumentTransactionFilters, DocumentTransactionType } from "@/api/mutations/document-transaction.mutation";

export default function DocumentTransactions() {
	const { skip, take, pagination, onPaginationChange } = usePagination();
	const { session, branch } = useAuth()
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search, 500);
	const [openCreateDocument, setOpenCreateDocument] = useState(false)
	const navigate = useNavigate();

	const [documentFilters, setDocumentFilters] = useState<DocumentTransactionFilters>({
		TRANSMITTAL: false,
		RETURN: false,
		RECIEVE: false,
	});

	const { data, isLoading } = useQuery({
		queryKey: ['document-transactions', pagination, debouncedSearch, documentFilters],
		queryFn: async () => await fetchDocumentTransactions({
			skip,
			take,
			search,
			branch,
			...documentFilters
		})
	});

	const handleDocumentFilterToggle = (type: DocumentTransactionType) => {
		setDocumentFilters((prevFilters) => ({
			...prevFilters,
			[type]: !prevFilters[type]
		}));
	};


	return (
		<div className="space-y-2">
			<TopBar
				LeftSideHeader={
					<p className="text-sm">
						Document Transactions
					</p>
				}
				LeftSideSubHeader={
					<p className="text-primary text-xs">Manage document transactions here(Transmittals, Returned, Recieved).</p>
				}
			/>
			<div className="space-y-4 bg-white p-4 rounded-lg">
				<div className="flex gap-2 justify-between">
					<div className="flex flex-1 gap-2 items-center p-[1px] justify-between">
						<div className="flex flex-row  items-center w-full gap-x-2">
							<CommonInput
								placeholder="Search by dts no. or client name"
								containerProps={{
									className: "w-full"
								}}
								defaultValue={search}
								onChange={(event) => setSearch(event.target.value)}
							/>
							<div className="flex flex-row gap-x-1 bg-slate-100 rounded-sm p-[7.2px] ">
								{Object.values(DocumentTransactionType).map((type) => (
									<DocumentTransactionTypeFilter
										key={type}
										type={type}
										selected={documentFilters[type as keyof typeof documentFilters]}
										onToggle={handleDocumentFilterToggle}
									/>
								))}
							</div>
						</div>
						<Button
							size={"sm"}
							onClick={() => setOpenCreateDocument(true)}
							className="flex gap-x-2"
						>
							<Plus size={14} />
							<span>Create</span>
						</Button>

					</div>
					<CreateDocumentTransactionDialog
						openDialog={openCreateDocument}
						setOpenDialog={setOpenCreateDocument}
						creatorId={String(session?.user?.id)}
						successNavigate={(id) => {
							navigate(`/${session?.user?.userType === UserType.ADMIN ? 'admin' : 'employee'}/document-transactions/${id}/`);
						}}
					/>
				</div>
				<DataTable
					columns={Columns}
					loading={isLoading}
					data={data?.documentTransactionData ?? []}
					total={data?.total ?? 0}
					onPaginationChange={onPaginationChange}
					pagination={pagination}
				/>
			</div>
		</div>
	)
}
