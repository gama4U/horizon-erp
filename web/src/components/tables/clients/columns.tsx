import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../ui/checkbox";
import EditClientDialog from "@/components/dialogs/clients/edit";
import EmailLink from "@/components/common/email";
import DeleteLeadDialog from "@/components/alert/client/delete";
import { useAuth } from "@/providers/auth-provider";
import Constants from "@/constants";
import ClientTypeBadge from "@/components/badges/client-type";
import { IClient } from "@/api/mutations/client.mutation";
import { ArrowDownAZ, ArrowUpAZ, ArrowUpDown, CircleCheck, ListTodo, Mail, MapPinHouse, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Columns: ColumnDef<IClient>[] = [
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
		enableHiding: false,
	},
	{
		accessorKey: "name",
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
		id: "email",
		header: () => <div className="flex items-center gap-x-2">
			<p>Email</p>
			<Mail color="white" size={16} />
		</div>,

		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<EmailLink email={row.original.email} />
				</div>
			)
		}
	},
	{
		id: "contactNumber",
		header: () => <div className="flex items-center gap-x-2">
			<p>Contact</p>
			<Phone color="white" size={16} />
		</div>,
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<span className="text-xs">
						{row.original.contactNumber}  {row.original.contactPerson ? `- ${row.original.contactPerson}` : ""}
					</span>
				</div>
			)
		}
	},
	{
		id: "typeOfClient",
		header: "Client type",
		cell: ({ row }) => (
			<ClientTypeBadge
				value={row.original.clientType}
			/>
		)
	},

	{
		id: "department",
		header: () => <div className="flex items-center gap-x-2">
			<p>Department</p>
			<MapPinHouse color="white" size={16} />
		</div>,
		cell: ({ row }) => {
			if (!row.original.department) {
				return (
					<span className="text-xs italic text-muted-foreground">
						No department assigned
					</span>
				)
			}
			return (
				<div className="flex items-center gap-2">
					<span className="text-xs">
						{row.original.department}
					</span>
				</div>
			)
		}
	},
	{
		id: "approverId",
		header: () => <div className="flex items-center gap-x-2">
			<p>Status</p>
		</div>,
		cell: ({ row }) => {
			return (
				<div className="flex justify-center items-center gap-2">
					<span className="text-xs">
						{row.original.approverId ?
							<Badge variant="outline" className="gap-2 font-normal border-white p-2 text-white bg-primary">Approved <CircleCheck size={'14px'} /></Badge> :
							<Badge variant="outline" className="font-normal text-muted-foreground bg-muted p-2">Pending</Badge>}
					</span>
				</div>
			)
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
					<EditClientDialog
						clientData={row.original}
					/>
					{(user?.permission && PermissionsCanDelete.includes(user.permission)) && (
						<DeleteLeadDialog
							clientId={row.original.id}
						/>
					)}
				</div>
			)
		},
	},
];
