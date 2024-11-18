import { useParams } from "react-router-dom"
import TopBar from "../../../components/section/topbar";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/animated/Loader";
import { fetchPackage } from "@/api/queries/package.query";
import { useAuth } from "@/providers/auth-provider";
import { Separator } from "@/components/ui/separator";
import Constants from "@/constants";
import EditPackageDialog from "@/components/dialogs/package/edit";
import PackageInfo from "@/components/section/package/info";
import PrintPreview from "@/components/section/package/print-preview";

export default function PackageDetails() {
  const { id } = useParams();
  const {session: {user}} = useAuth();
  const {PermissionsCanEdit} = Constants;

  const { data, isLoading } = useQuery({
    queryKey: ['package-details', id],
    queryFn: async () => {
      if (!id) return;
      return await fetchPackage(id)
    },
  });

  return (
    <div className="space-y-2">
      <TopBar
        showBackButton={true}
        LeftSideHeader={
          <p className="text-sm">
            Package details
          </p>
        }
        LeftSideSubHeader={
          <p className="text-primary text-xs">
            Manage package details here
          </p>
        }
      />
      <div className="w-full flex gap-x-2 rounded-lg">
        <Loader isLoading={isLoading} />
        {data ? (
          <>
            <section className="w-full">
              <div className="h-[50px] flex px-4 justify-between items-center">
                <h1 className="text-[12px] font-semibold">
                  Details
                </h1>
                {(user?.permission && PermissionsCanEdit.includes(user?.permission)) && (
                  <EditPackageDialog data={data} />
                )}
              </div>
              <Separator className="bg-slate-200" />
              <PackageInfo data={data}/>
            </section>

            <PrintPreview data={data}/>
          </>
        ) : (
          <div className="h-[90vh] bg-white w-full rounded-lg" />
        )}
      </div>
    </div>
  )
}
