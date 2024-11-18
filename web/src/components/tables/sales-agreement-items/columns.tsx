import { ColumnDef } from "@tanstack/react-table";
import EditSalesAgreementItemDialog from "../../dialogs/sales-agreement/edit-item";
import { ISalesAgreementItem } from "../../../interfaces/sales-agreement-item.interface";
import DeleteSalesAgreementItem from "../../alert/sales-agreement/delete-item";
import { useAuth } from "@/providers/auth-provider";
import Constants from "@/constants";

export const Columns: ColumnDef<ISalesAgreementItem>[] = [
  {
    id: "particulars",
    header: "Particulars",
    cell: ({ row }) => (
      <ul className="list-disc ml-4">
        {row.original.particulars.map(item => (
          <li>
            {item}
          </li>
        ))}
      </ul> 
    ),
  },
  {
    id: "quantity",
    header: "Qty.",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.quantity.toLocaleString()}
      </span>
    )
  },
  {
    id: "unitPrice",
    header: "Unit price",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.unitPrice.toLocaleString()}
      </span>
    )
  },
  {
    id: "serviceFee",
    header: "Service fee",
    cell: ({ row }) => (
      <span className="capitalize">
        {(row.original.serviceFee || 0).toLocaleString()}
      </span>
    )
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => (
      <span className="capitalize">
        {(row.original.total + (row.original.serviceFee ?? 0)).toLocaleString()}
      </span>
    )
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { session: { user } } = useAuth();
      const { PermissionsCanEdit, PermissionsCanDelete } = Constants;
      return (
        <div className="flex items-center gap-4">
          {(user?.permission && PermissionsCanEdit.includes(user?.permission)) && (
            <EditSalesAgreementItemDialog data={row.original} />
          )}
          {(user?.permission && PermissionsCanDelete.includes(user?.permission)) && (
            <DeleteSalesAgreementItem salesAgreementItemId={row.original.id} />
          )}
        </div>
      )
    },
  },
];
