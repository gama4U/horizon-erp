import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../ui/checkbox";
import { ArrowDownAZ, ArrowUpAZ, ArrowUpDown, ListTodo, NotepadText, TicketCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { ITransaction, VoucherTypes } from "@/interfaces/transaction.interface";
import { VoucherBadge } from "@/components/badges/voucher-type";
import DeleteTransaction from "@/components/alert/transactions/delete";
import { useAuth } from "@/providers/auth-provider";
import { UserType } from "@/interfaces/user.interface";
import Constants from "@/constants";
import { Button } from "@/components/ui/button";

export const Columns: ColumnDef<ITransaction>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				className="border-white"
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "client.name",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					className="text-xs"
					onClick={() => { column.toggleSorting(column.getIsSorted() === "asc") }}
				>
					Name
					{isSorted === "asc" && <ArrowUpAZ className="ml-2 h-4 w-4" />}
					{isSorted === "desc" && <ArrowDownAZ className="ml-2 h-4 w-4" />}
					{!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}				</Button>
			)
		},
		enableSorting: true,
	},

	{
		id: "transactionNumber",
		header: () => <div className="flex items-center gap-x-2">
			<p>Transaction #</p>
		</div>,
		cell: ({ row }) => {
			if (!row.original.client) return;
			return (
				<div className="flex items-cetter gap-2">
					<span>{row.original.transactionNumber}</span>
				</div>
			)
		}
	},
	{
		id: "serialNumber",
		header: "SA Serial #",
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<span className="text-xs">
						{row.original.salesAgreement?.serialNumber ?? <span className="italic text-gray-300">No sales agreement attached</span>}
					</span>

				</div>
			)
		}
	},
	{
		id: "purchaseOrderId",
		header: "PO Serial #",
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<span className="text-xs">
						{row.original.purchaseOrder?.serialNumber ?? <span className="italic text-gray-300">No purchase order attached</span>}
					</span>
				</div>
			)
		}
	},
	{
		id: "voucherCount",
		header: () => <div className="flex items-center gap-x-2">
			<p>Vouchers</p>
			<TicketCheck color="white" size={16} />
		</div>,
		cell: ({ row }) => {
			const { voucherCounts } = row.original;
			const totalVouchers = Object.values(voucherCounts).reduce((sum, count) => sum + count, 0);

			return (
				<div className="flex items-center gap-x-1">
					{totalVouchers > 0 ? (
						Object.entries(voucherCounts).map(([type, count]) => (
							count > 0 && (
								<VoucherBadge key={type} type={type as VoucherTypes} count={count} />
							)
						))
					) : (
						<span className="italic text-gray-300">No vouchers included</span>
					)}
				</div>
			);
		}
	},
	{
		id: "actions",
		header: () => <div className="flex items-center gap-x-2">
			<p>Actions</p>
			<ListTodo color="white" size={16} />
		</div>,
		enableHiding: false,
		cell: ({ row }) => {
			const { session: { user } } = useAuth();
			const { PermissionsCanDelete } = Constants;
			return (
				<div className="flex items-center justify-start gap-4">
					<Link to={`/${user?.userType === UserType.ADMIN ? 'admin' : 'employee'}/transactions/${row.original.id}`}>
						<NotepadText
							size={16}
							className="cursor-pointer hover:text-primary"
						/>
					</Link>
					{user?.permission && PermissionsCanDelete.includes(user.permission) && (
						<DeleteTransaction
							transactionId={row.original.id}
						/>
					)}
				</div>
			)
		},
	},
];
