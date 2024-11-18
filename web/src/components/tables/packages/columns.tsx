import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../ui/checkbox";
import { IPackage } from "@/interfaces/package.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import EditPackageDialog from "@/components/dialogs/package/edit";
import DeletePackageDialog from "@/components/alert/package/delete";
import { Link } from "react-router-dom";
import { Calendar, NotepadText } from "lucide-react";
import { UserType } from "@/interfaces/user.interface";
import Constants from "@/constants";
import { useAuth } from "@/providers/auth-provider";

export const Columns: ColumnDef<IPackage>[] = [
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
    id: "packageNumber",
    header: "Package no.",
    cell: ({ row }) => (
      <span>
        {row.original.packageNumber}
      </span>
    ),
  },
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => (
      <span>
        {row.original.name}
      </span>
    ),
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
    id: "approver",
    header: "Approved by",
    cell: ({ row }) => (
      <span>
        {`
          ${row.original.approver?.firstName ?? ''}
          ${row.original.approver?.lastName ?? ''}
        `}
      </span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { PermissionsCanEdit, PermissionsCanDelete } = Constants;
      const { session: { user } } = useAuth();
      return (
        <div className="flex items-center justify-center gap-4">
          <Link to={`/${user?.userType === UserType.ADMIN ? 'admin' : 'employee'}/packages/${row.original.id}`}>
            <NotepadText
              size={16}
              className="cursor-pointer hover:text-primary"
            />
          </Link>
          {user?.permission && PermissionsCanEdit.includes(user?.permission) && (
            <EditPackageDialog
              data={row.original}
            />
          )}
          {user?.permission && PermissionsCanDelete.includes(user?.permission) && (
            <DeletePackageDialog
              packageId={row.original.id}
            />
          )}
        </div>
      )
    },
  },
];
