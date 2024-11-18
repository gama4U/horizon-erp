import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../ui/checkbox";
import { IMemorandum } from "@/api/queries/memorandums.query";
import { Calendar, CircleUser, Hash, LetterText, ListTodo, NotepadText } from "lucide-react";
import { Link } from "react-router-dom";
import DeleteMemorandum from "@/components/alert/memorandum/delete";
import { useAuth } from "@/providers/auth-provider";
import { UserType } from "@/interfaces/user.interface";
import { format } from "date-fns"
import Constants from "@/constants";

export const Columns: ColumnDef<IMemorandum>[] = [
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
		id: "memorandumNumber",
		header: () => <div className="flex items-center gap-x-2">
			<p>Memorandum</p>
			<Hash color="white" size={16} />
		</div>,

		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<span>{`${row.original.memorandumNumber}`}</span>
				</div>
			)
		}
	},
	{
		id: "to",
		header: () => <div className="flex items-center gap-x-2">
			<p>To</p>
			<CircleUser color="white" size={16} />
		</div>,
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<span className="text-xs">
						{row.original.to}
					</span>
				</div>
			)
		}
	},
	{
		id: "subject",
		header: () => <div className="flex items-center gap-x-2">
			<p>Subject</p>
			<LetterText color="white" size={16} />
		</div>,
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<span className="text-xs">
						{row.original.subject}
					</span>
				</div>
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
					<Link to={`/${user?.userType === UserType.ADMIN ? 'admin' : 'employee'}/memorandum/${row.original.id}`}>
						<NotepadText
							size={16}
							className="cursor-pointer hover:text-primary"
						/>
					</Link>
					{(user?.permission && PermissionsCanDelete.includes(user.permission)) && (
						<DeleteMemorandum
							memorandumId={row.original.id}
						/>
					)}
				</div>
			)
		},
	},
];
