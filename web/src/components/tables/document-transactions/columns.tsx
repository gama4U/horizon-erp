import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../ui/checkbox";
import { ArrowDownAZ, ArrowUpAZ, ArrowUpDown, Calendar, File, Hash, LetterText, ListTodo, NotepadText } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";
import { UserType } from "@/interfaces/user.interface";
import { format } from "date-fns"
import Constants from "@/constants";
import { IDocumentTransaction } from "@/api/queries/document-transaction.query";
import { DocumentTransactionBadge } from "@/components/badges/document-transaction-type";
import DeleteDocumentTransaction from "@/components/alert/document-transactions/delete";
import { Button } from "@/components/ui/button";

export const Columns: ColumnDef<IDocumentTransaction>[] = [
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
					Client Name
					{isSorted === "asc" && <ArrowUpAZ className="ml-2 h-4 w-4" />}
					{isSorted === "desc" && <ArrowDownAZ className="ml-2 h-4 w-4" />}
					{!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}				</Button>
			)
		},
		enableSorting: true,
	},
	{
		id: "dtsNumber",
		header: () => <div className="flex items-center gap-x-2">
			<p>DTS</p>
			<Hash color="white" size={16} />
		</div>,

		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<span>{`${row.original.dtsNumber}`}</span>
				</div>
			)
		}
	},
	{
		id: "type",
		header: () => <div className="flex items-center gap-x-2">
			<p>Type</p>
			<LetterText color="white" size={16} />
		</div>,
		cell: ({ row }) => {
			return (
				<DocumentTransactionBadge forTable={true} type={row.original.type} />
			);
		}
	},
	{
		id: "documents",
		header: () => <div className="flex items-center gap-x-2">
			<p>Documents</p>
			<File color="white" size={16} />
		</div>,
		cell: ({ row }) => {
			return (
				<span className="capitalize">
					{row.original.documents.length}
				</span>
			);
		}
	},

	{
		id: "createdAt",
		header: () => <div className="flex items-center gap-x-2">
			<p>Date Created</p>
			<Calendar color="white" size={16} />
		</div>,
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<span className="text-xs">{format(new Date(row?.original?.createdAt ?? new Date), 'MMMM d, yyyy')}</span>
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
					<Link to={`/${user?.userType === UserType.ADMIN ? 'admin' : 'employee'}/document-transactions/${row.original.id}`}>
						<NotepadText
							size={16}
							className="cursor-pointer hover:text-primary"
						/>
					</Link>
					{(user?.permission && PermissionsCanDelete.includes(user.permission)) && (
						<DeleteDocumentTransaction
							id={row.original.id}
						/>
					)}
				</div>
			)
		},
	},
];
