import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { format } from "date-fns";
import { ArrowDownAZ, ArrowUpAZ, ArrowUpDown, Calendar, NotepadText } from "lucide-react";
import { Link } from "react-router-dom";
import { IPurchaseRequestOrder } from "@/interfaces/purchase-request.interface";
import EditPurchaseRequestDialog from "@/components/dialogs/purchase-request/edit";
import DeletePurchaseRequest from "@/components/alert/purchse-request/delete";
import { useAuth } from "@/providers/auth-provider";
import { UserType } from "@/interfaces/user.interface";
import Constants from "@/constants";
import { Button } from "@/components/ui/button";

export const Columns: ColumnDef<IPurchaseRequestOrder>[] = [
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
    accessorKey: "supplier.name",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="text-xs"
          onClick={() => { column.toggleSorting(column.getIsSorted() === "asc") }}
        >
          Supplier Name
          {isSorted === "asc" && <ArrowUpAZ className="ml-2 h-4 w-4" />}
          {isSorted === "desc" && <ArrowDownAZ className="ml-2 h-4 w-4" />}
          {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      )
    },
    enableSorting: true,
  },
  {
    id: "creator",
    header: "Creator",
    cell: ({ row }) => {
      if (!row.original.creator) return;
      const { firstName, lastName, avatar } = row.original.creator;
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={avatar} className="object-cover" />
            <AvatarFallback>
              {firstName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{`${firstName} ${lastName}`}</span>
        </div>
      )
    }
  },
  {
    id: "serialNumber ",
    header: "Ser. No.",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.serialNumber}
      </span>
    )
  },
  {
    id: "disbursementType",
    header: "Disbursement Type",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.disbursementType}
      </span>
    )
  },
  {
    id: "classification",
    header: "Classification",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.classification}
      </span>
    )
  },
  {
    id: "createdAt",
    header: () => <div className="flex items-center gap-x-2">
      <p>Date Created</p>
      <Calendar color="white" size={16} />
    </div>,
    cell: ({ row }) => {
      return (
        <span className="capitalize">
          {format(new Date(row.original.createdAt), 'MMMM d, h:mm a')}
        </span>
      )
    }
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { session: { user } } = useAuth();
      const { PermissionsCanEdit, PermissionsCanDelete } = Constants;
      return (
        <div className="flex items-center justify-center gap-4">
          <Link to={`/${user?.userType === UserType.ADMIN ? 'admin' : 'employee'}/purchase-requests/${row.original.id}`}>
            <NotepadText
              size={16}
              className="cursor-pointer hover:text-primary"
            />
          </Link>
          {(user?.permission && PermissionsCanEdit.includes(user.permission)) && (
            <EditPurchaseRequestDialog
              data={row.original}
            />
          )}
          {(user?.permission && PermissionsCanDelete.includes(user.permission)) && (
            <DeletePurchaseRequest
              purchaseRequestId={row.original.id}
            />
          )}
        </div>
      )
    },
  },
];
