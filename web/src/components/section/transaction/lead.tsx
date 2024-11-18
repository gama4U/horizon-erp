import { Separator } from "../../ui/separator";
import { IClient } from "@/api/mutations/client.mutation";
import ClientTypeBadge from "@/components/badges/client-type";
import EditClientDialog from "@/components/dialogs/clients/edit";

interface ClientDetailsProps {
  clientData: IClient;
  forSelection?: boolean
}

export default function ClientDetails({ clientData, forSelection }: ClientDetailsProps) {

  return (
    <div className="flex flex-col gap-y-6 p-2 m-2 sm:p-6 lg:p-0 mt-2 bg-white ">
      <div className="mb-2 p-2">
        <div className="flex flex-row justify-between items-center">
          <p className="text-sm font-semibold">Client Information</p>
          {!forSelection &&
            <EditClientDialog clientData={clientData} />
          }
        </div>

        <Separator className="my-2" />

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <p className="text-xs font-medium">Name:</p>
            <p className="text-xs text-gray-700">{clientData.name}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <p className="text-xs font-medium">Client Type</p>
            <ClientTypeBadge value={clientData.clientType} />
          </div>
          {clientData.department &&
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <p className="text-xs font-medium">Department</p>
              <p className="text-xs text-gray-700">{clientData.department}</p>
            </div>
          }
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <p className="text-xs font-medium">Office Branch:</p>
            <p className="text-xs text-gray-700">{clientData.officeBranch}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <p className="text-xs font-medium">Contact Number:</p>
            <p className="text-xs text-gray-700">{clientData.contactNumber}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <p className="text-xs font-medium">Email Address:</p>
            <p className="text-xs text-gray-700">{clientData.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
