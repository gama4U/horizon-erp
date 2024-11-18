import { useParams } from "react-router-dom"
import TopBar from "../../../components/section/topbar";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "../../../components/ui/separator";
import PrintPreview from "../../../components/section/sales-agreement/print-preview";
import SalesAgreementInfo from "../../../components/section/sales-agreement/info";
import SalesAgreementItems from "../../../components/section/sales-agreement/items";
import EditSalesAgreementDialog from "../../../components/dialogs/sales-agreement/edit";
import { fetchSalesAgreement } from "@/api/queries/sales-agreements.queries";
import Loader from "@/components/animated/Loader";
import { useAuth } from "@/providers/auth-provider";
import Constants from "@/constants";

export default function SalesAgreementDetails() {
  const { id } = useParams();
  const { session: { user } } = useAuth();
  const { PermissionsCanEdit } = Constants;

  const { data, isLoading } = useQuery({
    queryKey: ['sales-agreement-details', id],
    queryFn: async () => {
      if (!id) return;
      return await fetchSalesAgreement(id)
    },
  });


  return (
    <div className="space-y-2">
      <TopBar
        showBackButton={true}
        LeftSideHeader={
          <p className="text-sm">
            Sales agreement details
          </p>
        }
        LeftSideSubHeader={
          <p className="text-primary text-xs">
            Manage sales agreement details here
          </p>
        }
      />
      <div className="w-full flex gap-x-2 rounded-lg">
        <Loader isLoading={isLoading} />
        {data ? (
          <>
            <section className="w-full bg-white rounded-lg">
              <div className="h-[50px] flex px-4 justify-between items-center">
                <h1 className="text-[12px] font-semibold">
                  Details
                </h1>
                {(user?.permission && PermissionsCanEdit.includes(user?.permission)) && (
                  <EditSalesAgreementDialog data={data} />
                )}
              </div>
              <Separator className="bg-slate-200" />
              <SalesAgreementInfo data={data} />
              <SalesAgreementItems
                data={data.salesAgreementItems}
                salesAgreementId={data.id}
              />
            </section>
            <PrintPreview data={data} />
          </>
        ) : (
          <div className="h-[90vh] bg-white w-full rounded-lg" />
        )}
      </div>
    </div>
  )
}
