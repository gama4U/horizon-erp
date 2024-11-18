import { ColumnDef } from "@tanstack/react-table";
import { IPurchaseRequestOrderItem } from "@/interfaces/purchase-request-item.interface";
import DeletePurchaseRequestItem from "@/components/alert/purchse-request/delete-item";
import EditPurchaseRequestItemDialog from "@/components/dialogs/purchase-request/edit-item";
import Constants from "@/constants";
import { useAuth } from "@/providers/auth-provider";

export const Columns: ColumnDef<IPurchaseRequestOrderItem>[] = [
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
    id: "total",
    header: "Total",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.total.toLocaleString()}
      </span>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const {PermissionsCanDelete, PermissionsCanEdit} = Constants;
      const {session: {user}} = useAuth();
      return (
        <div className="flex items-center gap-4"> 
          {(user?.permission && PermissionsCanDelete.includes(user.permission)) && (
            <DeletePurchaseRequestItem purchaseRequestId={row.original.id}/>
          )}
           {(user?.permission && PermissionsCanEdit.includes(user.permission)) && (
            <EditPurchaseRequestItemDialog data={row.original} />
          )}
        </div>
      )
    },
  },
];
