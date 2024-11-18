import { ColumnDef } from "@tanstack/react-table";
import { useAuth } from "@/providers/auth-provider";
import Constants from "@/constants";
import { IPackageAccommodation } from "@/interfaces/package.interface";
import UpdatePackageAccommodationDialog from "@/components/dialogs/package/edit-accommodation";
import { formatCurrency } from "@/utils/currency.utils";
import DeletePackageAccommodationDialog from "@/components/alert/package/delete-accommodation";

export const Columns: ColumnDef<IPackageAccommodation>[] = [
  {
    id: "category",
    header: "Hotel category",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.category}
      </span>
    ),
  },
  {
    id: "hotelOptions",
    header: "Hotel options",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <ul className="list-disc list-inside marker:text-gray-500">
          {row.original.options.map((option, index) => (
            <li key={index} className="list-item gap-1">
              {option}
            </li>
          ))}
        </ul>
      </div>
    )
  },
  {
    id: "ratePerPerson",
    header: "Rate per person",
    cell: ({ row }) => (
      <span className="capitalize">
        {formatCurrency(row.original.currency, row.original.ratePerPerson)}
      </span>
    )
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const {session: {user}} = useAuth();
      const {PermissionsCanEdit, PermissionsCanDelete} = Constants;
      const accommodation = row.original;
      return (
        <div className="flex items-center gap-4">
          {(user?.permission && PermissionsCanEdit.includes(user?.permission)) && (
            <UpdatePackageAccommodationDialog packageAccommodation={accommodation}/>
          )}
          {(user?.permission && PermissionsCanDelete.includes(user?.permission)) && (
            <DeletePackageAccommodationDialog id={row.original.id} />
          )}
        </div>
      )
    },
  },
];
